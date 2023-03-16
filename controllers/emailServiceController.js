const email = require("../models/email");
const client = require("../models/clientModel");
const nodemailer = require("nodemailer");



// Create and Save a new email
exports.createEmail = async (req, res) => {
const { from, to, subject, body,scheduleTime } = req.body;
  const newEmail = new email({ from, to, subject, body,scheduleTime });
  try {
    const savedEmail = await newEmail.save();
    res.status(200).json(savedEmail);
  } catch (err) {
    res.status(500).json(err);
  }
}

// Retrieve all emails from the database.
exports.findAllEmails = async (req, res) => {
    try {
        const emails = await email.find();
        return res.status(200).json(emails);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

// Find a single email with an id
exports.findOneEmail = async (req, res) => {
    try {
        const email = await email.findById(req.params.id);
        return res.status(200).json(email);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}


// Update a email by the id in the request
exports.updateEmail = async (req, res) => {
    try {
        const { from, to, subject, body,scheduleTime } = req.body;
        const newEmail = await email.findByIdAndUpdate(req.params.id,
            { from,
                to,
                subject,
                body,
                scheduleTime
            });
        return res.status(200).json({
            });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}


// Delete an email with the specified id in the request
exports.deleteEmail = async (req, res) => {
    try{
        await email.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            status: "deleted",
            msg: "Email deleted" });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

// send email to clients
exports.sendEmail = async (req, res) => {

}