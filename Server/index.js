import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB, setOnConnectCallback } from "./db.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { ImageModel } from "./models/Image.js";
import { Order } from "./models/Order.js";
import { DEFAULT_FALLBACK_IMAGE, resolveImageUrl, getContentTypeFromExt } from "./imageHelper.js";
import { syncDataToMongo } from "./syncDataToMongo.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

process.on('uncaughtException', (err) => {
  console.error('[Server Error] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server Error] Unhandled Rejection:', reason);
});

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Set callback to sync Data files into MongoDB on initial connect if needed
setOnConnectCallback(async () => {
  try {
    const prodCount = await Product.countDocuments();
    console.log(`[MongoDB] Database connected. Current products in DB: ${prodCount}`);
    if (prodCount === 0) {
      console.log("[MongoDB] Database empty. Syncing Data directory files into MongoDB...");
      await syncDataToMongo();
    }
  } catch (err) {
    console.warn("[MongoDB] onConnect auto-sync warning:", err.message);
  }
});

// Connect MongoDB directly
connectDB();

// CORS headers for client requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Gamer Shop E-Business Server API",
    dbStatus: mongoose.connection.readyState === 1 ? "Connected to MongoDB" : "Connecting to MongoDB...",
    status: "Active"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// GET /api/database/status: Database connection & collection statistics
app.get("/api/database/status", async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  let productsCount = 0;
  let imagesCount = 0;
  if (isConnected) {
    try {
      productsCount = await Product.countDocuments();
      imagesCount = await ImageModel.countDocuments();
    } catch (e) {}
  }
  res.json({
    connected: isConnected,
    dbName: mongoose.connection.name || "gamer_shop",
    productsCount,
    imagesCount,
    status: isConnected ? "Active & Connected to MongoDB" : "Connecting..."
  });
});

