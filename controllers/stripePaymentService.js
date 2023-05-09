const express = require("express");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Payment = require("../models/payment");



exports.createPaymentIntent = async (req, res) => {
    const stripe = require('stripe')(req.headers.stripekey)
    const { orderId } = req.body;

    const order = Order.findById(orderId)
    const product = Product.findById(order.product)

    stripe.paymentIntents.create({
        // amount: product.price * order.quantity,
        amount: 1000,
        currency: 'usd',
        payment_method_types: ['card']

    }).then((paymentIntent) => {
        if (paymentIntent) {
            const newPayment = new Payment({
                // project: order.project,
                order: orderId,
                stripePaymentIntentId: paymentIntent.id,
            })
            newPayment.save()
            return res.status(200).json({
                message: 'Payment intent created successfully',
                paymentIntent: paymentIntent
            });
        }
    }).catch((err) => {
        return res.status(500).json({
            message: 'Something went wrong',
            error: err
        });
    })
}

exports.getAllPayments = async (req, res) => {
    try {
        // const {projectId} = req.body;
        // const Payments = Payment.find({project: projectId})
        const payments = Payment.find()
        return res.status(200).json({
            message: 'Payments retrieved successfully',
            // payments: payments

        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}



