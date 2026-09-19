const pool = require("../config/db");

// GET /api/products
async function getAllProducts(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

// POST /api/products
async function createProduct(req, res) {
  const { name, description, price, category, stock, image_url } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "name and price are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description || null, price, category || null, stock || 0, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
}

// PUT /api/products/:id
async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, category, stock, image_url } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const current = existing.rows[0];
    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, category = $4,
           stock = $5, image_url = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        name ?? current.name,
        description ?? current.description,
        price ?? current.price,
        category ?? current.category,
        stock ?? current.stock,
        image_url ?? current.image_url,
        id,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
}

// DELETE /api/products/:id
async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted", product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
