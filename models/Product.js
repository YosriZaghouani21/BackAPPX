const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    default: 1,
    required: true,
    min: 1, // Ensures that quantity is at least 1
  },

  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    default: null,
  },
});

module.exports = mongoose.model("Product", productSchema);
