const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project',
    }
    ,
    client: {
        type: Schema.Types.ObjectId,
        ref: 'client',
    }
    ,
    order: {
        type: Schema.Types.ObjectId,
        ref: 'order',
    }
    ,
    stripePaymentIntentId: {
        type: String,
    },
    reference: {
        type: String,
    },
},
{
    timestamps: true
}
);

module.exports = Payment = mongoose.model('payment', paymentSchema);