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
    public_id: { type: String, default:"avatarPicture" },
    url: { type: String,default:"https://www.gravatar.com/avatar/1234566?size=200&d=mm" },
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
});

module.exports = User = mongoose.model("user", userSchema);
