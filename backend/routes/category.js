const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// CREATE CATEGORY
router.post("/", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

module.exports = router;