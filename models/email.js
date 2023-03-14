const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const emailSchema = mongoose.Schema({
    from : {
        type: String,
        required: true
    },
    to : {
        type: String,
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
    }
    },
    {
        timestamps: true
    });

module.exports = Email = mongoose.model("email", emailSchema);