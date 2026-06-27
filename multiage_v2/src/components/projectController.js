const Project = require("../models/Project");
const { validationResult } = require("express-validator");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin, CEO, Secretary)
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (All Staff)
const getProjects = async (req, res, next) => {
  try {
    // CEO and Admins see all projects. Others see only projects they are assigned to.
    const query = ["CEO", "ADMINISTRATOR"].includes(req.user.adminRole)
      ? {}
      : { assignedStaff: req.user._id };
    const projects = await Project.find(query).populate("client", "name email").populate("assignedStaff", "name");
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private (All Staff)
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("client", "name email").populate("assignedStaff", "name");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin, CEO, Finance)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (CEO only)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };