const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
mongoose.set("strictQuery", false);

const paymentSchema = mongoose.Schema({
    user: {
        type: ObjectId,
    },
    amount: {
        type: Number,
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