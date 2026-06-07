const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// ✅ ADD CATEGORY
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Category name required"
      });
    }

    const category = new Category({
      name: name.trim()
    });

    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ✅ GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ✅ UPDATE CATEGORY
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        error: "Category not found"
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ✅ DELETE CATEGORY
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Category not found"
      });
    }

    res.json({
      message: "Category deleted ✅"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;