const Project = require("../models/projectModel.js");
const config = require("config");
const { concat } = require("lodash");
const path = require("path");
const fs = require("fs");

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

exports.uploadImage = async (req, res) => {
  const { projectId } = req.params;

  if (req.file && req.file.path) {
    const fileUrl = path.basename(req.file.path);
    console.log("image path", fileUrl);
    const updatedProject = await Project.findByIdAndUpdate(projectId, {
      image: fileUrl,
    });

    return res.json({
      status: "ok",
      success: true,
      url: fileUrl,
      project: updatedProject,
    });
  } else {
    return res.status(400).json({
      status: "error",
      message: "File not found",
    });
  }
};

exports.getImages = async (req, res) => {
  const { projectId } = req.params;
  const uploadDir = `./uploads/${projectId}`;
  try {
    const files = await fs.promises.readdir(uploadDir);
    const imageFiles = files.filter((file) => {
      const extension = file.split(".").pop().toLowerCase();
      return ["jpeg", "jpg", "png", "gif", "pdf"].includes(extension);
    });
    const images = await Promise.all(
      imageFiles.map(async (file) => {
        const filePath = `C:/Users/zagho/OneDrive/Documents/GitHub/BackAPPX/uploads/${projectId}/${file}`;
        const stats = await fs.promises.stat(filePath);
        const sizeInBytes = stats.size;
        const sizeInKB = Math.round(sizeInBytes / 1024);
        const name = file;
        const type = file.split(".").pop().toLowerCase();
        return { name, sizeInBytes, sizeInKB, type, path: filePath };
      })
    );
    res.status(200).json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get images" });
  }
};

exports.deleteImage = async (req, res) => {
  const { projectId, imageName } = req.params;
  const imagePath = path.join(
    __dirname,
    `../uploads/${projectId}/${imageName}`
  );
  try {
    // Check if file exists
    fs.accessSync(imagePath, fs.constants.F_OK);

    // Delete file
    fs.unlinkSync(imagePath);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
