const Menu = require("../model/menu.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");

const allowedCategories = [
  "Starter",
  "Main Course",
  "Dessert",
  "Beverage",
];

// Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Menu items fetched successfully",
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single menu item
const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item fetched successfully",
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create menu item
const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      availability,
    } = req.body;

    // Check required fields
    if (
      !name?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      price === undefined ||
      price === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category and price are required",
      });
    }

    // Validate category
    if (!allowedCategories.includes(category.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "Category must be Starter, Main Course, Dessert or Beverage",
      });
    }

    // Validate price
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    let imageData = {
      url: "",
      public_id: "",
    };

    // Upload image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "tastybites/menu-items",
        }
      );

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      // Remove temporary local image
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    const menuItem = await Menu.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: numericPrice,
      availability:
        availability === undefined
          ? true
          : availability === "true" || availability === true,
      image: imageData,
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    // Remove temporary file if something fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const {
      name,
      description,
      category,
      price,
      availability,
    } = req.body;

    // Update name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      menuItem.name = name.trim();
    }

    // Update description
    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty",
        });
      }

      menuItem.description = description.trim();
    }

    // Update category
    if (category !== undefined) {
      if (!allowedCategories.includes(category.trim())) {
        return res.status(400).json({
          success: false,
          message:
            "Category must be Starter, Main Course, Dessert or Beverage",
        });
      }

      menuItem.category = category.trim();
    }

    // Update price
    if (price !== undefined) {
      if (price === "") {
        return res.status(400).json({
          success: false,
          message: "Price cannot be empty",
        });
      }

      const numericPrice = Number(price);

      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number",
        });
      }

      menuItem.price = numericPrice;
    }

    // Update availability
    if (availability !== undefined) {
      menuItem.availability =
        availability === "true" || availability === true;
    }

    // If a new image is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "tastybites/menu-items",
        }
      );

      const oldPublicId = menuItem.image?.public_id;

      menuItem.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      // Remove temporary local image
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      // Delete old Cloudinary image
      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId);
      }
    }

    await menuItem.save();

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    // Remove temporary file if something fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Delete image from Cloudinary
    if (menuItem.image?.public_id) {
      await cloudinary.uploader.destroy(
        menuItem.image.public_id
      );
    }

    // Delete menu item from MongoDB
    await Menu.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};