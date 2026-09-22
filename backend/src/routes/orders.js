const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders } = require("../controllers/orderController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, requireRole("admin"), getAllOrders);

module.exports = router;