// POST /api/database/sync: Explicitly trigger data synchronization from Data folder into MongoDB
app.post("/api/database/sync", async (req, res) => {
  try {
    const result = await syncDataToMongo();
    res.json({
      success: true,
      message: "Data files successfully synchronized to MongoDB!",
      ...result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper to format product data and normalize image URLs for client rendering
export function formatProductForClient(product) {
  const p = product.toObject ? product.toObject() : { ...product };
  if (!p.image) {
    p.image = `/api/images/${p.id}`;
  }
  if (!p.fallbackImage) {
    p.fallbackImage = `/images/${p.id}.jpg`;
  }
  p.image = resolveImageUrl(p.image, `/api/images/${p.id}`);
  p.fallbackImage = resolveImageUrl(p.fallbackImage, `/images/${p.id}.jpg`);
  p.specs = (p.specs && typeof p.specs === "object") ? p.specs : {};
  p.wattage = typeof p.wattage === "number" ? p.wattage : 0;
  p.stock = typeof p.stock === "number" ? p.stock : 10;
  return p;
}

// MONGODB IMAGE STREAMING ENDPOINT: GET /api/images/:id
// Retrieves binary image data directly stored in MongoDB database
app.get("/api/images/:id", async (req, res) => {
  let { id } = req.params;
  try {
    id = decodeURIComponent(id);
  } catch (e) {}

  const cleanId = id.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "");

  try {
    if (mongoose.connection.readyState === 1) {
      // 1. Look up image binary buffer stored directly in MongoDB images collection
      const imgDoc = await ImageModel.findOne({
        $or: [
          { imageId: id },
          { imageId: cleanId },
          { filename: id },
          { filename: `${cleanId}.jpg` }
        ]
      });

      if (imgDoc && imgDoc.data) {
        const buf = Buffer.isBuffer(imgDoc.data) ? imgDoc.data : Buffer.from(imgDoc.data.buffer || imgDoc.data);
        res.setHeader("Content-Type", imgDoc.contentType || "image/jpeg");
        res.setHeader("Content-Length", buf.length);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(buf);
      }

      // If stored as an external URL
      if (imgDoc && imgDoc.originalUrl && imgDoc.originalUrl.startsWith("http")) {
        return res.redirect(imgDoc.originalUrl);
      }

      // 2. Check if product in MongoDB has an external image URL
      const isValidOid = mongoose.Types.ObjectId.isValid(id);
      const dbProduct = await Product.findOne({
        $or: [
          { id: id },
          { id: cleanId },
          ...(isValidOid ? [{ _id: id }] : [])
        ]
      });

      if (dbProduct && dbProduct.image && dbProduct.image.startsWith("http") && !dbProduct.image.includes("/api/images/")) {
        return res.redirect(dbProduct.image);
      }
    }
  } catch (err) {
    console.error("[Image Server] Error retrieving image from MongoDB:", err.message);
  }

  // 3. Fallback: Check local files in Client/public/images/ or Data/
  const candidateFiles = [
    path.resolve(__dirname, "..", "Client", "public", "images", `${id}.jpg`),
    path.resolve(__dirname, "..", "Client", "public", "images", id),
    path.resolve(__dirname, "..", "Client", "public", "images", `${cleanId}.jpg`),
    path.resolve(__dirname, "..", "..", "Data", id),
    path.resolve(__dirname, "..", "..", "Data", `${id}.jpg`),
    path.resolve(__dirname, "..", "..", "Data", `${cleanId}.jpg`)
  ];

  for (const cand of candidateFiles) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
      res.setHeader("Content-Type", getContentTypeFromExt(cand));
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.sendFile(cand);
    }
  }

  return res.redirect(DEFAULT_FALLBACK_IMAGE);
});

// IMAGE URL REGISTRATION ENDPOINT: POST /api/images/upload
app.post("/api/images/upload", async (req, res) => {
  const { imageId, imageUrl, originalUrl, base64Data, contentType = "image/jpeg" } = req.body;
  const id = imageId || `img-${Date.now()}`;

  try {
    if (mongoose.connection.readyState === 1) {
      let buffer = null;
      if (base64Data) {
        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
        buffer = Buffer.from(cleanBase64, "base64");
      }

      const updateData = {
        imageId: id,
        originalUrl: imageUrl || originalUrl || `/api/images/${id}`
      };
      if (buffer) {
        updateData.data = buffer;
        updateData.fileSize = buffer.length;
        updateData.contentType = contentType;
      }

      const savedImg = await ImageModel.findOneAndUpdate(
        { imageId: id },
        { $set: updateData },
        { upsert: true, returnDocument: 'after' }
      );
      return res.status(201).json({
        success: true,
        message: "Image stored in MongoDB",
        imageUrl: `/api/images/${savedImg.imageId}`,
        imageId: savedImg.imageId
      });
    }
    res.status(503).json({ error: "MongoDB is not connected." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Password hashing and validation utilities
function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "_GAMER_SHOP_SECURE_SALT").digest("hex");
}

function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword || !inputPassword) return false;
  if (storedPassword === inputPassword) return true; // Plaintext compatibility fallback
  return storedPassword === hashPassword(inputPassword);
}

// REGISTER / SIGN UP ENDPOINT: POST /api/auth/register (or /api/auth/signup)
app.post(["/api/auth/register", "/api/auth/signup"], async (req, res) => {
  const { email, password, gamerTag, name, phone, role = "user" } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required to create an account."
    });
  }

  const userEmail = email.trim().toLowerCase();
  const userName = (gamerTag || name || userEmail.split("@")[0]).trim();
  const userRole = role === "admin" || userEmail.includes("admin") ? "admin" : "user";

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters long."
    });
  }

  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: "Database is connecting. Please try again shortly."
    });
  }

  try {
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        isRegistered: true,
        error: "This email is already registered. Please sign in with your password."
      });
    }

    const loginLog = {
      loginTime: new Date(),
      ip: req.ip || req.headers['x-forwarded-for'] || "127.0.0.1",
      userAgent: req.headers['user-agent'] || "Browser Client",
      success: true
    };

    const newUser = await User.create({
      name: userName,
      email: userEmail,
      password: hashPassword(password),
      phone: phone || "",
      role: userRole,
      loginLogs: [loginLog]
    });

    const userProfile = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      loginLogsCount: 1,
      lastLogin: loginLog.loginTime
    };

    console.log(`[Auth Register] New user registered in MongoDB: ${newUser.email} (${newUser.role})`);

    return res.status(201).json({
      success: true,
      message: `Account created successfully! Welcome to Gamer Shop, ${userName}.`,
      user: userProfile
    });
  } catch (err) {
    console.error("[Auth Register Error]:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// LOGIN / SIGN IN ENDPOINT: POST /api/auth/login (or /api/auth/signin)
app.post(["/api/auth/login", "/api/auth/signin"], async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required to sign in."
    });
  }

  const userEmail = email.trim().toLowerCase();

  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: "Database is connecting. Please try again shortly."
    });
  }

  try {
    const dbUser = await User.findOne({ email: userEmail });
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        isRegistered: false,
        error: "No account found with this email. Please click Sign Up to register."
      });
    }

    // Validate password against stored database password
    const isPasswordValid = verifyPassword(password, dbUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password. Please verify your credentials and try again."
      });
    }

    // If existing account had plaintext password, upgrade it to hashed
    if (dbUser.password === password) {
      dbUser.password = hashPassword(password);
    }

    const loginLog = {
      loginTime: new Date(),
      ip: req.ip || req.headers['x-forwarded-for'] || "127.0.0.1",
      userAgent: req.headers['user-agent'] || "Browser Client",
      success: true
    };

    dbUser.loginLogs.push(loginLog);
    await dbUser.save();

    const userProfile = {
      id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone || "",
      role: dbUser.role,
      loginLogsCount: dbUser.loginLogs.length,
      lastLogin: loginLog.loginTime
    };

    console.log(`[Auth Login] User authenticated from MongoDB: ${dbUser.email} (${dbUser.role})`);

    return res.json({
      success: true,
      message: `Signed in successfully as ${dbUser.role.toUpperCase()}`,
      user: userProfile
    });
  } catch (err) {
    console.error("[Auth Login Error]:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET all users (with MongoDB login logs details for admin view)
app.get("/api/users", async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const users = await User.find().select("-password");
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json({ message: "MongoDB offline. Users logged in memory." });
});

// GET all products or search/filter (Direct MongoDB access)
app.get("/api/products", async (req, res) => {
  const { category, search, isFlashSale } = req.query;

  try {
    await connectDB();
    let filter = {};
    if (category && category !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }
    if (isFlashSale === 'true') {
      filter.isFlashSale = true;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { brand: regex }
      ];
    }

    const productsFromDb = await Product.find(filter).sort({ createdAt: -1 });
    return res.json(productsFromDb.map(formatProductForClient));
  } catch (err) {
    console.error("[Products] MongoDB fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch products from MongoDB", details: err.message });
  }
});

