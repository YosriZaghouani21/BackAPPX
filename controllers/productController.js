const Product = require("../models/projectModel.js");
const Category = require("../models/categoryModel");
const cloudinary = require("../uploads/cloudinary");


// create Poduct
exports.createPoduct = async (req, res) => {
  const { name, description,price,quantity,category,reference } = req.body;
  const image = await cloudinary.v2.uploader.upload(req.file.path);
  try {
    const newPoduct = new Product({
      name,
      reference,
      description,
      image,
      price,
      quantity,
      category
      });
    await newPoduct.save();
    res.status(201).json(newPoduct);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body)
    .then((doc2) => {
      res.status(200).json(doc2);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Get all product by project reference
exports.allProducts = async (req, res) => {
  Product.find(req.params.reference)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

//Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "projet supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Get Product by id
exports.getSingleProject = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

