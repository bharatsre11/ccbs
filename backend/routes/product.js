const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ ADD PRODUCT
router.post("/", async (req, res) => {
  try {
    const { name, price, image, category } = req.body;

    if (!name || !price || !image || !category) {
      return res.status(400).json({ error: "All fields required" });
    }

    const product = new Product({ name, price, image, category });
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL PRODUCTS (with category)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name") // 🔥 IMPORTANT
      .lean();

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET SINGLE
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;