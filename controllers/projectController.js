const Project = require("../models/projectModel.js");
const config = require("config");
const { concat } = require("lodash");

// create project
exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  var crypto = require("crypto");
  var reference = crypto.randomBytes(30).toString("hex");
  console.log(reference.length);
  try {
    const newProject = new Project({
      name,
      reference,
      description,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  Project.findByIdAndUpdate(req.params.id, req.body)
    .then((doc2) => {
      res.status(200).json(doc2);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Get all projects
exports.allProjects = async (req, res) => {
  Project.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

//Delete a project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: "projet supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Get Project with id
exports.getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};