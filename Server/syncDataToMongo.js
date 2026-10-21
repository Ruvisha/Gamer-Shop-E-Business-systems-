import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/Product.js";
import { ImageModel } from "./models/Image.js";
import { products, reviews } from "./productsData.js";
import { getContentTypeFromExt } from "./imageHelper.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Potential paths for Data folder
const candidateDataDirs = [
  path.resolve(__dirname, "../../Data"),
  path.resolve(__dirname, "../Data"),
  path.resolve(__dirname, "Data"),
  "E:\\New folder (5)\\Gamer Shop\\Data"
];

function findDataDirectory() {
  for (const dir of candidateDataDirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return dir;
    }
  }
  return null;
}

// Client public images directory
const clientPublicImagesDir = path.resolve(__dirname, "../Client/public/images");

export async function syncDataToMongo() {
  console.log("==================================================");
  console.log(" [Gamer Shop] Storing Data files to MongoDB Database ");
  console.log("==================================================");

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gamer_shop";
  if (mongoose.connection.readyState !== 1) {
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, family: 4 });
  }
  console.log(" Connected to MongoDB successfully:", mongoose.connection.name);

  const dataDir = findDataDirectory();
  if (!dataDir) {
    throw new Error("Could not find 'Data' directory in any expected path: " + candidateDataDirs.join(", "));
  }
  console.log(` Found Data source directory: ${dataDir}`);

  // Ensure Client/public/images exists
  if (!fs.existsSync(clientPublicImagesDir)) {
    fs.mkdirSync(clientPublicImagesDir, { recursive: true });
  }

  // Get all files recursively in Data directory
  const dataSubdirs = fs.readdirSync(dataDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const availableFiles = new Map(); // filename (lowercase) -> fullPath
  for (const sub of dataSubdirs) {
    const subPath = path.join(dataDir, sub);
    const files = fs.readdirSync(subPath, { withFileTypes: true })
      .filter(f => f.isFile());
    for (const file of files) {
      availableFiles.set(file.name.toLowerCase(), path.join(subPath, file.name));
    }
  }

  console.log(` Indexed ${availableFiles.size} physical image files in Data directory.`);

  let imagesStored = 0;
  let productsUpserted = 0;

  for (const prod of products) {
    const filename = (prod.fallbackImage || "").replace("/images/", "").trim();
    const cleanFilename = filename.toLowerCase();

    const localFilePath = availableFiles.get(cleanFilename);

    let imageBuffer = null;
    let contentType = "image/jpeg";

    if (localFilePath && fs.existsSync(localFilePath)) {
      imageBuffer = fs.readFileSync(localFilePath);
      contentType = getContentTypeFromExt(localFilePath);

      // Also copy to Client/public/images under both names for 100% offline fallback
      try {
        const destByName = path.join(clientPublicImagesDir, filename);
        const destById = path.join(clientPublicImagesDir, `${prod.id}.jpg`);
        fs.writeFileSync(destByName, imageBuffer);
        fs.writeFileSync(destById, imageBuffer);
      } catch (copyErr) {
        console.warn(`Could not copy static fallback for ${filename}:`, copyErr.message);
      }
    } else {
      console.warn(` Image file not found for product ${prod.id} (${filename})`);
    }

    if (imageBuffer) {
      // 1. Store in MongoDB 'images' collection under product ID (e.g. 'gpu-1')
      await ImageModel.findOneAndUpdate(
        { imageId: prod.id },
        {
          imageId: prod.id,
          filename: filename,
          contentType: contentType,
          data: imageBuffer,
          fileSize: imageBuffer.length,
          originalPath: localFilePath,
          originalUrl: `/api/images/${prod.id}`
        },
        { upsert: true, new: true }
      );

      // 2. Also store alias in 'images' under filename (e.g. 'asus rtx 4090.jpg')
      await ImageModel.findOneAndUpdate(
        { imageId: filename },
        {
          imageId: filename,
          filename: filename,
          contentType: contentType,
          data: imageBuffer,
          fileSize: imageBuffer.length,
          originalPath: localFilePath,
          originalUrl: `/api/images/${prod.id}`
        },
        { upsert: true, new: true }
      );

      imagesStored++;
    }

    // 3. Store/Update in MongoDB 'products' collection
    const productPayload = {
      ...prod,
      image: `/api/images/${prod.id}`,
      fallbackImage: `/images/${filename}`
    };

    // Keep existing reviews if already modified in DB, or seed default reviews
    const existingDbProduct = await Product.findOne({ id: prod.id });
    if (existingDbProduct && existingDbProduct.reviews && existingDbProduct.reviews.length > 0) {
      productPayload.reviews = existingDbProduct.reviews;
      productPayload.reviewsCount = existingDbProduct.reviews.length;
      productPayload.rating = existingDbProduct.rating;
    } else {
      productPayload.reviews = [
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
      productPayload.reviewsCount = productPayload.reviews.length;
      productPayload.rating = 5.0;
    }

    await Product.findOneAndUpdate(
      { id: prod.id },
      { $set: productPayload },
      { upsert: true, new: true }
    );
    productsUpserted++;
    console.log(`  [MongoDB] Stored ${prod.id}: "${prod.name}" (Image: ${imageBuffer ? `${imageBuffer.length} bytes binary in DB` : 'no-buffer'})`);
  }

  const totalProducts = await Product.countDocuments();
  const totalImages = await ImageModel.countDocuments();

  console.log("==================================================");
  console.log(` Successfully synchronized Data files to MongoDB:`);
  console.log(` - Products in MongoDB: ${totalProducts}`);
  console.log(` - Images stored in MongoDB: ${totalImages}`);
  console.log("==================================================");

  return { totalProducts, totalImages };
}

// If run directly via `node syncDataToMongo.js`
if (process.argv[1] && process.argv[1].endsWith("syncDataToMongo.js")) {
  syncDataToMongo()
    .then(() => {
      console.log("Sync complete! Exiting.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Sync failed:", err);
      process.exit(1);
    });
}
