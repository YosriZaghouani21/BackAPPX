const express = require("express");
const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const {
  register,
  login,
  authorizeRoles,
  updateUser,
  deleteUser,
  allUsers,
  getSingleUser,
  addMyProject,
  forgotPassword,
  resetPassword,
  uploadImage,
  getImage,
} = require("../controllers/user.js");

// Upload Image
const multer = require("multer");
const fs = require("fs");

const Router = express.Router();

Router.post("/register", registerRules(), validator, register);
Router.post("/login", login, authorizeRoles);
Router.put("/profile/:id", updateUser);
Router.delete("/delete/:id", deleteUser);
Router.put("/forgot-password", forgotPassword);
Router.put("/reset-password", resetPassword);

// Router.post("/userData", userData);
Router.get("/users", allUsers);
Router.get("/user/:id", getSingleUser);
Router.get("/current", isAuth(), (req, res) => {
  console.log("req", req);
  res.json(req.user);
});
Router.put("/myProject/:id", addMyProject);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.userId;
    const uploadDir = `./uploads/${userId}`;
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  let filetype = "";
  let fileExtension = "";
  if (file.mimetype === "image/gif") {
    filetype = "image-";
    fileExtension = "gif";
  }
  if (file.mimetype === "image/png") {
    filetype = "image-";
    fileExtension = "png";
  }
  if (file.mimetype === "image/jpeg") {
    filetype = "image-";
    fileExtension = "jpeg";
  }
  if (file.mimetype === "application/pdf") {
    filetype = "pdf-";
    fileExtension = "pdf";
  }

  cb(null, filetype + Date.now() + "." + fileExtension);
  h = cb;
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5024 * 1024 },
  fileFilter: fileFilter,
});

Router.put("/upload/:userId", upload.single("file"), uploadImage);
Router.get("/image/:userId/:imageName", getImage);

module.exports = Router;
