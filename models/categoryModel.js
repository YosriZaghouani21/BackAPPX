const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const { ObjectId } = mongoose.Schema.Types;

const categorySchema = mongoose.Schema({
  name: String,
  description: String,
  reference: String,
  project: {
    type: ObjectId,
    ref: "project",
  },
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  Products: [
    {
      type: ObjectId,
      ref: "product",
    },
  ],

});

module.exports = Category = mongoose.model("category", categorySchema);
