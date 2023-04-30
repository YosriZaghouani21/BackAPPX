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
/*   image: {
    public_id: { type: String, default:"avatarPicture" },
    url: { type: String,default:"https://www.gravatar.com/avatar/1234566?size=200&d=mm" },
  }, */
  image: {
    type:String,
    default:"http://localhost:9092/user/image/avatar/avatar.png"},
  Role: {
    type: String,
    default: "User",
  },
  Fonction: {
    type: String,
    default: "",
  },
  provider:{
    type:String,
    default:"BackAppX"
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
  lastLogin: {
    type: Date,
    default: null
  },

  startedAt: {
    type: Date,
    default: new Date(),
  },
  endedAt: {type: Date,
    default: new Date().setMonth( new Date().getMonth() + 12)
  },
  gitId:{
    type:String,
    default:null
  },
  githubUsername:{
    type:String,
    default:null
  },
  apiGen:{
    type:Number,
    enum:[0,1,2,3],
    default:0
  },
  subscription: {type: String, default: "Free",}
});

module.exports = User = mongoose.model("user", userSchema);
