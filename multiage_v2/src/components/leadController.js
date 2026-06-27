const Lead = require("../models/Lead");

// @desc    Get all leads with filtering
// @route   GET /api/leads
// @access  Private (Secretary, Admin, CEO)
const getLeads = async (req, res, next) => {
  try {
    const { status, assignedStaff, service } = req.query;
    const query = {};

    if (status) query.status = status;
    if (assignedStaff) query.assignedStaff = assignedStaff;
    if (service) query.requestedService = { $regex: service, $options: "i" };

    const leads = await Lead.find(query).populate("assignedStaff", "name").sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single lead by ID
// @route   GET /api/leads/:id
// @access  Private (Secretary, Admin, CEO)
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedStaff", "name").populate("notes.author", "name");
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lead (status, assignment, follow-up)
// @route   PUT /api/leads/:id
// @access  Private (Secretary, Admin, CEO)
const updateLead = async (req, res, next) => {
  try {
    const { status, assignedStaff, followUpDate } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedStaff) updateData.assignedStaff = assignedStaff;
    if (followUpDate) updateData.followUpDate = followUpDate;
    if (status === "Contacted") updateData.lastContactDate = new Date();

    const lead = await Lead.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a note to a lead
// @route   POST /api/leads/:id/notes
// @access  Private (Secretary, Admin, CEO)
const addLeadNote = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Note text is required" });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const note = { text, author: req.user._id };
    lead.notes.push(note);
    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeads, getLeadById, updateLead, addLeadNote };