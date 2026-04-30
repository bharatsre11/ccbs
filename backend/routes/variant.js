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
router.put("/:id", async (req, res) => {
  const updated = await Variant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Variant.findByIdAndDelete(req.params.id);
  res.json({ message: "Variant deleted" });
});

module.exports = router;