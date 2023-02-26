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
} = require("../controllers/user.js");
//const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.post("/register", registerRules(), validator, register);
Router.post("/login", login, authorizeRoles);
Router.put("/profile/:id", updateUser);
Router.delete("/delete/:id", deleteUser);
Router.put("/forgot-password", forgotPassword);

Router.get("/users", allUsers);
Router.get("/user/:id", getSingleUser);
Router.get("/current", isAuth(), (req, res) => {
  console.log("req", req);
  res.json(req.user);
});
Router.put("/myProject/:id", addMyProject);

module.exports = Router;
