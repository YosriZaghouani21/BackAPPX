const express = require("express")
dotenv = require("dotenv");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.createCustomerThenCharge = async (req, res) => {
    const { token, amount, description } = req.body
    const customer = await Stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        return stripe.charges.create({
            amount,
            description,
            currency: "usd",
            customer: customer.id
        })
    })
        .then(charge => {
            res.json({ charge })
        })
}
exports.success = async (req, res) => {
    res.render("success")
}
exports.cancel = async (req, res) => {
    res.render("cancel")
}
exports.error = async (req, res) => {
    res.render("error")
}


