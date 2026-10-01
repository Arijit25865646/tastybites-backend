const express = require("express");

const router = express.Router();

const authentication = require("../middleware/authentication.middleware");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controller/wishlist.controller");

// All wishlist routes require login
router.use(authentication);

router.get("/", getWishlist);

router.post("/", addToWishlist);

router.delete("/:itemId", removeFromWishlist);

router.delete("/", clearWishlist);

module.exports = router;