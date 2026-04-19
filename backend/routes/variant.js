const express = require("express");
const router = express.Router();
const Variant = require("../models/Variant");

// ADD VARIANT
router.post("/", async (req, res) => {
  try {
    const variant = new Variant(req.body);
    await variant.save();
    res.json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET VARIANTS BY PRODUCT
router.get("/:productId", async (req, res) => {
  try {
    const variants = await Variant.find({
      productId: req.params.productId
    });
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;