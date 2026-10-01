const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    image: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model(
  "Wishlist",
  wishlistSchema
);

module.exports = Wishlist;