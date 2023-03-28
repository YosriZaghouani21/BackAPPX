const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const {createPoduct} = require("../controllers/productController.js");

const uploader = require("../uploads/multer");
const Router = express.Router();

Router.post("/product", uploader.single("image") ,createPoduct);

module.exports = Router;
