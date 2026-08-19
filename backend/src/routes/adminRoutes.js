const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
  "/dashboard",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const products = await pool.query(
        "SELECT COUNT(*) FROM products"
      );

      const users = await pool.query(
        "SELECT COUNT(*) FROM users"
      );

      const orders = await pool.query(
        "SELECT COUNT(*) FROM orders"
      );

      const revenue = await pool.query(
        `SELECT COALESCE(SUM(total_amount), 0) AS revenue
         FROM orders
         WHERE status != 'cancelled'`
      );

      res.json({
        message: "Welcome to Admin Dashboard",

        statistics: {
          products: Number(
            products.rows[0].count
          ),

          users: Number(
            users.rows[0].count
          ),

          orders: Number(
            orders.rows[0].count
          ),

          revenue: Number(
            revenue.rows[0].revenue
          ),
        },
      });

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to load dashboard",
      });
    }
  }
);

// =====================================================
// PRODUCTS
// =====================================================

// GET PRODUCTS

router.get(
  "/products",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM products ORDER BY id"
      );

      res.json(result.rows);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch products",
      });
    }
  }
);

// ADD PRODUCT

router.post(
  "/products",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        weight,
        stock,
      } = req.body;

      const result = await pool.query(
        `INSERT INTO products
        (name, description, price, weight, stock)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          name,
          description,
          price,
          weight,
          stock,
        ]
      );

      res.status(201).json({
        message:
          "Product created successfully",

        product:
          result.rows[0],
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to create product",
      });
    }
  }
);

// UPDATE PRODUCT

router.put(
  "/products/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        weight,
        stock,
      } = req.body;

      const result = await pool.query(
        `UPDATE products
         SET name = $1,
             description = $2,
             price = $3,
             weight = $4,
             stock = $5
         WHERE id = $6
         RETURNING *`,
        [
          name,
          description,
          price,
          weight,
          stock,
          req.params.id,
        ]
      );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      res.json({
        message:
          "Product updated successfully",

        product:
          result.rows[0],
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update product",
      });
    }
  }
);

// DELETE PRODUCT

router.delete(
  "/products/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `DELETE FROM products
           WHERE id = $1
           RETURNING *`,
          [req.params.id]
        );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      res.json({
        message:
          "Product deleted successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete product",
      });
    }
  }
);

// =====================================================
// USERS
// =====================================================

router.get(
  "/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          name,
          email,
          role,
          created_at
         FROM users
         ORDER BY id`
      );

      res.json(result.rows);

    } catch (error) {
      console.error(
        "Users error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch users",
      });
    }
  }
);

// =====================================================
// ORDERS
// =====================================================

router.get(
  "/orders",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          orders.id,
          orders.user_id,
          users.name AS user_name,
          users.email AS user_email,
          orders.total_amount,
          orders.status,
          orders.created_at
         FROM orders
         JOIN users
         ON orders.user_id = users.id
         ORDER BY orders.id DESC`
      );

      res.json(result.rows);

    } catch (error) {
      console.error(
        "Orders error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch orders",
      });
    }
  }
);

// =====================================================
// ORDER ITEMS
// =====================================================

router.get(
  "/orders/:id/items",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          order_items.id,
          order_items.product_id,
          products.name,
          order_items.quantity,
          order_items.price
         FROM order_items
         JOIN products
         ON order_items.product_id =
            products.id
         WHERE order_items.order_id = $1
         ORDER BY order_items.id`,
        [req.params.id]
      );

      res.json(result.rows);

    } catch (error) {
      console.error(
        "Order items error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch order items",
      });
    }
  }
);

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

router.put(
  "/orders/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order status",
        });
      }

      const result = await pool.query(
        `UPDATE orders
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [
          status,
          req.params.id,
        ]
      );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      res.json({
        message:
          "Order status updated",

        order:
          result.rows[0],
      });

    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update order",
      });
    }
  }
);

module.exports = router;