const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true, // ❗ NO HASH (as you requested)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
