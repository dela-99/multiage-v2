const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");

const staffRoles = ["ADMINISTRATOR", "SECRETARY", "FINANCE", "GRAPHICS"];

router.route("/")
  .get(protect, authorize("CEO", ...staffRoles), getProjects)
  .post(
    protect,
    authorize("CEO", "ADMINISTRATOR", "SECRETARY"),
    [
      body('client').isMongoId().withMessage('A valid client ID is required.'),
      body('requestedService').notEmpty().trim().escape().withMessage('Service is required.'),
      body('assignedDepartment').notEmpty().trim().escape().withMessage('Department is required.'),
      body('budget').optional().isNumeric().withMessage('Budget must be a number.'),
      body('priority').isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority value.'),
    ],
    createProject
  );

router.route("/:id")
  .get(protect, authorize("CEO", ...staffRoles), getProjectById)
  .put(protect, authorize("CEO", "ADMINISTRATOR", "FINANCE"), updateProject)
  .delete(protect, authorize("CEO"), deleteProject);

module.exports = router;