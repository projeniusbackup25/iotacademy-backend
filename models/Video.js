const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  category: {
    type: String,
    enum: ["web"],
    required: true
  },
  subCategory: {
    type: String,
    enum: ["html", "css", "js"],
    required: true
  },
  videoUrl: String,
  cloudinaryId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Video", videoSchema);
