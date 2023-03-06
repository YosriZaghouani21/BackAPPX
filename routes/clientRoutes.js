const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");

const uploader = require("../uploads/multer");
const {
    createClient,
    allClients,
    allClientsByProjectReference,
    updateClient,
    deleteClient,
    getSingleClient,
    uploadPhotoToClient,
    forgotPassword,
    clientresetPassword,
    loginclient,
} = require("../controllers/clientController.js");
//const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.post("/client", createClient);
Router.get("/client", allClients);
Router.delete("/client/:id", deleteClient);
Router.put("/client/:id", updateClient);
Router.get("/client/:reference", allClientsByProjectReference);
Router.get("/clientbyid/:id", getSingleClient);
Router.put("/uploadPhotoClient/:id",  uploader.single("image"), uploadPhotoToClient);
Router.put("/clientforgot-password", forgotPassword);
Router.put("/clientresetpassword", clientresetPassword);
Router.post("/login", loginclient);

module.exports = Router;
