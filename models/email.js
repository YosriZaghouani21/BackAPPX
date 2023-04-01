const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const emailSchema = mongoose.Schema({
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
     recipients: {
         type: [mongoose.Schema.Types.ObjectId],
         ref: "client",
         required: true
    },
    subject : {
        type: String,
        required: true
    },
    body : {
        type: String,
        required: true
    },
    scheduleTime : {
        type: Date,
        default: Date.now
    },
    },

    {
        timestamps: true
    });

module.exports = Email = mongoose.model("email", emailSchema);