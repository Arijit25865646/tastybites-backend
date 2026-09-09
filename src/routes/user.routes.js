const express = require("express");

const { registerUser, loginUser } = require("../controller/user.controller");

const authentication = require("../middleware/authentication.middleware");
const adminOnly = require("../middleware/admin.middleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

module.exports = router;
