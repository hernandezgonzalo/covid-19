require("dotenv").config();

const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "covid19",
  allowedFormats: ["jpg", "png"]
});

const uploadCloudinaryAvatar = multer({ storage });

module.exports = uploadCloudinaryAvatar;
