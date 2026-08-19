const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// CREATE ORDER FROM CART
// =====================================================

router.post(
  "/",
  authenticateToken,
  async (req, res) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const cartResult =
        await client.query(
          `SELECT
            cart_items.product_id,
            cart_items.quantity,
            products.price,
            products.stock,
            products.name
           FROM cart_items
           JOIN products
           ON cart_items.product_id =
              products.id
           WHERE cart_items.user_id = $1`,
          [req.user.id]
        );

      if (
        cartResult.rows.length === 0
      ) {
        await client.query(
          "ROLLBACK"
        );

        return res.status(400).json({
          message:
            "Cart is empty",
        });
      }

      // Check stock
      for (
        const item of cartResult.rows
      ) {
        if (
          item.quantity >
          item.stock
        ) {
          await client.query(
            "ROLLBACK"
          );

          return res.status(400).json({
            message:
              `${item.name} has only ${item.stock} items in stock.`,
          });
        }
      }

      // Calculate total
      const total =
        cartResult.rows.reduce(
          (sum, item) =>
            sum +
            Number(item.price) *
              Number(item.quantity),
          0
        );

      // Create order
      const orderResult =
        await client.query(
          `INSERT INTO orders
           (user_id, total_amount, status)
           VALUES ($1, $2, 'pending')
           RETURNING *`,
          [
            req.user.id,
            total,
          ]
        );

      const order =
        orderResult.rows[0];

      // Create order items
      for (
        const item of cartResult.rows
      ) {
        await client.query(
          `INSERT INTO order_items
           (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [
            order.id,
            item.product_id,
            item.quantity,
            item.price,
          ]
        );

        // Reduce stock
        await client.query(
          `UPDATE products
           SET stock = stock - $1
           WHERE id = $2`,
          [
            item.quantity,
            item.product_id,
          ]
        );
      }

      // Clear cart
      await client.query(
        `DELETE FROM cart_items
         WHERE user_id = $1`,
        [req.user.id]
      );

      await client.query(
        "COMMIT"
      );

      res.status(201).json({
        message:
          "Order created successfully",
        order,
      });

    } catch (error) {
      await client.query(
        "ROLLBACK"
      );

      console.error(
        "Create order error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create order",
      });

    } finally {
      client.release();
    }
  }
);

// =====================================================
// GET MY ORDERS
// =====================================================

router.get(
  "/my-orders",
  authenticateToken,
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `SELECT
            id,
            total_amount,
            status,
            created_at
           FROM orders
           WHERE user_id = $1
           ORDER BY created_at DESC`,
          [req.user.id]
        );

      res.json(result.rows);

    } catch (error) {
      console.error(
        "My orders error:",
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
// GET ORDER DETAILS
// =====================================================

router.get(
  "/my-orders/:id",
  authenticateToken,
  async (req, res) => {
    try {

      // Get order
      const orderResult =
        await pool.query(
          `SELECT
            id,
            total_amount,
            status,
            created_at
           FROM orders
           WHERE id = $1
           AND user_id = $2`,
          [
            req.params.id,
            req.user.id,
          ]
        );

      if (
        orderResult.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      // Get items
      const itemsResult =
        await pool.query(
          `SELECT
            order_items.id,
            order_items.product_id,
            products.name,
            products.weight,
            order_items.quantity,
            order_items.price
           FROM order_items
           JOIN products
           ON order_items.product_id =
              products.id
           WHERE order_items.order_id =
                 $1
           ORDER BY order_items.id`,
          [req.params.id]
        );

      res.json({
        order:
          orderResult.rows[0],
        items:
          itemsResult.rows,
      });

    } catch (error) {
      console.error(
        "Order details error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch order details",
      });
    }
  }
);

module.exports = router;