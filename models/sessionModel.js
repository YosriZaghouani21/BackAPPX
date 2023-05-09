const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const sessionSchema = mongoose.Schema({

    reference: String,
    userId: String



});

module.exports = Session = mongoose.model("session", sessionSchema);