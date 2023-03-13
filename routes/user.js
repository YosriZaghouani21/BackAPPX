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
  userData,
  getSingleUser,
  addMyProject,
  forgotPassword,
  resetPassword,
  uploadphoto,
  blockUser,
  updateUserSubscription,
  uploadImage
} = require("../controllers/user.js");
const multer = require("multer");
const fs = require("fs");

const Router = express.Router();
const path = require("path");
Router.post("/register", registerRules(), validator, register);
Router.post("/login", login, authorizeRoles);
Router.put("/profile/:id", updateUser);
Router.delete("/delete/:id", deleteUser);
Router.put("/forgot-password", forgotPassword);
Router.post("/userData", userData);
Router.put("/reset-password", resetPassword);
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

/* Router.post("/upload/:userId", upload.single("file"), (req, res) => {
  const { userId } = req.params;
  // Use userId here
}); */
Router.put("/upload/:userId", upload.single("file"), uploadImage);

Router.put("/blockUser", blockUser);
Router.put("/update-subscription", updateUserSubscription);

module.exports = Router;
