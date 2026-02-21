const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Video = require("../models/Video");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

// ADMIN CHECK
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// ==========================
// ADMIN UPLOAD VIDEO
// ==========================
router.post(
  "/upload",
  authMiddleware,
  adminOnly,
  upload.single("video"),
  async (req, res) => {
    try {
      const { title, subCategory } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No video uploaded" });
      }

      const newVideo = new Video({
        title,
        category: "web",
        subCategory,
        videoUrl: req.file.path,
        cloudinaryId: req.file.filename
      });

      await newVideo.save();

      res.status(201).json({
        message: "Video uploaded successfully",
        video: newVideo
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ==========================
// USER GET VIDEOS (PUBLIC)
// ==========================
router.get("/", async (req, res) => {
  try {
    const { subCategory } = req.query;

    if (!subCategory) {
      return res.status(400).json({ message: "subCategory required" });
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
// ADMIN DELETE VIDEO
// ==========================
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid video ID format" });
      }

      const video = await Video.findById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      await cloudinary.uploader.destroy(video.cloudinaryId, {
        resource_type: "video"
      });

      await Video.findByIdAndDelete(id);

      res.status(200).json({ message: "Video deleted successfully" });
    } catch (err) {
      console.error("DELETE VIDEO ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;