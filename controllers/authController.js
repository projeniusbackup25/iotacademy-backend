const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

/* ======================= LOGIN ======================= */
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    console.log("LOGIN ATTEMPT:", phone);

    /* ================= ADMIN LOGIN ================= */
    const admin = await Admin.findOne({ phone });

    if (admin) {
      console.log("ADMIN FOUND");

      if (admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      admin.isLoggedIn = true;
      admin.sessionToken = uuidv4();
      await admin.save();

      return res.json({
        message: "Admin login successful",
        role: "admin",
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          phone: admin.phone,
          email: admin.email,
        },
      });
    }

    /* ================= USER LOGIN ================= */
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.isLoggedIn = true;
    user.sessionToken = uuidv4();
    await user.save();

    return res.json({
      message: "User login successful",
      role: "user",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        workshopKit: user.workshopKit,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================= LOGOUT ======================= */
const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isLoggedIn = false;
    user.sessionToken = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

/* ======================= FORGOT PASSWORD ======================= */
const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    console.log("RESET EMAIL:", user.email);
    console.log("RESET LINK:", resetLink);

    return res.json({
      name: user.name,
      email: user.email,
      resetLink,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================= RESET PASSWORD ======================= */
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  logout,
  forgotPassword,
  resetPassword,
};
