const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const { ObjectId } = mongoose.Schema.Types;

const categorySchema = mongoose.Schema({
  name: String,
  description:String,
  reference: String,
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  project: {
    type: ObjectId,
    ref: "project",
  },
  Products: [
    {
      type: ObjectId,
      ref: "product",
    },
  ],

});

module.exports = Category = mongoose.model("category", categorySchema);