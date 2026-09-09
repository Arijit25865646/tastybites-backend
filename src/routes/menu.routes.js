const express = require("express");

const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controller/menu.controller");

const authentication = require("../middleware/authentication.middleware");
const adminOnly = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

// Public routes
router.get("/", getMenuItems);
router.get("/:id", getMenuItem);

// Admin routes
router.post(
  "/",
  authentication,
  adminOnly,
  upload.single("image"),
  createMenuItem
);

// Update menu item
router.put(
  "/:id",
  authentication,
  adminOnly,
  upload.single("image"),
  updateMenuItem
);

// Delete menu item
router.delete(
  "/:id",
  authentication,
  adminOnly,
  deleteMenuItem
);

module.exports = router;