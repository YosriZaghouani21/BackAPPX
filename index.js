const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConnect");
const userRoutes = require("./routes/user.js");
const projectRoutes = require("./routes/projectroutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cloudinary = require("./uploads/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Basic Configuration
const app = express();
const port = process.env.PORT || 9092;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes path
app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/client", clientRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);

// Upload Image
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "png",
    public_id: (req, file) => "computed-filename-using-request",
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  const uploadResult = await cloudinary.uploader.upload(req.file.path);
  return res.json({
    success: true,
    file: uploadResult.secure_url,
  });
});

// MongoDB setup
connectDB();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
