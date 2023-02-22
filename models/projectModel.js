const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const projectSchema = mongoose.Schema({
  name: String,

  reference: String,

  description: String,

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = Project = mongoose.model("project", projectSchema);
