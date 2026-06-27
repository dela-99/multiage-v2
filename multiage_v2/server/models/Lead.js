const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  clientName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  requestedService: { type: String, required: true },
  message: { type: String, required: true },
  source: { type: String, default: "Website" },
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["Pending", "Contacted", "Proposal Sent", "In Progress", "Completed", "Closed"],
    default: "Pending",
    index: true,
  },
  lastContactDate: { type: Date },
  followUpDate: { type: Date },
  notes: [{
    text: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
  }],
  // Link back to the original message if it exists
  originalMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });

leadSchema.index({ email: 1 });
leadSchema.index({ assignedStaff: 1 });

module.exports = mongoose.model("Lead", leadSchema);