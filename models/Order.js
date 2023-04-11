const mongoose = require("mongoose");
const Product = require("./Product");

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  quantity: {
    type: Number,
    default: 1,
    required: true,
    min: 1,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
