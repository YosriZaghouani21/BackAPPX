const express = require("express");

const { registerRules, validator } = require("../middlewares/validator.js");
const isAuth = require("../middlewares/passport-setup.js");
const {
  createProject,
  allProjects,
  deleteProject,
  getSingleProject,
  updateProject,
  uploadImage,
  getImages,
  deleteImage,
} = require("../controllers/projectController");
//const isAuth = require("../middleware/passport-setup.js");

// Upload Image
const multer = require("multer");
const fs = require("fs");

const Router = express.Router();

Router.post("/project", createProject);
Router.get("/project", allProjects);
Router.delete("/project/:id", deleteProject);
Router.get("/project/:id", getSingleProject);
Router.put("/project/:id", updateProject);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectId = req.params.projectId;
    const uploadDir = `./uploads/${projectId}`;
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

Router.put("/upload/:projectId", upload.single("file"), uploadImage);
Router.get("/images/:projectId", getImages);
Router.delete("/image/:projectId/:imageName", deleteImage);

module.exports = Router;
