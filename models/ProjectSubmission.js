const mongoose = require("mongoose");

const projectSubmissionSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  userEmail: {
    type: String,
    required: true
  },

  userPhone: {
    type: String,
    required: true
  },

  projectTitle: {
    type: String,
    required: true
  },

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },

  videoUrl: {
    type: String,
    required: true
  },

  cloudinaryId: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["submitted", "approved", "rejected"],
    default: "submitted"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("ProjectSubmission", projectSubmissionSchema);