const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    workshopKit: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  {
    timestamps: true, // gives createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Order", orderSchema); 

