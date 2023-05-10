const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: Number,
  password: String,
  image: String,
  reference: String,
});

module.exports = mongoose.model("Client", clientSchema);
