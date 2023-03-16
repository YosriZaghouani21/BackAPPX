const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const emailSchema = mongoose.Schema({
    sender : {
        type: String,
        required: true
    },
     recipient: {
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
    },
    },

    {
        timestamps: true
    });

module.exports = Email = mongoose.model("email", emailSchema);