import fs from "fs";
import { Product } from "./models/Product.js";
import { ImageModel } from "./models/Image.js";
import { products as initialProducts } from "./data/products.js";
import { resolveLocalImage, getContentTypeFromExt, fetchRemoteImage } from "./imageHelper.js";

export const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("[MongoDB] Seeding initial PC parts products database...");
      await Product.insertMany(initialProducts);
      console.log(`[MongoDB] Successfully seeded ${initialProducts.length} PC parts products into MongoDB.`);
    }

    console.log("[MongoDB Image Store] Checking & syncing product images in MongoDB...");

    // 1. Sync any existing ImageModel documents that point to local files (e.g. edited in MongoDB Compass)
    const allImages = await ImageModel.find();
    for (const imgDoc of allImages) {
      const localFilePath = resolveLocalImage(imgDoc.originalUrl, imgDoc.filename);
      if (localFilePath) {
        try {
          const fileBuf = fs.readFileSync(localFilePath);
          const currentBufLength = imgDoc.data
            ? (typeof imgDoc.data.length === "function"
                ? imgDoc.data.length()
                : (imgDoc.data.buffer?.length || imgDoc.data.length || 0))
            : 0;
          if (currentBufLength !== fileBuf.length) {
            imgDoc.data = fileBuf;
            imgDoc.contentType = getContentTypeFromExt(localFilePath, imgDoc.contentType || "image/jpeg");
            await imgDoc.save();
            console.log(`[MongoDB Image Store] Synced real image data for ${imgDoc.imageId} from ${localFilePath} (${fileBuf.length} bytes)`);
          }
        } catch (err) {
          console.warn(`[MongoDB Image Store] Error reading local file for ${imgDoc.imageId}:`, err.message);
        }
      }
    }

    // 2. Process all products from MongoDB
    const productsInDb = await Product.find();
    let storedCount = 0;

    for (const prod of productsInDb) {
      let existingImage = await ImageModel.findOne({ imageId: prod.id });

      // Check if product image is a local file
      const localProductFile = resolveLocalImage("", prod.image);

      if (!existingImage) {
        let fileBuffer = null;
        let contentType = "image/jpeg";

        if (localProductFile) {
          try {
            fileBuffer = fs.readFileSync(localProductFile);
            contentType = getContentTypeFromExt(localProductFile);
          } catch (e) {}
        } else if (prod.image && prod.image.startsWith("http") && !prod.image.includes("/api/images/")) {
          const fetched = await fetchRemoteImage(prod.image);
          if (fetched) {
            fileBuffer = fetched.buffer;
            contentType = fetched.contentType;
          }
        }

        if (fileBuffer) {
          existingImage = await ImageModel.create({
            imageId: prod.id,
            filename: `${prod.id}.jpg`,
            contentType,
            data: fileBuffer,
            originalUrl: prod.image || ""
          });
          storedCount++;
        }
      } else if (localProductFile) {
        // Product image references a local file that changed
        try {
          const fileBuf = fs.readFileSync(localProductFile);
          const existingLen = existingImage.data
            ? (typeof existingImage.data.length === "function"
                ? existingImage.data.length()
                : (existingImage.data.buffer?.length || existingImage.data.length || 0))
            : 0;
          if (existingLen !== fileBuf.length) {
            existingImage.data = fileBuf;
            existingImage.contentType = getContentTypeFromExt(localProductFile);
            await existingImage.save();
          }
        } catch (e) {}
      }

      // Ensure product image points to a valid URL if missing
      let needsSave = false;
      if (!prod.image) {
        prod.image = `/api/images/${prod.id}`;
        needsSave = true;
      }
      if (!prod.fallbackImage) {
        prod.fallbackImage = `/images/${prod.id}.jpg`;
        needsSave = true;
      }

      // Seed initial reviews if empty
      if (!prod.reviews || prod.reviews.length === 0) {
        prod.reviews = [
          {
            userName: "Alex V.",
            userEmail: "alex@gamer.com",
            rating: 5,
            title: "Absolute performance beast!",
            comment: `Easily handles 4K ultra settings with insane framerates on ${prod.name}. Temps stay low under full load.`,
            createdAt: new Date(Date.now() - 86400000 * 2)
          },
          {
            userName: "Marcus T.",
            userEmail: "marcus@gamer.com",
            rating: 5,
            title: "Solid build quality & fast delivery",
            comment: `Ordered yesterday and received it within 24 hours. Packaging for ${prod.name} was pristine and sealed.`,
            createdAt: new Date(Date.now() - 86400000 * 7)
          }
        ];
        prod.reviewsCount = prod.reviews.length;
        prod.rating = 5.0;
        needsSave = true;
      }

      if (needsSave) {
        await prod.save();
      }
    }

    const totalImagesInDb = await ImageModel.countDocuments();
    console.log(`[MongoDB Image Store] Stored/verified ${storedCount} new images. Total images stored in MongoDB: ${totalImagesInDb}`);
  } catch (error) {
    console.error("[MongoDB] Error seeding database/images:", error.message);
  }
};
