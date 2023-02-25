const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: "dr63ndxik",
  api_key: "882342755543936",
  api_secret: "WJJt6uIMJ9yDolAu0gN8_GVeh_k",
  secure: true,
});

exports.uploads = (file, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.url,
          id: result.public_id,
        });
      },
      {
        resource_type: "auto",
        folder: folder,
      }
    );
  });
};

module.exports = cloudinary;