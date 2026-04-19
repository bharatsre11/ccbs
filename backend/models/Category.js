const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  name: String,
  image: String,
  price: Number
});

module.exports = mongoose.model("Variant", variantSchema);