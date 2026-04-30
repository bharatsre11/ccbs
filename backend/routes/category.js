const express = require("express");
const router = express.Router();
const Category = require("../models/Category"); // ✅ CORRECT

// ADD CATEGORY
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
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

module.exports = router;