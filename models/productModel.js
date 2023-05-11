const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: {
    type: ObjectId,
    ref: "category",
  },
  project: {
    type: ObjectId,
    ref: "project",
  },
  reference: String,
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },

});

module.exports = Product = mongoose.model("product", productSchema);