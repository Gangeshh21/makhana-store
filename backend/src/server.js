require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== ROUTES ====================

// Authentication
app.use("/api/auth", authRoutes);

// Cart
app.use("/api/cart", cartRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// ==================== HEALTH CHECK ====================

app.get("/", (req, res) => {
  res.json({
    message: "MakhanaMart API is running",
  });
});

// ==================== PRODUCTS ====================

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});