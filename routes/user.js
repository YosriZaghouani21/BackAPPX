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
  uploadphoto,
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
    const userId = "63e8050800f30e5a856f3ea6";
    const uploadDir = `./uploads/${userId}`;
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb({ message: "Unsupported File Format" }, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});

// handle the upload
Router.post("/upload", upload.single("file"), (req, res) => {
  const fileUrl = `${`http://localhost:9092`}/${req.file.path}`;
  return res.json({
    success: true,
    url: fileUrl,
  });
});

module.exports = Router;
