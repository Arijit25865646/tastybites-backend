const express = require("express");

const {
  getUsers,
  deleteUser,
} = require("../controller/user.controller");

const authentication = require("../middleware/authentication.middleware");
const adminOnly = require("../middleware/admin.middleware");

const router = express.Router();

// Get all users - Admin only
router.get(
  "/",
  authentication,
  adminOnly,
  getUsers
);

// Delete user - Admin only
router.delete(
  "/:id",
  authentication,
  adminOnly,
  deleteUser
);

module.exports = router;