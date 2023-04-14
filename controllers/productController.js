const Product = require("../models/productModel.js");
const Category = require("../models/categoryModel");
const cloudinary = require("../uploads/cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// create Poduct
exports.createPoduct = async (req, res) => {
  const { name, description, price, quantity, category, reference } = req.body;
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

  // No error occurred, so update the product
  const { nameEdit, descriptionEdit, priceEdit, referenceEdit, quantityEdit, categoryEdit } = req.body;
  console.log(req.file);

  let imageEdit = null;

  if (req.file) {
    imageEdit = cloudinary.v2.uploader.upload(req.file.path)
  }

  // Check if an image was uploaded and update accordingly
  const updateData = { name: nameEdit, description: descriptionEdit, price: priceEdit, reference: referenceEdit, quantity: quantityEdit, category: categoryEdit, image: imageEdit };
  Product.findByIdAndUpdate(req.params.id, updateData)
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

