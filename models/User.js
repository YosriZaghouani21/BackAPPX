const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
mongoose.set("strictQuery", false);

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: Number,
  password: String,
  /*  image: {
    public_id: { type: String },
    url: { type: String },
  },*/
  createdAt: {
    type: Date,
    default: new Date(),
  },
  Role: {
    type: String,
    default: "User",
  },
  Fonction: {
    type: String,
    default: "",
  },
  /*  resetLink: {
    data: String,
    default: "",
  },*/
});

module.exports = User = mongoose.model("user", userSchema);
