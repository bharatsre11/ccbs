const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  quantity: Number,

  customData: [
    {
      label: String,
      value: String
    }
  ],

  address: String,

  status: {
    type: String,
    default: "Pending"
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);