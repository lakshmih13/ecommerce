const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { requireAuth, requireRole } = require("../middleware/auth");

// Anyone can browse the catalog
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Only logged-in admins can modify the catalog
router.post("/", requireAuth, requireRole("admin"), createProduct);
router.put("/:id", requireAuth, requireRole("admin"), updateProduct);
router.delete("/:id", requireAuth, requireRole("admin"), deleteProduct);

module.exports = router;
