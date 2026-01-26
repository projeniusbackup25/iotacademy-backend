const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const { generatePassword } = require("../utils/passwordGenerator");

exports.paymentSuccess = async (req, res) => {
  try {
    const { name, phone, email, workshopKit, paymentId, amount } = req.body;

    if (!name || !phone || !email || !workshopKit || !paymentId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ phone });

    let generatedPassword = null;

    if (!user) {
      generatedPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      user = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        workshopKit,
      });
    }

    const order = await Order.create({
      userId: user._id,
      paymentId,
      amount,
      workshopKit,
      paymentStatus: "success",
    });

    return res.status(201).json({
      message: "Payment processed successfully",
      generatedPassword,   // ⭐ VERY IMPORTANT
      user: {
        name,
        email,
        phone,
        workshopKit
      }
    });
  } catch (error) {
    console.error("Payment Controller Error:", error);
    return res.status(500).json({
      message: "Payment processing failed",
      error: error.message,
    });
  }
};
