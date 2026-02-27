const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ["iot"],   // 🔥 Changed from "web" to "iot"
    required: true,
  },

  subCategory: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],  // 🔥 Updated
    required: true,
  },

  videoUrl: {
    type: String,
    required: true,
  },

  cloudinaryId: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Video", videoSchema);