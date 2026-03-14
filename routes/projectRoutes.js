const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");

const authMiddleware = require("../middleware/authMiddleware");

const ProjectSubmission = require("../models/ProjectSubmission");
const User = require("../models/User");

/*
========================================
SUBMIT PROJECT
========================================
*/
router.post(
"/submit",
authMiddleware,
upload.single("video"),
async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { projectTitle, level } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }

    // Check if user is allowed for this level
    if (user.workshopKit !== level) {
      return res.status(403).json({
        message: "You are not allowed to submit this level project"
      });
    }

    const newSubmission = new ProjectSubmission({

      userId: user._id,
      userEmail: user.email,
      userPhone: user.phone,

      projectTitle,
      level,

      videoUrl: req.file.path,
      cloudinaryId: req.file.filename

    });

    await newSubmission.save();

    res.status(201).json({
      message: "Project submitted successfully",
      submission: newSubmission
    });

  }
  catch (err) {

    console.error("PROJECT SUBMIT ERROR:", err);

    res.status(500).json({
      message: "Project submission failed"
    });

  }

}
);



/*
========================================
GET USER PROJECTS
========================================
*/
router.get(
"/my-projects",
authMiddleware,
async (req, res) => {

  try {

    const projects = await ProjectSubmission.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json(projects);

  }
  catch (err) {

    console.error("FETCH USER PROJECTS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch projects"
    });

  }

}
);



/*
========================================
ADMIN GET ALL PROJECTS
========================================
*/
router.get(
"/admin",
authMiddleware,
async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {

    const submissions = await ProjectSubmission.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);

  }
  catch (err) {

    console.error("ADMIN PROJECT FETCH ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch submissions"
    });

  }

}
);



/*
========================================
ADMIN DELETE PROJECT
========================================
*/
router.delete(
"/:id",
authMiddleware,
async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const submission = await ProjectSubmission.findById(id);

    if (!submission) {
      return res.status(404).json({ message: "Project not found" });
    }

    await cloudinary.uploader.destroy(submission.cloudinaryId, {
      resource_type: "video"
    });

    await ProjectSubmission.findByIdAndDelete(id);

    res.status(200).json({
      message: "Project deleted"
    });

  }
  catch (err) {

    console.error("DELETE PROJECT ERROR:", err);

    res.status(500).json({
      message: "Delete failed"
    });

  }

}
);

module.exports = router;