const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/order.controller");

const authentication = require("../middleware/authentication.middleware");
const adminOnly = require("../middleware/admin.middleware");

const router = express.Router();

// =====================================================
// CUSTOMER ROUTES
// =====================================================

// Create an order
router.post(
  "/",
  authentication,
  createOrder
);

// Get logged-in user's orders
router.get(
  "/my-orders",
  authentication,
  getMyOrders
);

// Get a single order
router.get(
  "/:id",
  authentication,
  getOrderById
);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Get all orders
router.get(
  "/",
  authentication,
  adminOnly,
  getAllOrders
);

// Update order status
router.put(
  "/:id/status",
  authentication,
  adminOnly,
  updateOrderStatus
);

// Delete order permanently
router.delete(
  "/:id",
  authentication,
  adminOnly,
  deleteOrder
);

module.exports = router;