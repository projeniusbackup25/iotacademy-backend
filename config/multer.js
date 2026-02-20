const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "iotacademy/web",   // videos stored under this folder
    resource_type: "video",     // VERY IMPORTANT
    allowed_formats: ["mp4", "mov", "avi"]
  }
});

const upload = multer({ storage });

module.exports = upload;
