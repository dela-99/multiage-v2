const roles = require("../config/roles");
const AuditLog = require("../models/AuditLog");

/**
 * Authorization middleware to enforce RBAC.
 * @param {string} permission - The required permission string (e.g., 'finance:read').
 * @returns {Function} Express middleware.
 */
const authorise = (permission) => {
  return (req, res, next) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    const clientIp = req.ip || (typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : undefined);

    // Note: 'protect' middleware must run before this to populate req.user
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: "Access Denied: User identity or role not identified"
      });
    }

    // Check adminRole first, fallback to role
    const effectiveRole = (req.user.adminRole || req.user.role || "").toLowerCase();
    const userPermissions = roles[effectiveRole] || [];

    // 1. Check for Wildcard access (CEO / CYBER_IT)
    if (userPermissions.includes("*")) {
      return next();
    }

    // 2. Check for specific permission match
    if (userPermissions.includes(permission)) {
      return next();
    }

    // Log Denied Attempt
    AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: permission,
      resource: req.originalUrl,
      status: "DENIED",
      ip: AuditLog.anonymizeIp(clientIp),
    }).catch(err => console.error("Denial Logging Failed:", err.message));

    // 3. Default Deny: If no permission found, reject request
    return res.status(403).json({
      message: `Forbidden: Your account does not have the '${permission}' permission required for this resource`
    });
  };
};

module.exports = authorise;