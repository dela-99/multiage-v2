const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  userName: { type: String, default: "Anonymous" },
  userRole: { type: String, default: "GUEST" },
  action: { type: String, required: true }, // The permission string or action name
  resource: { type: String, required: true }, // Endpoint or URL
  status: { type: String, enum: ["SUCCESS", "DENIED"], required: true },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object } // Optional extra data
});

// Optimization: Index by timestamp and userId for faster dashboard lookups
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);