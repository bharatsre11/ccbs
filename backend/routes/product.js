const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 🔥 ADD PRODUCT (Admin)
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    //const products = await Product.find().populate("category");
    const products = await Product.find().lean(); // ✅ USE .lean() FOR FASTER QUERIES;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;