// GET product by ID (Direct MongoDB access)
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const dbProduct = await Product.findOne({
      $or: [{ id: id }, ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])]
    });
    if (dbProduct) {
      return res.json(formatProductForClient(dbProduct));
    }
    return res.status(404).json({ error: "Product not found in MongoDB database" });
  } catch (err) {
    console.error("[Products] MongoDB findById error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET categories directly derived from MongoDB products catalog
app.get("/api/categories", async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    const totalCount = await Product.countDocuments();
    const categoryMeta = {
      all: { name: "All Products", icon: "LayoutGrid" },
      gpu: { name: "Graphics Cards", icon: "Cpu" },
      cpu: { name: "Processors", icon: "Zap" },
      ram: { name: "RAM & Memory", icon: "MemoryStick" },
      mb: { name: "Motherboards", icon: "CircuitBoard" },
      storage: { name: "SSDs & Storage", icon: "HardDrive" },
      cooling: { name: "Liquid Cooling", icon: "Fan" },
      psu: { name: "Power Supplies", icon: "BatteryCharging" },
      case: { name: "PC Cases", icon: "Box" }
    };

    const categoriesList = [
      { id: "all", name: "All Products", icon: "LayoutGrid", count: totalCount }
    ];

    categoryStats.forEach(stat => {
      const meta = categoryMeta[stat._id] || { name: String(stat._id).toUpperCase(), icon: "Cpu" };
      categoriesList.push({
        id: stat._id,
        name: meta.name,
        icon: meta.icon,
        count: stat.count
      });
    });

    res.json(categoriesList);
  } catch (err) {
    console.error("[Categories] MongoDB aggregate error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET customer testimonials directly from MongoDB reviews
app.get("/api/testimonials", async (req, res) => {
  try {
    const prodsWithReviews = await Product.find({ "reviews.0": { $exists: true } }).select("id name brand reviews");
    const testimonials = [];
    let counter = 1;

    for (const p of prodsWithReviews) {
      for (const r of (p.reviews || [])) {
        testimonials.push({
          id: counter++,
          author: r.userName || "Verified Gamer",
          role: "PC Enthusiast & Gamer",
          rating: r.rating || 5,
          comment: r.comment,
          verified: true,
          product: p.name
        });
        if (testimonials.length >= 6) break;
      }
      if (testimonials.length >= 6) break;
    }

    res.json(testimonials);
  } catch (err) {
    console.error("[Testimonials] MongoDB fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/:id/reviews (Submit Customer Review directly to MongoDB)
app.post("/api/products/:id/reviews", async (req, res) => {
  const { id } = req.params;
  const { userName, userEmail, rating, title, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ error: "Rating score (1-5) and review comment are required." });
  }

  const reviewItem = {
    userName: userName || "Gamer Customer",
    userEmail: userEmail || "",
    rating: Number(rating),
    title: title || "Gamer Review",
    comment: comment.trim(),
    createdAt: new Date()
  };

  try {
    const dbProduct = await Product.findOne({
      $or: [{ id: id }, ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])]
    });

    if (!dbProduct) {
      return res.status(404).json({ error: "Product not found in MongoDB database" });
    }

    if (!dbProduct.reviews) dbProduct.reviews = [];
    dbProduct.reviews.unshift(reviewItem);
    const totalRating = dbProduct.reviews.reduce((sum, r) => sum + r.rating, 0);
    dbProduct.reviewsCount = dbProduct.reviews.length;
    dbProduct.rating = Number((totalRating / dbProduct.reviews.length).toFixed(1));

    await dbProduct.save();
    return res.json({
      success: true,
      message: "Review stored successfully in MongoDB!",
      product: formatProductForClient(dbProduct)
    });
  } catch (err) {
    console.error("[Reviews] MongoDB review submit error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Currency & Number sanitization helper
export function parseCurrencyNumber(val) {
  if (val === undefined || val === null || val === '') return NaN;
  if (typeof val === 'number') return isNaN(val) ? NaN : val;
  let s = String(val).trim();
  s = s.replace(/^(rs\.?|lkr|\$|eur|£)\s*/i, '');
  s = s.replace(/,/g, '');
  s = s.replace(/[^0-9.]/g, '');
  return parseFloat(s);
}

// ADMIN ONLY: POST /api/products (Create Product directly in MongoDB)
app.post("/api/products", async (req, res) => {
  const { name, category, brand, price, originalPrice, stock, image, description, specs, isFeatured, isFlashSale, tag, wattage } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Product title is required." });
  }

  const cleanCat = (category || 'gpu').toLowerCase().trim();

  // Robust price sanitization (handles numeric values, strings with commas or currency symbols like 'Rs. 450,000')
  const parsedPrice = parseCurrencyNumber(price);
  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ error: "Please provide a valid non-negative product price." });
  }

  // Robust originalPrice sanitization
  let parsedOrigPrice = parsedPrice;
  if (originalPrice !== undefined && originalPrice !== null && originalPrice !== '') {
    const pOrig = parseCurrencyNumber(originalPrice);
    if (!isNaN(pOrig) && pOrig >= parsedPrice) {
      parsedOrigPrice = pOrig;
    }
  }

  const parsedStock = (stock !== undefined && !isNaN(parseInt(stock, 10))) ? Math.max(0, parseInt(stock, 10)) : 10;
  const parsedWattage = (wattage !== undefined && !isNaN(parseInt(wattage, 10))) ? Math.max(0, parseInt(wattage, 10)) : 0;

  // Collision-safe product ID generation
  let productId = req.body.id;
  if (!productId || typeof productId !== 'string' || !productId.trim()) {
    const catPrefix = cleanCat.replace(/[^a-z0-9]/g, '') || 'item';
    productId = `${catPrefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  } else {
    productId = productId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  }

  try {
    await connectDB();

    // Check if an existing product already has this ID to prevent E11000 duplicate key error
    const existingProduct = await Product.findOne({ id: productId });
    if (existingProduct) {
      productId = `${productId}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    }

    let finalImageUrl = image;

    // Process uploaded base64 image and save directly to MongoDB ImageModel
    if (image && typeof image === "string" && image.startsWith("data:image")) {
      const commaIdx = image.indexOf(',');
      if (commaIdx !== -1) {
        try {
          const header = image.substring(0, commaIdx);
          const base64Data = image.substring(commaIdx + 1);
          const mimeMatch = header.match(/data:([^;]+)/);
          const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const buffer = Buffer.from(base64Data, "base64");

          await ImageModel.findOneAndUpdate(
            { imageId: productId },
            {
              $set: {
                imageId: productId,
                filename: `${productId}.${contentType.split("/")[1] || "jpg"}`,
                contentType,
                data: buffer,
                fileSize: buffer.length
              }
            },
            { upsert: true, returnDocument: 'after' }
          );
          finalImageUrl = `/api/images/${productId}`;
        } catch (imgErr) {
          console.error("[Products] Error saving base64 image to MongoDB:", imgErr.message);
        }
      }
      // Never store massive raw data URIs directly in Product document (avoids 16MB BSON limit)
      if (finalImageUrl && finalImageUrl.startsWith("data:image")) {
        finalImageUrl = `/api/images/${productId}`;
      }
    }

    const resolvedImg = resolveImageUrl(finalImageUrl, `/api/images/${productId}`);

    const newProductData = {
      id: productId,
      name: name.trim(),
      category: cleanCat,
      brand: brand && brand.trim() ? brand.trim() : 'Generic Gaming',
      price: parsedPrice,
      originalPrice: parsedOrigPrice,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      stock: parsedStock,
      wattage: parsedWattage,
      isFlashSale: Boolean(isFlashSale),
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      tag: tag && tag.trim() ? tag.trim() : (isFlashSale ? 'FLASH SALE' : 'NEW RELEASE'),
      image: resolvedImg,
      fallbackImage: resolvedImg,
      description: description && description.trim() ? description.trim() : `High-performance ${cleanCat.toUpperCase()} PC component engineered for peak gaming speed.`,
      specs: (specs && typeof specs === 'object') ? specs : {}
    };

    const createdProduct = await Product.create(newProductData);
    console.log(`[Products] Successfully created product: "${createdProduct.name}" (${createdProduct.id}) in MongoDB`);
    return res.status(201).json({
      success: true,
      message: "Product created directly in MongoDB",
      product: formatProductForClient(createdProduct)
    });
  } catch (err) {
    console.error("[Products] MongoDB create error:", err);
    return res.status(500).json({ error: `Failed to create product in MongoDB: ${err.message}` });
  }
});

// ADMIN ONLY: PUT /api/products/:id (Update Product directly in MongoDB)
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  let updatePayload = { ...req.body };

  if (updatePayload.name) updatePayload.name = updatePayload.name.trim();
  if (updatePayload.category) updatePayload.category = updatePayload.category.toLowerCase().trim();
  if (updatePayload.brand) updatePayload.brand = updatePayload.brand.trim();
  if (updatePayload.tag !== undefined) updatePayload.tag = updatePayload.tag.trim();
  if (updatePayload.description !== undefined) updatePayload.description = updatePayload.description.trim();

  if (updatePayload.price !== undefined) {
    const p = parseCurrencyNumber(updatePayload.price);
    if (!isNaN(p) && p >= 0) updatePayload.price = p;
  }
  if (updatePayload.originalPrice !== undefined) {
    const op = parseCurrencyNumber(updatePayload.originalPrice);
    if (!isNaN(op) && op >= 0) updatePayload.originalPrice = op;
  }
  if (updatePayload.stock !== undefined) {
    const s = parseInt(updatePayload.stock, 10);
    if (!isNaN(s)) updatePayload.stock = Math.max(0, s);
  }
  if (updatePayload.wattage !== undefined) {
    const w = parseInt(updatePayload.wattage, 10);
    if (!isNaN(w)) updatePayload.wattage = Math.max(0, w);
  }
  if (updatePayload.isFeatured !== undefined) {
    updatePayload.isFeatured = Boolean(updatePayload.isFeatured);
  }
  if (updatePayload.isFlashSale !== undefined) {
    updatePayload.isFlashSale = Boolean(updatePayload.isFlashSale);
  }
  if (updatePayload.specs && typeof updatePayload.specs === "object") {
    updatePayload.specs = updatePayload.specs;
  }

  // Handle uploaded base64 image update
  if (updatePayload.image && typeof updatePayload.image === "string" && updatePayload.image.startsWith("data:image")) {
    const commaIdx = updatePayload.image.indexOf(',');
    if (commaIdx !== -1) {
      try {
        await connectDB();
        const header = updatePayload.image.substring(0, commaIdx);
        const base64Data = updatePayload.image.substring(commaIdx + 1);
        const mimeMatch = header.match(/data:([^;]+)/);
        const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const buffer = Buffer.from(base64Data, "base64");

        await ImageModel.findOneAndUpdate(
          { imageId: id },
          {
            $set: {
              imageId: id,
              filename: `${id}.${contentType.split("/")[1] || "jpg"}`,
              contentType,
              data: buffer,
              fileSize: buffer.length
            }
          },
          { upsert: true, returnDocument: 'after' }
        );
        updatePayload.image = `/api/images/${id}`;
        updatePayload.fallbackImage = `/api/images/${id}`;
      } catch (imgErr) {
        console.error("[Products] Error saving updated base64 image:", imgErr.message);
      }
    }
    if (updatePayload.image && updatePayload.image.startsWith("data:image")) {
      updatePayload.image = `/api/images/${id}`;
      updatePayload.fallbackImage = `/api/images/${id}`;
    }
  } else if (updatePayload.image) {
    updatePayload.image = resolveImageUrl(updatePayload.image, `/api/images/${id}`);
    updatePayload.fallbackImage = updatePayload.image;
  }

  try {
    await connectDB();
    const updatedDbProduct = await Product.findOneAndUpdate(
      { $or: [{ id: id }, ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])] },
      { $set: updatePayload },
      { returnDocument: 'after' }
    );
    if (!updatedDbProduct) {
      return res.status(404).json({ error: "Product not found in MongoDB database" });
    }
    console.log(`[Products] Successfully updated product: "${updatedDbProduct.name}" (${id}) in MongoDB`);
    return res.json({
      success: true,
      message: "Product updated successfully in MongoDB",
      product: formatProductForClient(updatedDbProduct)
    });
  } catch (err) {
    console.error("[Products] MongoDB update error:", err.message);
    res.status(500).json({ error: `Failed to update product in MongoDB: ${err.message}` });
  }
});

