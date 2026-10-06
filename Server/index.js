import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import crypto from "crypto";
import { connectDB } from "./db.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { ImageModel } from "./models/Image.js";
import { Order } from "./models/Order.js";
import { seedDatabase } from "./seed.js";
import { products as initialProducts, categories } from "./data/products.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// In-memory fallback product store if MongoDB is offline
let inMemoryProductList = [...initialProducts];

// Connect MongoDB & seed data & store images
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

// MONGODB IMAGE SERVER ENDPOINT: GET /api/images/:id
app.get("/api/images/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState === 1) {
      const imgDoc = await ImageModel.findOne({ imageId: id });
      if (imgDoc && imgDoc.data) {
        res.setHeader("Content-Type", imgDoc.contentType || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(imgDoc.data);
      }
    }
  } catch (err) {
    console.error("[Image Server] Error retrieving image from MongoDB:", err.message);
  }

  // Fallback if image not yet in MongoDB
  const product = inMemoryProductList.find(p => p.id === id);
  if (product && product.image && product.image.startsWith("http") && !product.image.includes("/api/images/")) {
    return res.redirect(product.image);
  }

  return res.redirect("https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80");
});

// MONGODB IMAGE UPLOAD ENDPOINT: POST /api/images/upload
app.post("/api/images/upload", async (req, res) => {
  const { imageId, base64Data, contentType = "image/jpeg", originalUrl } = req.body;
  
  if (!base64Data) {
    return res.status(400).json({ error: "Base64 image data is required." });
  }

  const id = imageId || `img-${Date.now()}`;
  try {
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    if (mongoose.connection.readyState === 1) {
      const savedImg = await ImageModel.findOneAndUpdate(
        { imageId: id },
        { imageId: id, contentType, data: buffer, originalUrl: originalUrl || "" },
        { upsert: true, new: true }
      );
      return res.status(201).json({
        success: true,
        message: "Image stored successfully in MongoDB database",
        imageUrl: `http://localhost:3000/api/images/${savedImg.imageId}`,
        imageId: savedImg.imageId
      });
    }
    res.status(503).json({ error: "MongoDB is not connected." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

// POST /api/products/:id/reviews (Submit Customer Review to MongoDB)
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

  if (mongoose.connection.readyState === 1) {
    try {
      const dbProduct = await Product.findOne({
        $or: [{ id: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
      });

      if (dbProduct) {
        if (!dbProduct.reviews) dbProduct.reviews = [];
        dbProduct.reviews.unshift(reviewItem);
        const totalRating = dbProduct.reviews.reduce((sum, r) => sum + r.rating, 0);
        dbProduct.reviewsCount = dbProduct.reviews.length;
        dbProduct.rating = Number((totalRating / dbProduct.reviews.length).toFixed(1));

        await dbProduct.save();
        return res.json({
          success: true,
          message: "Review stored successfully in MongoDB!",
          product: dbProduct
        });
      }
    } catch (err) {
      console.error("[Reviews] MongoDB review submit error:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // Fallback in-memory review addition
  const prodIndex = inMemoryProductList.findIndex(p => p.id === id);
  if (prodIndex !== -1) {
    if (!inMemoryProductList[prodIndex].reviews) {
      inMemoryProductList[prodIndex].reviews = [];
    }
    inMemoryProductList[prodIndex].reviews.unshift(reviewItem);
    inMemoryProductList[prodIndex].reviewsCount = inMemoryProductList[prodIndex].reviews.length;
    res.json({
      success: true,
      message: "Review submitted (in-memory)",
      product: inMemoryProductList[prodIndex]
    });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// ADMIN ONLY: POST /api/products (Create Product in MongoDB and store image in MongoDB)
app.post("/api/products", async (req, res) => {
  const { name, category, brand, price, originalPrice, stock, image, description, specs, isFeatured, isFlashSale, tag, wattage } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ error: "Product name, price, and category are required." });
  }

  const productId = `custom-${Date.now()}`;
  let storedImageUrl = `http://localhost:3000/api/images/${productId}`;

  // Process & store image binary in MongoDB
  if (image && mongoose.connection.readyState === 1) {
    try {
      let buffer;
      let contentType = "image/jpeg";

      if (image.startsWith("data:image/")) {
        const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          contentType = matches[1];
          buffer = Buffer.from(matches[2], "base64");
        }
      } else if (image.startsWith("http") && !image.includes("/api/images/")) {
        const imgRes = await fetch(image, { signal: AbortSignal.timeout(6000) });
        if (imgRes.ok) {
          const arr = await imgRes.arrayBuffer();
          contentType = imgRes.headers.get("content-type") || "image/jpeg";
          buffer = Buffer.from(arr);
        }
      }

      if (buffer) {
        await ImageModel.create({
          imageId: productId,
          filename: `${productId}.jpg`,
          contentType,
          data: buffer,
          originalUrl: image
        });
      } else {
        storedImageUrl = image;
      }
    } catch (err) {
      console.warn("[Products] Image storage in MongoDB skipped:", err.message);
      storedImageUrl = image;
    }
  }

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
    image: storedImageUrl,
    description: description || 'High-performance PC gaming part.',
    specs: specs || { memory: 'Standard', interface: 'PCIe 4.0' }
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const createdProduct = await Product.create(newProductData);
      return res.status(201).json({ success: true, message: "Product and image stored successfully in MongoDB", product: createdProduct });
    } catch (err) {
      console.error("[Products] MongoDB create error:", err.message);
    }
  }

  inMemoryProductList.unshift(newProductData);
  res.status(201).json({ success: true, message: "Product created successfully (in-memory)", product: newProductData });
});

// ADMIN ONLY: PUT /api/products/:id (Update Product & Image in MongoDB)
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  let updatePayload = { ...req.body };

  if (req.body.image && mongoose.connection.readyState === 1) {
    try {
      let buffer;
      let contentType = "image/jpeg";
      const imageStr = req.body.image;

      if (imageStr.startsWith("data:image/")) {
        const matches = imageStr.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          contentType = matches[1];
          buffer = Buffer.from(matches[2], "base64");
        }
      } else if (imageStr.startsWith("http") && !imageStr.includes("/api/images/")) {
        const imgRes = await fetch(imageStr, { signal: AbortSignal.timeout(6000) });
        if (imgRes.ok) {
          const arr = await imgRes.arrayBuffer();
          contentType = imgRes.headers.get("content-type") || "image/jpeg";
          buffer = Buffer.from(arr);
        }
      }

      if (buffer) {
        await ImageModel.findOneAndUpdate(
          { imageId: id },
          { imageId: id, contentType, data: buffer, originalUrl: imageStr },
          { upsert: true }
        );
        updatePayload.image = `http://localhost:3000/api/images/${id}`;
      }
    } catch (err) {
      console.warn("[Products] Image update error:", err.message);
    }
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const updatedDbProduct = await Product.findOneAndUpdate(
        { $or: [{ id: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: updatePayload },
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
    ...updatePayload,
    price: updatePayload.price ? parseFloat(updatePayload.price) : inMemoryProductList[index].price,
    stock: updatePayload.stock !== undefined ? parseInt(updatePayload.stock, 10) : inMemoryProductList[index].stock
  };

  inMemoryProductList[index] = updatedProduct;
  res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
});

// ADMIN ONLY: DELETE /api/products/:id (Delete Product & Image from MongoDB)
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      await ImageModel.findOneAndDelete({ imageId: id });
      const deletedProduct = await Product.findOneAndDelete({
        $or: [{ id: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
      });
      if (deletedProduct) {
        return res.json({ success: true, message: "Product and image deleted successfully from MongoDB", id });
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
      returnUrl: "http://localhost:5173/?payment=success&orderId=" + orderId,
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

const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || 'NDE2OTc1MTU3NDE1MDk4MDc5MTM2MzU2MjkwMjM4ODY1NDg2MDU=';
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
app.put("/api/admin/orders/:orderId/approval", async (req, res) => {
  const { orderId } = req.params;
  const { adminApprovalStatus = "APPROVED", paymentStatus } = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      let updateFields = { adminApprovalStatus };
      if (paymentStatus) updateFields.paymentStatus = paymentStatus;

      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        { $set: updateFields },
        { new: true }
      );
      if (updatedOrder) {
        return res.json({
          success: true,
          message: `Order ${orderId} admin approval status updated to ${adminApprovalStatus}!`,
          order: updatedOrder
        });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.status(404).json({ error: "Order not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});