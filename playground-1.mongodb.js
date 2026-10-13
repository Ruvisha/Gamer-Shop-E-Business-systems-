/* global use, db */
// MongoDB Playground for Gamer Shop E-Business System
// Connect to: mongodb://127.0.0.1:27017 or mongodb://localhost:27017

// 1. Select the Gamer Shop database
use('gamer_shop');

// 2. View all products and their image paths
console.log("=== GAMER SHOP PRODUCTS ===");
const products = db.getCollection('products').find({}, { id: 1, name: 1, category: 1, price: 1, image: 1, fallbackImage: 1 }).toArray();
console.log(`Total Products: ${products.length}`);
console.log(products);

// 3. View all stored image documents in the images collection
console.log("=== STORED IMAGES IN MONGODB ===");
const images = db.getCollection('images').find({}, { imageId: 1, filename: 1, contentType: 1, originalUrl: 1 }).toArray();
console.log(`Total Images Stored: ${images.length}`);
console.log(images);

// 4. Return products count and categories breakdown
db.getCollection('products').aggregate([
  { $group: { _id: '$category', totalProducts: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
  { $sort: { totalProducts: -1 } }
]);
