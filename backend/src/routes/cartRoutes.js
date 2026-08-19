const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// GET USER CART
// =========================

router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        cart_items.id,
        cart_items.quantity,
        products.id AS product_id,
        products.name,
        products.description,
        products.price,
        products.weight
       FROM cart_items
       JOIN products
       ON cart_items.product_id = products.id
       WHERE cart_items.user_id = $1
       ORDER BY cart_items.id`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Cart fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
});

// =========================
// ADD TO CART
// =========================

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      product_id,
      quantity = 1,
    } = req.body;

    if (!product_id) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO cart_items
       (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET
       quantity =
       cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [
        req.user.id,
        product_id,
        quantity,
      ]
    );

    res.status(201).json({
      message: "Product added to cart",
      item: result.rows[0],
    });

  } catch (error) {
    console.error("Add cart error:", error);

    res.status(500).json({
      message: "Failed to add item",
    });
  }
});
// =========================
// UPDATE CART QUANTITY
// =========================

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE id = $2
       AND user_id = $3
       RETURNING *`,
      [
        quantity,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    res.json({
      message: "Cart updated successfully",
      item: result.rows[0],
    });

  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      message: "Failed to update cart",
    });
  }
});

// =========================
// REMOVE FROM CART
// =========================

router.delete(
  "/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        `DELETE FROM cart_items
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [
          req.params.id,
          req.user.id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Cart item not found",
        });
      }

      res.json({
        message: "Item removed from cart",
      });

    } catch (error) {
      console.error("Remove cart error:", error);

      res.status(500).json({
        message: "Failed to remove item",
      });
    }
  }
);

module.exports = router;