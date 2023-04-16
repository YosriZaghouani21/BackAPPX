const express = require("express");
const {
  addCategorie,
  DeleteCategorie,
  addCategoryToProduct,
} = require("../controllers/categorie");
const Router = express.Router();

Router.post("/addcategorie", addCategorie);
Router.delete("/:CategorieID", DeleteCategorie);
Router.post("/products/:productId/categories", addCategoryToProduct);
module.exports = Router;
