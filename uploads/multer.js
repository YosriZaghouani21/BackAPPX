const multer = require("multer");
const fs = require("fs");
const express = require("express");

const Router = express.Router();

//Engine Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.id; // get the user ID from the request object
    const uploadDir = `./uploads/${userId}`; // create a directory path with the user ID
    fs.mkdirSync(uploadDir, { recursive: true }); // create the directory if it doesn't exist
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

//file validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    //prevent to upload
    cb({ message: "Unsupported File Format" }, false);
  }
};

//  check remaining storage space
const checkStorageLimit = (req, res, next) => {
  const userId = req.user.id;
  const userStorageLimit = 1024 * 1024 * 100; // get the user's storage limit from your database
  const usedStorage = getUsedStorageForUser(userId); // calculate how much storage space the user has already used
  const remainingStorage = userStorageLimit - usedStorage;
  const fileSize = req.file.size;

  if (fileSize > remainingStorage) {
    return res.status(400).json({ message: "File size exceeds storage limit" });
  }

  next();
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});

// usage
Router.post("/upload", upload.single("file"), checkStorageLimit, (req, res) => {
  res.json({ message: "File uploaded successfully" });
});

module.exports = Router;
