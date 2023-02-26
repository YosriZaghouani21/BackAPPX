const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const clientSchema = mongoose.Schema({
  name: String,
  familyName:String,
  fullName:String,
  email:String,
  phoneNumber:Number,
  password:String,
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  reference: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },

});

module.exports = Client = mongoose.model("client", clientSchema);
