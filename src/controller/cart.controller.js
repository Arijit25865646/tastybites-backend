const Cart = require("../model/cart.model");
const mongoose = require("mongoose");

// Get user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    // Create empty cart if user doesn't have one
    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const {
      menuItem,
      name,
      price,
      category,
      image,
      quantity = 1,
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

    const itemQuantity = Number(quantity);

    if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [],
      });
    }

    // Check whether item already exists
    const existingItem = cart.items.find(
      (item) => item.menuItem.toString() === menuItem.toString()
    );

    if (existingItem) {
      existingItem.quantity += itemQuantity;
    } else {
      cart.items.push({
        menuItem,
        name,
        price,
        category,
        image: image || null,
        quantity: itemQuantity,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const itemQuantity = Number(quantity);

    if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.menuItem.toString() === itemId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = itemQuantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.menuItem.toString() === itemId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== itemId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: cart.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        data: [],
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
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
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};