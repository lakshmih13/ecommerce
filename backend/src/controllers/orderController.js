const pool = require("../config/db");
const { emitProductEvent } = require("../socket");

// POST /api/orders  (any logged-in user)
// Expects { items: [{ id, name, price, quantity }, ...] }
async function createOrder(req, res) {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  try {
    const result = await pool.query(
      `INSERT INTO orders (user_id, items, total, status)
       VALUES ($1, $2, $3, 'placed')
       RETURNING *`,
      [req.user.id, JSON.stringify(items), total.toFixed(2)]
    );

    const order = result.rows[0];

    // Best-effort stock decrement per item; doesn't block the order on failure.
    for (const item of items) {
      await pool
        .query(
          "UPDATE products SET stock = GREATEST(stock - $1, 0) WHERE id = $2",
          [item.quantity, item.id]
        )
        .catch(() => {});
    }

    emitProductEvent("order:created", {
      id: order.id,
      customerName: req.user.name,
      total: order.total,
      itemCount: items.length,
      createdAt: order.created_at,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
}

// GET /api/orders  (admin only)
async function getAllOrders(req, res) {
  try {
    const result = await pool.query(
      `SELECT orders.*, users.name AS customer_name, users.email AS customer_email
       FROM orders
       JOIN users ON users.id = orders.user_id
       ORDER BY orders.created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

module.exports = { createOrder, getAllOrders };
