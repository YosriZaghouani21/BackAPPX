const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const {
  createProject,
  allProjects,
  deleteProject,
  getSingleProject,
  updateProject,
} = require("../controllers/projectController");
//const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.post("/project", createProject);
Router.get("/project", allProjects);
Router.delete("/project/:id", deleteProject);
Router.get("/project/:id", getSingleProject);
Router.put("/project/:id", updateProject);

module.exports = Router;
