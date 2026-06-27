const express = require("express");
const router = express.Router();
const { getRevenueReport, getProjectReport, getStaffPerformanceReport } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

const reportRoles = ["CEO", "ADMINISTRATOR", "FINANCE"];

router.get("/revenue", protect, authorize(...reportRoles), getRevenueReport);
router.get("/projects", protect, authorize("CEO", "ADMINISTRATOR"), getProjectReport);
router.get("/staff", protect, authorize("CEO", "ADMINISTRATOR"), getStaffPerformanceReport);

module.exports = router;