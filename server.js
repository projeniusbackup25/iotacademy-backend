require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const videoRoutes = require("./routes/videoRoutes"); // ✅ ADD THIS

const app = express();

// CORS CONFIG
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
  })
);

// BODY PARSER
app.use(express.json());

// ROUTE MIDDLEWARES
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/videos", videoRoutes); // ✅ ADD THIS LINE

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

// SERVER + DB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("Mongo Error:", err));