// ADMIN ONLY: DELETE /api/products/:id (Delete Product directly from MongoDB)
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();
    await ImageModel.findOneAndDelete({ imageId: id });
    const deletedProduct = await Product.findOneAndDelete({
      $or: [{ id: id }, ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])]
    });
    if (deletedProduct) {
      console.log(`[Products] Successfully deleted product: "${deletedProduct.name}" (${id}) from MongoDB`);
      return res.json({ success: true, message: "Product deleted directly from MongoDB", id });
    }
    return res.status(404).json({ error: "Product not found in MongoDB database" });
  } catch (err) {
    console.error("[Products] MongoDB delete error:", err.message);
    res.status(500).json({ error: `Failed to delete product from MongoDB: ${err.message}` });
  }
});

// ==========================================
// PAYHERE SANDBOX PAYMENT GATEWAY ENDPOINTS
// ==========================================
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || "1238556";
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || 'NDE2OTc1MTU3NDE1MDk4MDc5MTM2MzU2MjkwMjM4ODY1NDg2MDU=';
const PAYHERE_CURRENCY = process.env.PAYHERE_CURRENCY || "LKR";

function generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret) {
  const amountFormatted = Number(amount).toFixed(2);
  const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
  const hashString = merchantId + orderId + amountFormatted + currency + hashedSecret;
  return crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();
}

