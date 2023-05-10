const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Categorie = require("../models/Categorie");
const Product = require("../models/Product");

// Add categories
exports.addCategorie = async (req, res) => {
  try {
    const category = new Categorie({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
    });
    const result = await category.save();
    console.log(result);
    res.status(201).json({
      message: "Created category successfully",
      createdCategory: {
        name: result.name,
        _id: result._id,
        request: {
          type: "GET",
          url: "http://localhost:9092/categories/" + result._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

//Delete categorie with ID
exports.DeleteCategorie = async (req, res) => {
  try {
    const result = await Categorie.deleteOne({
      _id: req.params.CategorieID,
    }).exec();
    console.log(result);

    res.status(200).json({
      message: "Categorie deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/categories",
        body: { productId: "ID", quantity: "Number" },
      },
    });
    console.log("Categorie ID:", req.params.CategorieID);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

//Handling adding a category / product
exports.addCategoryToProduct = async (req, res) => {
  const productId = req.params.productId;
  const categoryId = req.body.categoryId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.category && product.category.toString() === categoryId) {
      return res
        .status(400)
        .json({ error: "Product is already in the category" });
    }

    product.category = categoryId;

    await product.save();

    res.json({ message: "Category added to product successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
