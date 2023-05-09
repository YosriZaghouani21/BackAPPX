const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Client = require("../models/clientModel");

const Session = require("../models/sessionModel.js");

exports.getActiveUsers = async (req, res) => {

    let actives = 0
    Session.find({ "reference": req.params.ref })
        .then(doc => {
            console.log(doc.length);
            actives = doc.length
        })
        .catch(err => {
            console.log(err);
        })

    Client.find({ "reference": req.params.ref })
        .then(doc => {
            res.status(200).json({
                "active": doc.length,
                "signedin": actives
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })



};