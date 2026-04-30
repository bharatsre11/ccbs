const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// ✅ ADD CATEGORY
router.post("/", async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ error: "Name & image required" });
    }

    const category = new Category({ name, image });
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;