const express = require("express");

const router = express.Router();

const authentication = require("../middleware/authentication.middleware");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controller/cart.controller");

// All cart routes require login
router.use(authentication);

router.get("/", getCart);

router.post("/", addToCart);

router.put("/:itemId", updateCartItem);

router.delete("/:itemId", removeFromCart);

router.delete("/", clearCart);

module.exports = router;