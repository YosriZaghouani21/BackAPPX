const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const { createProduct } = require("../controllers/productController.js");
const { allProducts } = require("../controllers/productController.js");
const { deleteProduct } = require("../controllers/productController.js");
const { updateProduct } = require("../controllers/productController.js");
const { getAllProductsByProject,uploadPhotoToProduct } = require("../controllers/productController.js");

const uploader = require("../uploads/multer");
const {getAllProductsByProjectRefrence} = require("../controllers/productController");
const Router = express.Router();
const upload = require('../uploads/multer');

Router.get("/getAllProductsByProject/:projectId", getAllProductsByProject);
Router.get("/getAllProductsByProjectRef/:projectId", getAllProductsByProjectRefrence);
Router.post("/product", uploader.single("image"), createProduct);
Router.get("/getallproduct", allProducts);
Router.delete("/product/:id", deleteProduct);
Router.put("/updateProduct/:id", updateProduct);
Router.put("/uploadPhotoProduct/:id",  upload.single("image"), uploadPhotoToProduct);


module.exports = Router;