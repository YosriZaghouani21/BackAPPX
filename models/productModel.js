const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const productSchema = mongoose.Schema({
  name: String,
  description:String,
  price:Number,
  quantity:Number,
  category:String,
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
