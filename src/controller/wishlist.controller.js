const Wishlist = require("../model/wishlist.model");
const mongoose = require("mongoose");

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const {
      menuItem,
      name,
      description,
      price,
      category,
      availability,
      image,
    } = req.body;

    if (!menuItem || !name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "menuItem, name, price and category are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(menuItem)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.userId,
        items: [],
      });
    }

    // Prevent duplicate wishlist items
    const existingItem = wishlist.items.find(
      (item) => item.menuItem.toString() === menuItem.toString()
    );

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: "Item already exists in wishlist",
      });
    }

    wishlist.items.push({
      menuItem,
      name,
      description: description || "",
      price,
      category,
      availability: availability ?? true,
      image: image || null,
    });

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Item added to wishlist successfully",
      data: wishlist.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const itemExists = wishlist.items.some(
      (item) => item.menuItem.toString() === itemId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.menuItem.toString() !== itemId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist successfully",
      data: wishlist.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.userId,
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is already empty",
        data: [],
      });
    }

    wishlist.items = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};