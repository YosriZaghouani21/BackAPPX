const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const reclamationSchema = mongoose.Schema({
  objet: String,
  contenu:String,
  reference: String,
  userId:String,
  stat:Number,

  createdAt: {
    type: Date,
    default: new Date(),
  },

});

module.exports = Reclamation = mongoose.model("reclamation", reclamationSchema);
