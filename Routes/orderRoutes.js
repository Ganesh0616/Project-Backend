const express = require("express");
const router = express.Router();
const { verifyJWT, adminOnly } = require("../Middleware/verifyJWT");
const {
  getOrders,
  deleteOrder,
  updateOrderStatus,
  placeOrder,
  getUserOrders,
} = require("../Controllers/orderController");

// User - Place order (COD only)
router.post("/placeOrder", verifyJWT, placeOrder);

// User - Get their own orders
router.get("/myOrders", verifyJWT, getUserOrders);

// Admin - Manage orders
router.get("/orders", verifyJWT, adminOnly, getOrders);
router.delete("/orders/:id", verifyJWT, adminOnly, deleteOrder);
router.put("/orders/:id", verifyJWT, adminOnly, updateOrderStatus);

module.exports = router;
