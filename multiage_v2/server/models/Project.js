const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  requestedService: { type: String, required: true, trim: true },
  assignedDepartment: { type: String, required: true, trim: true },
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  budget: { type: Number, default: 0 },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["New", "Proposal Sent", "Approved", "In Progress", "Review", "Completed", "Cancelled"],
    default: "New",
  },
  startDate: { type: Date },
  dueDate: { type: Date },
  progressPercentage: { type: Number, min: 0, max: 100, default: 0 },
  notes: [{
    text: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
  }],
  attachments: [{
    fileName: String,
    filePath: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadDate: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);