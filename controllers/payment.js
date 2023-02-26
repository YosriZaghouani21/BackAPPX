const express = require("express")
 const payment = require("../models/payment")

// add a new payment
exports.createPayment = async (req, res) => {
    const { userId, subscriptionId, status, createdAt, endDate } = req.body;
  try {
    const newPayment = new payment({
        userId,
        subscriptionId,
        status,
        createdAt,
        endDate
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ errors: error });
  }

}

// get payment by id
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await payment.findById(req.params.id);
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ errors: error });
    }
}

// delete payment by id
exports.deletePaymentById = async (req, res) => {
    try {
        await payment.findByIdAndDelete(req.params.id);
        res.json({ msg: "payment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

// update payment by id
exports.updatePaymentById = async (req, res) => {
    try {
        await payment.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ msg: "payment updated successfully" });
    } catch (error) {
        res.status(500).json({ errors: error });
    }
}

