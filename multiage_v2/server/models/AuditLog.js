const mongoose = require("mongoose");

const retentionDays = Math.max(Number(process.env.AUDIT_LOG_RETENTION_DAYS) || 30, 1);
const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

const anonymizeIp = (ip) => {
  const value = String(ip || "").trim();

  if (!value) {
    return "";
  }

  if (value.includes(".")) {
    const parts = value.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  if (value.includes(":")) {
    const parts = value.split(":").filter(Boolean);
    return `${parts.slice(0, 4).join(":") || ""}::`;
  }

  return value;
};

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  userName: { type: String, default: "Anonymous" },
  userRole: { type: String, default: "GUEST" },
  action: { type: String, required: true }, // The permission string or action name
  resource: { type: String, required: true }, // Endpoint or URL
  status: { type: String, enum: ["SUCCESS", "FAILURE", "DENIED"], required: true },
  ip: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + retentionMs) },
  metadata: { type: Object } // Optional extra data
});

// Optimization: Index by timestamp and userId for faster dashboard lookups
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

auditLogSchema.pre("save", function (next) {
  if (this.ip) {
    this.ip = anonymizeIp(this.ip);
  }

  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + retentionMs);
  }

  next();
});

auditLogSchema.set("toJSON", {
  transform(_doc, ret) {
    if (ret.ip) {
      ret.ip = anonymizeIp(ret.ip);
    }
    return ret;
  },
});

auditLogSchema.set("toObject", {
  transform(_doc, ret) {
    if (ret.ip) {
      ret.ip = anonymizeIp(ret.ip);
    }
    return ret;
  },
});

auditLogSchema.statics.anonymizeIp = anonymizeIp;

module.exports = mongoose.model("AuditLog", auditLogSchema);