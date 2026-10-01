const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const userRoutes = require("./src/routes/user.routes");
const adminRoutes = require("./src/routes/admin.routes");
const menuRoutes = require("./src/routes/menu.routes");
const orderRoutes = require("./src/routes/order.routes");
const cartRoutes = require("./src/routes/cart.routes");
const wishlistRoutes = require("./src/routes/wishlist.routes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/users", adminRoutes);
app.use("/api/menu-items", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("TastyBites Backend is running");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});