import express from "express";
import { products as initialProducts, categories } from "./data/products.js";

const app = express();
app.use(express.json());

// In-memory mutable products store
let productList = [...initialProducts];

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
    res.json({ message: "Gamer Shop E-Business Server API", status: "Active" });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Authentication Endpoint (Supports Admin & User roles)
app.post("/api/auth/login", (req, res) => {
    const { email, password, role = "user" } = req.body;
    
    // Demo authentication check
    const userRole = role === "admin" || email?.includes("admin") ? "admin" : "user";
    const userProfile = {
        id: `user-${Date.now()}`,
        name: userRole === "admin" ? "Admin Overlord" : (email ? email.split("@")[0] : "CyberGamer_99"),
        email: email || (userRole === "admin" ? "admin@gamershop.com" : "gamer@gamershop.com"),
        role: userRole,
        avatar: userRole === "admin" 
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };

    res.json({
        success: true,
        message: `Logged in successfully as ${userRole.toUpperCase()}`,
        user: userProfile
    });
});

// GET all products or search/filter
app.get("/api/products", (req, res) => {
    const { category, search } = req.query;
    let result = productList;

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
app.get("/api/products/:id", (req, res) => {
    const product = productList.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
});

// GET categories
app.get("/api/categories", (req, res) => {
    res.json(categories);
});

// ADMIN ONLY: POST /api/products (Create Product)
app.post("/api/products", (req, res) => {
    const { name, category, brand, price, originalPrice, stock, image, description, specs } = req.body;
    
    if (!name || !price || !category) {
        return res.status(400).json({ error: "Product name, price, and category are required." });
    }

    const newProduct = {
        id: `custom-${Date.now()}`,
        name,
        category: category || 'gpu',
        brand: brand || 'Generic',
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
        rating: 5.0,
        reviewsCount: 1,
        stock: stock ? parseInt(stock, 10) : 10,
        isFeatured: true,
        image: image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
        description: description || 'High-performance gaming product.',
        specs: specs || { memory: 'Standard', interface: 'PCIe 4.0' }
    };

    productList.unshift(newProduct);
    res.status(201).json({ success: true, message: "Product created successfully", product: newProduct });
});

// ADMIN ONLY: PUT /api/products/:id (Update Product)
app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = productList.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = {
        ...productList[index],
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : productList[index].price,
        stock: req.body.stock !== undefined ? parseInt(req.body.stock, 10) : productList[index].stock
    };

    productList[index] = updatedProduct;
    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
});

// ADMIN ONLY: DELETE /api/products/:id (Delete Product)
app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = productList.length;
    productList = productList.filter(p => p.id !== id);

    if (productList.length === initialLength) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully", id });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});