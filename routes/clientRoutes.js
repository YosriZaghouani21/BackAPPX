const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const {
    createClient
} = require("../controllers/clientController.js");
//const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.post("/client", createClient);

module.exports = Router;
