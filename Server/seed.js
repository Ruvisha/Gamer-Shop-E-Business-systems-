import { Product } from "./models/Product.js";
import { products as initialProducts } from "./data/products.js";

export const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("[MongoDB] Seeding initial PC parts products database...");
      await Product.insertMany(initialProducts);
      console.log(`[MongoDB] Successfully seeded ${initialProducts.length} PC parts products into MongoDB.`);
    } else {
      console.log(`[MongoDB] Database already contains ${count} products. Skipping seeding.`);
    }
  } catch (error) {
    console.error("[MongoDB] Error seeding database:", error.message);
  }
};
