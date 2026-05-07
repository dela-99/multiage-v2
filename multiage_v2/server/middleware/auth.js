const jwt  = require("jsonwebtoken");
const User = require("../models/User");
const rolesConfig = require("../config/roles");

const ADMIN_ROLES = [
  "ADMIN",
  "CEO",
  "CYBER_IT",
  "FINANCE",
  "ADMINISTRATOR",
  "SECRETARY",
  "GRAPHICS"
];

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
  const effectiveRole = String(req.user?.adminRole || req.user?.role || "").trim().toUpperCase();
  const allowed = [...ADMIN_ROLES, "ADMIN"];

  if (process.env.NODE_ENV !== "production") {
    console.log(`[Auth Check] Email: ${req.user?.email}, EffectiveRole: ${effectiveRole}`);
  }

  if (req.user && (req.user.isAdmin || allowed.includes(effectiveRole))) {
    return next();
  }
  return res.status(403).json({ message: "Access denied — admins only" });
};

const emailReplyRolesOnly = (req, res, next) => {
  const allowedRoles = new Set(["CEO", "CYBER_IT", "FINANCE", "ADMINISTRATOR", "SECRETARY", "GRAPHICS", "ADMIN"]);
  const effectiveRole = String(req.user?.adminRole || req.user?.role || "").trim().toUpperCase();

  if (req.user && allowedRoles.has(effectiveRole)) {
    return next();
  }

  return res.status(403).json({ message: "Access denied — insufficient role for email replies" });
};

module.exports = { protect, adminOnly, emailReplyRolesOnly };
