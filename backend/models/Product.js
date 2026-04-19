const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,

  // 🔥 ADD THIS (CRITICAL)
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  description: String,

  isCustomizable: Boolean,

  customFields: [
    {
      label: String
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);