// POST /api/payment/checkout-data (Generate PayHere Hash & Form Parameters)
app.post("/api/payment/checkout-data", async (req, res) => {
  try {
    const { amount, amountUSD = 0, items = [], customerDetails = {}, paymentMethod = "Online Card Payment (PayHere)", userEmail = "guest@gamershop.com", userName = "Valued Gamer" } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Valid payment amount is required." });
    }

    if (Number(amount) > 5000000) {
      return res.status(400).json({ error: "Card transaction limit is Rs. 5,000,000. Please contact our support team." });
    }

    const orderId = `#${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const formattedAmount = Number(amount).toFixed(2);
    const currency = PAYHERE_CURRENCY;
const hash = generatePayHereHash(PAYHERE_MERCHANT_ID, orderId, formattedAmount, currency, PAYHERE_MERCHANT_SECRET);

    const deliveryInfo = {
      fullName: customerDetails.fullName || userName,
      email: customerDetails.email || userEmail,
      primaryPhone: customerDetails.primaryPhone || customerDetails.phone || "0771234567",
      whatsappPhone: customerDetails.whatsappPhone || "",
      district: customerDetails.district || "Colombo",
      city: customerDetails.city || "Colombo",
      address: customerDetails.address || "466/1, Galle Road",
      country: customerDetails.country || "Sri Lanka"
    };

    // Save initial order status as PENDING_APPROVAL in MongoDB
    let createdOrderDoc = null;
    if (mongoose.connection.readyState === 1) {
      try {
        createdOrderDoc = await Order.create({
          orderId,
          userEmail: deliveryInfo.email,
          userName: deliveryInfo.fullName,
          items,
          amountLKR: Number(formattedAmount),
          amountUSD: Number(amountUSD),
          currency,
          paymentStatus: paymentMethod.includes("Cash") ? "PENDING_PAYMENT" : "PAID",
          adminApprovalStatus: "PENDING_APPROVAL",
          paymentMethod,
          payherePaymentId: `SANDBOX-${Date.now()}`,
          deliveryDetails: deliveryInfo
        });
      } catch (dbErr) {
        console.warn("[PayHere] Failed to save order in DB:", dbErr.message);
      }
    }

    const first_name = deliveryInfo.fullName.split(" ")[0] || "Gamer";
    const last_name = deliveryInfo.fullName.split(" ").slice(1).join(" ") || "Customer";

    const itemSummary = items.length > 0 
      ? items.map(i => `${i.name} (x${i.quantity})`).join(", ").substring(0, 100) 
      : "Gaming Hardware Order";

    res.json({
      success: true,
      sandboxUrl: "https://sandbox.payhere.lk/pay/checkout",
      merchantId: PAYHERE_MERCHANT_ID,
merchantSecret: PAYHERE_MERCHANT_SECRET,
      orderId,
      items: itemSummary,
      currency,
      amount: formattedAmount,
      hash,
      returnUrl: "http://localhost:5173/?payment=success&orderId=" + encodeURIComponent(orderId),
      cancelUrl: "http://localhost:5173/?payment=cancel",
      notifyUrl: "http://localhost:3000/api/payment/notify",
      customerDetails: {
        first_name,
        last_name,
        email: deliveryInfo.email,
        phone: deliveryInfo.primaryPhone,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        country: deliveryInfo.country
      }
    });
  } catch (err) {
    console.error("[PayHere Checkout Data] Error:", err.message);
    res.status(500).json({ error: "Failed to generate PayHere checkout parameters: " + err.message });
  }
});

// POST /api/payment/notify (PayHere IPN webhook callback)
app.post("/api/payment/notify", async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id
    } = req.body;

    console.log(`[PayHere IPN Received] Order: ${order_id}, Status Code: ${status_code}, Amount: ${payhere_amount}`);

    const hashedSecret = crypto.createHash("md5").update(PAYHERE_MERCHANT_SECRET).digest("hex").toUpperCase();
    const hashString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
    const expectedHash = crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();

    if (md5sig && expectedHash === md5sig.toUpperCase()) {
      if (mongoose.connection.readyState === 1) {
        const paymentStatus = String(status_code) === "2" ? "PAID" : "FAILED";
        await Order.findOneAndUpdate(
          { orderId: order_id },
          { paymentStatus, payherePaymentId: payment_id || "" }
        );
        console.log(`[PayHere IPN] Signature verified! Order ${order_id} updated payment status to ${paymentStatus}`);
      }
    } else {
      console.warn(`[PayHere IPN] Signature mismatch for order ${order_id}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("[PayHere IPN Error]:", err.message);
    res.sendStatus(500);
  }
});

