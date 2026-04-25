/**
 * Role-Based Access Control (RBAC) Configuration
 * Maps Roles to specific Permissions.
 */
const roles = {
  CEO: ["*"], // Wildcard: Full Access
  CYBER_IT: ["*"], // Wildcard: Full System Access
  ADMINISTRATOR: [
    "users:manage",
    "dashboard:read",
    "orders:manage"
  ],
  FINANCE: [
    "finance:read",
    "finance:write",
    "orders:read"
  ],
  MEDIA: [
    "media:read",
    "media:write"
  ],
  GRAPHICS: [
    "design:read",
    "design:write"
  ],
};

module.exports = roles;