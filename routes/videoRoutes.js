const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Video = require("../models/Video");

// ==========================
// ADMIN UPLOAD VIDEO
// ==========================
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title, subCategory } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

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
    console.error("UPLOAD VIDEO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// GET VIDEOS (USER SIDE)
// ==========================
router.get("/", async (req, res) => {
  try {
    const { subCategory } = req.query;

    if (!subCategory) {
      return res.status(400).json({ message: "subCategory query is required" });
    }

    const videos = await Video.find({
      category: "web",
      subCategory
    }).sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (err) {
    console.error("GET VIDEOS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;