const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

/*
========================================
ADMIN ONLY CHECK
========================================
*/
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/*
========================================
GET ALL ORDERS FOR ADMIN DASHBOARD
========================================
*/
router.get("/admin", authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // get user name & email
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      name: order.userId?.name || "Unknown",
      email: order.userId?.email || "Unknown",
      course: `${order.workshopKit.charAt(0).toUpperCase() + order.workshopKit.slice(1)} IoT`,
      level: order.workshopKit,
      dateJoined: order.createdAt,
      status: order.paymentStatus === "success" ? "Paid" : "Failed",
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("FETCH ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;