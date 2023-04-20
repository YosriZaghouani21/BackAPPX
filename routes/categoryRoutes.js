const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const {
    createCategory,
    updateCategory,
    deleteCategory,
    addMyProduct,
    allCategories,
    getSingleCategory } = require("../controllers/categoryController");

const uploader = require("../uploads/multer");
const Router = express.Router();

Router.post("/category", uploader.single("image"), createCategory);
Router.put("/category/:id", updateCategory);
Router.delete("/category/:id", deleteCategory);
Router.put("/addproducttocategory/:id", addMyProduct);
Router.put("/addCategory/:id", getSingleCategory);
Router.get("/category/:id", getSingleCategory);
Router.get("/allCategories", allCategories);

module.exports = Router;