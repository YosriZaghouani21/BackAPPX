const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const { createPoduct } = require("../controllers/productController.js");
const { allProducts } = require("../controllers/productController.js");
const { deleteProduct } = require("../controllers/productController.js");
const { updateProduct } = require("../controllers/productController.js");

const uploader = require("../uploads/multer");
const Router = express.Router();

Router.post("/product", uploader.single("image"), createPoduct);
Router.get("/getallproduct", allProducts);
Router.delete("/product/:id", deleteProduct);
Router.put("/updateProduct/:id", updateProduct);

module.exports = Router;