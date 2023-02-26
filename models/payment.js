const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
mongoose.set("strictQuery", false);

const paymentSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
    },

    subscriptionId: {
        type: String,
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    endDate: {
        type: Date,
    }
});

module.exports = Payment = mongoose.model("payment", paymentSchema);