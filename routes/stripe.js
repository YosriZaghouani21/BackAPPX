const express = require("express");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/user");
const paymentController = require("../controllers/payment");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


router.get("/config", async (req, res) => {
    const public_key = process.env.STRIPE_PUBLIC_KEY;
    res.send({
        public_key

    });
});

router.post("/create-payment-intent", async (req, res) => {
    const { items, email } = req.body;
    const user =  User.findOne(email);
    console.log('email= '+ email)
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 4000,
        currency: "usd",

        }).then((paymentIntent) => {
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
        // update user subscription on server
         userController.updateUserSubscription(email)
         
        // send email to user after payment
        paymentController.sendEmailConfirmationPayment(email)
    });
});

module.exports = router;