// POST /api/payment/confirm-manual (Instant Sandbox confirmation for local testing)
app.post("/api/payment/confirm-manual", async (req, res) => {
  const { orderId, paymentStatus = "PAID" } = req.body;
  if (mongoose.connection.readyState === 1) {
    try {
      const order = await Order.findOneAndUpdate(
        { orderId },
        { paymentStatus, payherePaymentId: `SANDBOX-PAY-${Date.now()}` },
        { new: true }
      );
      return res.json({ success: true, message: `Order ${orderId} marked as ${paymentStatus}`, order });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json({ success: true, message: `Order ${orderId} confirmed` });
});

// GET /api/orders or /api/admin/orders (Fetch all orders for admin view)
app.get(["/api/orders", "/api/admin/orders"], async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json([]);
});

// GET /api/user/orders (Fetch orders placed by specific user email)
app.get("/api/user/orders", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email query param is required." });
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const userOrders = await Order.find({
        $or: [{ userEmail: email.trim() }, { "deliveryDetails.email": email.trim() }]
      }).sort({ createdAt: -1 });
      return res.json(userOrders);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json([]);
});

// PUT /api/admin/orders/:orderId/approval (Admin approves or updates order status)
app.put(["/api/admin/orders/:orderId/approval", "/api/admin/orders/approval", "/api/admin/orders/:orderId"], async (req, res) => {
  const orderId = req.params.orderId || req.body.orderId;
  const { adminApprovalStatus = "APPROVED", paymentStatus } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, error: "Missing order ID" });
  }

  // Ensure DB connection if needed
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (e) {
      console.warn("[Order Approval] DB connection check failed:", e.message);
    }
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const rawId = String(orderId).trim();
      const cleanId = rawId.replace(/^#/, "");
      const hashId = `#${cleanId}`;

      let updateFields = { adminApprovalStatus };
      if (paymentStatus) {
        updateFields.paymentStatus = paymentStatus;
      } else if (adminApprovalStatus === "REJECTED") {
        updateFields.paymentStatus = "CANCELLED";
      }

      const queryConditions = [
        { orderId: rawId },
        { orderId: cleanId },
        { orderId: hashId }
      ];
      if (mongoose.isValidObjectId(rawId)) {
        queryConditions.push({ _id: rawId });
      }

      const updatedOrder = await Order.findOneAndUpdate(
        { $or: queryConditions },
        { $set: updateFields },
        { new: true }
      );

      if (updatedOrder) {
        console.log(`[Admin Order Approval] Order ${updatedOrder.orderId} updated to ${adminApprovalStatus} (Payment: ${updatedOrder.paymentStatus})`);
        return res.json({
          success: true,
          message: `Order ${updatedOrder.orderId} admin approval status updated to ${adminApprovalStatus}!`,
          order: updatedOrder
        });
      }
    } catch (err) {
      console.error("[Admin Order Approval] DB update error:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.status(404).json({ success: false, error: "Order not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});