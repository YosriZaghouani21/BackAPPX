const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number },
  image: { type: String},
  description: { type: String},
  reference: { type: String,},

});

module.exports = mongoose.model("Product", productSchema);
