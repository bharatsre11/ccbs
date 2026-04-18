const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,

  isCustomizable: {
    type: Boolean,
    default: false
  },

  customTextField: {
      type: String, 
      default: "Enter your custom text here" 
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);