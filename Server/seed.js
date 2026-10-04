import { Product } from "./models/Product.js";
import { ImageModel } from "./models/Image.js";
import { products as initialProducts } from "./data/products.js";

// Helper to download image binary buffer
async function fetchImageBuffer(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || "image/jpeg";
      return { buffer: Buffer.from(arrayBuffer), contentType };
    }
  } catch (err) {
    console.warn(`[MongoDB Image Store] Could not download from ${url}:`, err.message);
  }
  return null;
}

export const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("[MongoDB] Seeding initial PC parts products database...");
      await Product.insertMany(initialProducts);
      console.log(`[MongoDB] Successfully seeded ${initialProducts.length} PC parts products into MongoDB.`);
    }

    console.log("[MongoDB Image Store] Checking & storing product images in MongoDB...");
    const productsInDb = await Product.find();

    let storedCount = 0;
    for (const prod of productsInDb) {
      const existingImage = await ImageModel.findOne({ imageId: prod.id });
      if (!existingImage) {
        let imageData = null;
        if (prod.image && prod.image.startsWith("http")) {
          imageData = await fetchImageBuffer(prod.image);
        }

        if (imageData && imageData.buffer) {
          await ImageModel.create({
            imageId: prod.id,
            filename: `${prod.id}.jpg`,
            contentType: imageData.contentType,
            data: imageData.buffer,
            originalUrl: prod.image
          });
          storedCount++;
        }
      }

      // Ensure product image URL in MongoDB points to MongoDB served image route
      const mongoImageUrl = `http://localhost:3000/api/images/${prod.id}`;
      let needsSave = false;
      if (prod.image !== mongoImageUrl) {
        prod.image = mongoImageUrl;
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
    console.log(`[MongoDB Image Store] Stored ${storedCount} new images. Total images stored in MongoDB: ${totalImagesInDb}`);
  } catch (error) {
    console.error("[MongoDB] Error seeding database/images:", error.message);
  }
};
