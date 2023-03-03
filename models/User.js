const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
mongoose.set("strictQuery", false);

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: Number,
  password: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  Role: {
    type: String,
    default: "User",
  },
  Fonction: {
    type: String,
    default: "",
  },
  myProject: [
    {
      type: ObjectId,
      ref: "project",
    },
  ],
  resetLink: {
    data: String,
    default: "",
  },
  startedAt: {
    type: Date,
    default: new Date(),
  },
  endedAt: {type: Date,
    default: new Date().setMonth( new Date().getMonth() + 12)
  },
  subscription: {type: String, default: "Free",}
});

module.exports = User = mongoose.model("user", userSchema);
