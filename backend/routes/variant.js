const express = require("express");
const router = express.Router();
const Variant = require("../models/Variant");


// ✅ ADD VARIANT
router.post("/", async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;

    if (!productId || !name || !price || !image) {
      return res.status(400).json({ error: "All fields required" });
    }

    const variant = new Variant({ productId, name, price, image });
    await variant.save();

    res.json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET ALL VARIANTS (ADMIN USE)
router.get("/", async (req, res) => {
  try {
    const variants = await Variant.find().lean();
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET VARIANTS BY PRODUCT (FRONTEND USE)
router.get("/product/:productId", async (req, res) => {
  try {
    const variants = await Variant.find({
      productId: req.params.productId,
    }).lean();

    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE VARIANT
router.put("/:id", async (req, res) => {
  try {
    const updated = await Variant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE VARIANT
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Variant.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json({ message: "Variant deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;