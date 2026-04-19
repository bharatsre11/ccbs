const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  // 🔥 ADD THIS
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant"
  },

  quantity: Number,
  price: Number,

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
  }
});