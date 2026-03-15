const express = require("express");
const router = express.Router();

const { getDashboardReports } = require("../controllers/reportController");

router.get("/dashboard", getDashboardReports);

module.exports = router;