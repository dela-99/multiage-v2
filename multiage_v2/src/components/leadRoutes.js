const express = require("express");
const router = express.Router();
const {
  getLeads,
  getLeadById,
  updateLead,
  addLeadNote,
} = require("../controllers/leadController");
const { protect, authorize } = require("../middleware/authMiddleware");

const leadRoles = ["CEO", "ADMINISTRATOR", "SECRETARY"];

router.route("/").get(protect, authorize(...leadRoles), getLeads);

router.route("/:id")
  .get(protect, authorize(...leadRoles), getLeadById)
  .put(protect, authorize(...leadRoles), updateLead);

router.route("/:id/notes").post(protect, authorize(...leadRoles), addLeadNote);

module.exports = router;