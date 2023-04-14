const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const cloudinary = require("../uploads/cloudinary");


// create category
exports.createCategory = async (req, res) => {
  const { name, description, reference } = req.body;
  const image = await cloudinary.v2.uploader.upload(req.file.path);
  try {
    const newCategory = new Category({
      name,
      reference,
      description,
      image,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  Category.findByIdAndUpdate(req.params.id, req.body)
    .then((doc2) => {
      res.status(200).json(doc2);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Get all Category by project reference
exports.allCategories = async (req, res) => {
  Category.find(req.params.reference)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

//Delete a Category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: "categorie supprimée avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Get Category by id
exports.getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json({ category });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


//Add product to a category
exports.addMyProduct = async (req, res) => {
  const categoryId = req.params.id;
  const { ProductId } = req.body;
  console.log("🚀  ProductId", ProductId);

  try {
    const searchedCategory = await Category.findOne({ _id: categoryId });
    console.log(searchedCategory);
    searchedCategory.Products.push(ProductId);
    const category = await Category.findByIdAndUpdate(ProductId, searchedCategory, {
      strictPopulate: false,
      new: true,
      useFindAndModify: false,
    }).populate({ path: "product", model: Product });

    return res.status(200).json(searchedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
};
