const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const messageSchema = mongoose.Schema({
    senderId: String,
    reclamtionId: String,
    content: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },

});

module.exports = Message = mongoose.model("message", messageSchema);