const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    products: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);