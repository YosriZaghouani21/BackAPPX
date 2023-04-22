const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const clientSchema = mongoose.Schema({
  name: String,
  familyName:String,
  fullName:String,
  email:String,
  phoneNumber:Number,
  password:String,
  image:{
    type:String,
    default:"https://www.gravatar.com/avatar/1234566?size=200&d=mm"
  },
  reference: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  resetLink: {
    data: String,
    default: "",
  },
});

module.exports = Client = mongoose.model("client", clientSchema);
