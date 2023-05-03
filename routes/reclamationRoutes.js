const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");

const uploader = require("../uploads/multer");
const {
    createReclamation,
} = require("../controllers/reclamationController.js");
const {
    sendMessage,
    allMessagesByReclamationId
} = require("../controllers/messageController.js");
//const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.post("/reclamation", createReclamation);
Router.get("/reclamation", createReclamation);
Router.get("/reclamation/getMessages/:id", allMessagesByReclamationId);
Router.post("/reclamation/sendMessage", sendMessage);

module.exports = Router;
