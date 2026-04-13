const express = require("express");
const router  = express.Router();
const {
  createOrder, getMyOrders, getOrder,
  getAllOrders, updateOrderStatus, deleteOrder,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");

// Private (user)
router.post("/",     protect, createOrder);
router.get("/my",    protect, getMyOrders);
router.get("/:id",   protect, getOrder);

// Admin
router.get("/",                   protect, adminOnly, getAllOrders);
router.put("/:id/status",         protect, adminOnly, updateOrderStatus);
router.delete("/:id",             protect, adminOnly, deleteOrder);

module.exports = router;
