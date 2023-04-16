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
  getFile
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
Router.get("/file/:projectId/:fileName", getFile);

module.exports = Router;


//-----------------------------------------------------------------------------------------------//
//---------------------------------- Swagger Documentation -------------------------------------//
//-----------------------------------------------------------------------------------------------//

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - reference
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the project
 *         name:
 *           type: string
 *           description: The name of the project
 *         reference:
 *           type: string
 *           description: The reference of the project
 *         createdAt:
 *           type: Date
 *           description: The user's creation date
 *           default: new Date()
 *       example:
 *         id: 5f5a64d471c4360017c2e1f3
 *         name: Project 1
 *         reference: 5f5a64d471c4360017c2e1f3
 *         description: This is a project
 *         createdAt: 2020-03-10T04:05:06.157Z
 */




/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: The Project management API
 * /projects:
 *   get:
 *     summary: Lists all the projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: The list of the projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 * /project/{id}:
 *   get:
 *     summary: Get the project by id
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
 *     responses:
 *       200:
 *         description: The project response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: The project was not found
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: The created project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Some server error
 *   put:
 *    summary: Update the project by the id
 *    tags: [Projects]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The project id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Project'
 *    responses:
 *      200:
 *        description: The project was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Project'
 *      404:
 *        description: The project was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the project by id
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project id
 *
 *     responses:
 *       200:
 *         description: The project was deleted
 *       404:
 *         description: The project was not found
 */


