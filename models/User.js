const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    workshopKit: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    isLoggedIn: {
      type: Boolean,
      default: false,
    },

    sessionToken: {
      type: String,
      default: null,
    },

    // 🔐 RESET PASSWORD FIELDS (FIX)
    resetPasswordToken: {
  type: String,
},

resetPasswordExpire: {
  type: Date,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
