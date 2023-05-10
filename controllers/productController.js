const Product = require("../models/productModel.js");
const Category = require("../models/categoryModel");
const cloudinary = require("../uploads/cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Project = require("../models/projectModel.js");
const Order = require("../models/orderModel.js");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// // create Poduct
// exports.createPoduct = async (req, res) => {
//   const { name, description, price, quantity, category, reference } = req.body;
//   const image = await cloudinary.v2.uploader.upload(req.file.path);
//   try {
//     const newPoduct = new Product({
//       name,
//       reference,
//       description,
//       image,
//       price,
//       quantity,
//       category
//     });
//     await newPoduct.save();
//     res.status(201).json(newPoduct);
//   } catch (error) {
//     res.status(500).json({ errors: error });
//   }
// };


exports.createProduct = async (req, res) => {
  const { name, description, price, quantity, category, reference, project } = req.body;
  const image = await cloudinary.v2.uploader.upload(req.file.path);
  try {
    // Create a new product
    const newProduct = new Product({
      name,
      reference,
      description,
      image,
      price,
      quantity,
      category,
      project
    });
    // Save the new product
    await newProduct.save();
    // Find the project by ID and update its products array with the new product
    const updatedProject = await Project.findByIdAndUpdate(project, { $push: { products: newProduct } }, { new: true });
    const updatedCategorie = await Category.findByIdAndUpdate(category, { $push: { Products: newProduct } }, { new: true });

    res.status(201).json({ newProduct, updatedProject, updatedCategorie });
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};


exports.getAllProductsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find all products with the matching project ID
    const products = await Product.find({ project: projectId });

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

// // Update product
// exports.updateProduct = async (req, res) => {

//   // No error occurred, so update the product
//   const { nameEdit, descriptionEdit, priceEdit, referenceEdit, quantityEdit, categoryEdit } = req.body;
//   console.log(req.file);

//   let imageEdit = null;

//   if (req.file) {
//     imageEdit = cloudinary.v2.uploader.upload(req.file.path)
//   }

//   // Check if an image was uploaded and update accordingly
//   const updateData = { name: nameEdit, description: descriptionEdit, price: priceEdit, reference: referenceEdit, quantity: quantityEdit, category: categoryEdit, image: imageEdit };
//   Product.findByIdAndUpdate(req.params.id, updateData)
//     .then((doc2) => {
//       res.status(200).json(doc2);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// };

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, reference, quantity, category, image } = req.body;
    console.log('Request body:', req.body);

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name,
      description,
      price,
      reference,
      quantity,
      category,
      image
    }, { new: true });
    console.log('Updated product:', updatedProduct);

    return res.status(200).json({
      status: "updated",
      message: "Product has been successfully updated",
      data: updatedProduct
    });
  } catch (err) {
    console.log('Error:', err);
    return res.status(500).json({ message: err.message });
  }
};

exports.uploadPhotoToProduct = async (req, res) => {
  try {
    const image = await cloudinary.v2.uploader.upload(req.file.path);
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      image:image.secure_url,
    });
    res.json({
      success: true,
      file: image,
      product: updatedProduct,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
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

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    // Delete the product from the category
    await Category.updateMany(
      { _id: { $in: product.category } },
      { $pull: { products: productId } }
    );

    // Delete the product from the project
    await Project.updateMany(
      { _id: { $in: product.project } },
      { $pull: { products: productId } }
    );

    // Delete the product itself
    await Product.findByIdAndDelete(productId);

    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    await Category.updateMany(
      { Products: id },
      { $pull: { Products: id } }
    );

    await Project.updateMany(
      { products: id },
      { $pull: { products: id } }
    );

    // Find and delete the orders that contain the product being deleted
    const orders = await Order.find({ "products.product": id });
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const updatedProducts = order.products.filter(
        (product) => product.product.toString() !== id
      );
      order.products = updatedProducts;
      await order.save();
    }

    res.status(200).json({ deletedProduct });
  } catch (error) {
    res.status(500).json({ error });
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
