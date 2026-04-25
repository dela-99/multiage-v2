const AuditLog = require("../models/AuditLog");

/**
 * Middleware to log successful authorized actions.
 * Usage: router.get('/path', protect, authorise('perm'), auditSuccess('perm'), controller)
 */
const auditLogger = (action) => {
  return async (req, res, next) => {
    try {
      // Log the intent/access as SUCCESS because it passed the 'authorise' middleware
      await AuditLog.create({
        userId: req.user?._id,
        userName: req.user?.name || "Unknown",
        userRole: req.user?.role || "GUEST",
        action: action || req.originalUrl,
        resource: req.originalUrl,
        status: "SUCCESS",
        ip: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      });
      next();
    } catch (error) {
      // We don't call next(error) here to ensure the primary request 
      // isn't blocked by a logging failure, but we log it to console.
      console.error("Audit Logging Error:", error.message);
      next();
    }
  };
};

module.exports = auditLogger;