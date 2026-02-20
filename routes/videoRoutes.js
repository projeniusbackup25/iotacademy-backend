const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Video = require("../models/Video");

// ADMIN UPLOAD VIDEO
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title, subCategory } = req.body;

    const newVideo = new Video({
      title,
      category: "web",
      subCategory, // html / css / js
      videoUrl: req.file.path,
      cloudinaryId: req.file.filename
    });

    await newVideo.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
