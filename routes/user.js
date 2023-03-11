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
} = require("../controllers/user.js");
//Upload Image
const cloudinary = require("../uploads/cloudinary");
const uploader = require("../uploads/multer");

const Router = express.Router();

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
Router.put("/uploadphoto/:id", uploader.single("image"), uploadphoto);

module.exports = Router;
