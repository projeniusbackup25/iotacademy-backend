const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id);
      if (!admin || !admin.isLoggedIn)
        return res.status(401).json({ message: "Session expired" });

      req.user = { ...admin._doc, role: "admin" };
    } else {
      const user = await User.findById(decoded.id);
      if (!user || !user.isLoggedIn)
        return res.status(401).json({ message: "Session expired" });

      req.user = { ...user._doc, role: "user" };
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
