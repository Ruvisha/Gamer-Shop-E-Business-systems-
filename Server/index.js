import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { seedDatabase } from "./seed.js";
import { products as initialProducts, categories } from "./data/products.js";

dotenv.config();

const app = express();
app.use(express.json());

// In-memory fallback product store if MongoDB is offline
let inMemoryProductList = [...initialProducts];

// Connect MongoDB & seed data
connectDB().then(() => {
  if (mongoose.connection.readyState === 1) {
    seedDatabase();
  }
});

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
    dbStatus: mongoose.connection.readyState === 1 ? "Connected to MongoDB" : "In-Memory Fallback Mode",
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

// Authentication Endpoint (Persists users & logs login details in MongoDB)
app.post("/api/auth/login", async (req, res) => {
  const { email, password, role = "user" } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required for login safety."
    });
  }

  const userRole = role === "admin" || email.toLowerCase().includes("admin") ? "admin" : "user";
  const userEmail = email.trim();
  const userName = userRole === "admin" ? "Admin Manager" : userEmail.split("@")[0];

  const loginLog = {
    loginTime: new Date(),
    ip: req.ip || req.headers['x-forwarded-for'] || "127.0.0.1",
    userAgent: req.headers['user-agent'] || "Browser Client",
    success: true
  };

  let userProfile;

  if (mongoose.connection.readyState === 1) {
    try {
      let dbUser = await User.findOne({ email: userEmail });
      if (!dbUser) {
        dbUser = await User.create({
          name: userName,
          email: userEmail,
          password: password || "password123",
          role: userRole,
          avatar: userRole === "admin"
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          loginLogs: [loginLog]
        });
      } else {
        dbUser.loginLogs.push(loginLog);
        await dbUser.save();
      }

      userProfile = {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        avatar: dbUser.avatar,
        loginLogsCount: dbUser.loginLogs.length,
        lastLogin: loginLog.loginTime
      };
    } catch (err) {
      console.error("[Auth] MongoDB user logging error:", err.message);
    }
  }

  if (!userProfile) {
    userProfile = {
      id: `user-${Date.now()}`,
      name: userName,
      email: userEmail,
      role: userRole,
      avatar: userRole === "admin" 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };
  }

  res.json({
    success: true,
    message: `Logged in successfully as ${userRole.toUpperCase()}`,
    user: userProfile
  });
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

// GET all products or search/filter (MongoDB supported)
app.get("/api/products", async (req, res) => {
  const { category, search } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      let filter = {};
      if (category && category !== 'all') {
        filter.category = category;
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
      return res.json(productsFromDb);
    } catch (err) {
      console.error("[Products] MongoDB fetch error, falling back:", err.message);
    }
  }

  // Fallback if MongoDB is offline
  let result = inMemoryProductList;
  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }
  if (search) {
    const query = search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description?.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query)
    );
  }
  res.json(result);
});

// GET product by ID
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const dbProduct = await Product.findOne({
        $or: [{ id: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
      });
      if (dbProduct) return res.json(dbProduct);
    } catch (err) {
      console.error("[Products] MongoDB findById error:", err.message);
    }
  }

  const product = inMemoryProductList.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// GET categories
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

// ADMIN ONLY: POST /api/products (Create Product in MongoDB)
app.post("/api/products", async (req, res) => {
  const { name, category, brand, price, originalPrice, stock, image, description, specs, isFeatured, isFlashSale, tag, wattage } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ error: "Product name, price, and category are required." });
  }

  const productId = `custom-${Date.now()}`;
  const newProductData = {
    id: productId,
    name,
    category: category || 'gpu',
    brand: brand || 'Generic',
    price: parseFloat(price),
    originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
    rating: 5.0,
    reviewsCount: 1,
    stock: stock ? parseInt(stock, 10) : 10,
    wattage: wattage ? parseInt(wattage, 10) : 0,
    isFlashSale: Boolean(isFlashSale),
    isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
    tag: tag || '',
    image: image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    description: description || 'High-performance PC gaming part.',
    specs: specs || { memory: 'Standard', interface: 'PCIe 4.0' }
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const createdProduct = await Product.create(newProductData);
      return res.status(201).json({ success: true, message: "Product created successfully in MongoDB", product: createdProduct });
    } catch (err) {
      console.error("[Products] MongoDB create error:", err.message);
    }
  }

  inMemoryProductList.unshift(newProductData);
  res.status(201).json({ success: true, message: "Product created successfully (in-memory)", product: newProductData });
});

// ADMIN ONLY: PUT /api/products/:id (Update Product in MongoDB)
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const updatedDbProduct = await Product.findOneAndUpdate(
        { $or: [{ id: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: req.body },
        { new: true }
      );
      if (updatedDbProduct) {
        return res.json({ success: true, message: "Product updated successfully in MongoDB", product: updatedDbProduct });
      }
    } catch (err) {
      console.error("[Products] MongoDB update error:", err.message);
    }
  }

  const index = inMemoryProductList.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updatedProduct = {
    ...inMemoryProductList[index],
    ...req.body,
    price: req.body.price ? parseFloat(req.body.price) : inMemoryProductList[index].price,
    stock: req.body.stock !== undefined ? parseInt(req.body.stock, 10) : inMemoryProductList[index].stock
  };

  inMemoryProductList[index] = updatedProduct;
  res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
});

// ADMIN ONLY: DELETE /api/products/:id (Delete Product from MongoDB)
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const deletedProduct = await Product.findOneAndDelete({
        $or: [{ id: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
      });
      if (deletedProduct) {
        return res.json({ success: true, message: "Product deleted successfully from MongoDB", id });
      }
    } catch (err) {
      console.error("[Products] MongoDB delete error:", err.message);
    }
  }

  const initialLength = inMemoryProductList.length;
  inMemoryProductList = inMemoryProductList.filter(p => p.id !== id);

  if (inMemoryProductList.length === initialLength) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({ success: true, message: "Product deleted successfully", id });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});