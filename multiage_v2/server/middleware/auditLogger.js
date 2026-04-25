const AuditLog = require("../models/AuditLog");

/**
 * Middleware to log successful authorized actions.
 * Usage: router.get('/path', protect, authorise('perm'), auditLogger('perm'), controller)
 */
const auditLogger = (action) => {
  return (req, res, next) => {
    res.on("finish", () => {
      AuditLog.create({
        userId: req.user?._id,
        userName: req.user?.name || "Unknown",
        userRole: req.user?.role || "GUEST",
        action: action || req.originalUrl,
        resource: req.originalUrl,
        status: res.statusCode < 400 ? "SUCCESS" : "FAILURE",
        ip: AuditLog.anonymizeIp(req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress),
      }).catch((error) => {
        console.error("Audit Logging Error:", error.message);
      });
    });

    next();
  };
};

module.exports = auditLogger;