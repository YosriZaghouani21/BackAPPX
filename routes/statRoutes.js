const express = require("express");

const {
    getActiveUsers,
} = require("../controllers/statsController.js");
//const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.get("/gett/:ref", getActiveUsers);

module.exports = Router;