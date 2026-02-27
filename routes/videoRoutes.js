const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Video = require("../models/Video");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// ADMIN CHECK
// ==========================
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// ==========================
// VALID SUBCATEGORIES
// ==========================
const VALID_SUBCATEGORIES = ["beginner", "intermediate", "advanced"];

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

      if (!title || !subCategory) {
        return res.status(400).json({ message: "Title and subCategory required" });
      }

      if (!VALID_SUBCATEGORIES.includes(subCategory.toLowerCase())) {
        return res.status(400).json({ message: "Invalid subCategory" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No video uploaded" });
      }

      const newVideo = new Video({
        title,
        category: "iot", // 🔥 Changed from "web"
        subCategory: subCategory.toLowerCase(),
        videoUrl: req.file.path,
        cloudinaryId: req.file.filename,
      });

      await newVideo.save();

      res.status(201).json({
        message: "Video uploaded successfully",
        video: newVideo,
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

    if (!VALID_SUBCATEGORIES.includes(subCategory.toLowerCase())) {
      return res.status(400).json({ message: "Invalid subCategory" });
    }

    const videos = await Video.find({
      category: "iot", // 🔥 Changed from "web"
      subCategory: subCategory.toLowerCase(),
    }).sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (err) {
    console.error("GET VIDEOS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// USER GET OWN LEVEL VIDEOS (SECURE)
// ==========================
router.get(
  "/user",
  authMiddleware,
  async (req, res) => {
    try {
      if (!req.user || req.user.role !== "user") {
        return res.status(403).json({ message: "User access only" });
      }

      const userLevel = req.user.workshopKit;

      const videos = await Video.find({
        category: "iot",
        subCategory: userLevel,
      }).sort({ createdAt: -1 });

      res.status(200).json(videos);
    } catch (err) {
      console.error("USER VIDEO FETCH ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

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

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(video.cloudinaryId, {
        resource_type: "video",
      });

      // Delete from DB
      await Video.findByIdAndDelete(id);

      res.status(200).json({ message: "Video deleted successfully" });
    } catch (err) {
      console.error("DELETE VIDEO ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);



module.exports = router;