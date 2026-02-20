const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Video = require("../models/Video");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

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


// ==========================
// DELETE VIDEO (ADMIN)
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.cloudinaryId, {
      resource_type: "video"
    });

    // Delete from MongoDB
    await Video.findByIdAndDelete(id);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("DELETE VIDEO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;