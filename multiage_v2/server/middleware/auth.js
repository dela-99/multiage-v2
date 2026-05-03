const jwt  = require("jsonwebtoken");
const User = require("../models/User");
const rolesConfig = require("../config/roles");

const ADMIN_ROLES = new Set(["admin", "ceo", "cyber_it", "administrator"]);

// ── Protect: any logged-in user ───────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorised — no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Not authorised — invalid token" });
  }
};

// ── Admin only ─────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user && ADMIN_ROLES.has(String(req.user.role || "").toLowerCase())) {
    return next();
  }
  return res.status(403).json({ message: "Access denied — admins only" });
};

const emailReplyRolesOnly = (req, res, next) => {
  const allowedRoles = new Set(["ceo", "administrator", "cyber_it"]);

  if (req.user && allowedRoles.has(req.user.role)) {
    return next();
  }

  return res.status(403).json({ message: "Access denied — insufficient role for email replies" });
};

module.exports = { protect, adminOnly, emailReplyRolesOnly };
