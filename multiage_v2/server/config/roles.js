/**
 * Role-Based Access Control (RBAC) Configuration
 * Maps Roles to specific Permissions.
 */
const roles = {
  ceo: ["*"], // Wildcard: Full Access
  cyber_it: ["*"], // Wildcard: Full System Access
  administrator: [
    "users:manage",
    "dashboard:read",
    "orders:manage"
  ],
  finance: [
    "finance:read",
    "finance:write",
    "orders:read"
  ],
  media: [
    "media:read",
    "media:write"
  ],
  graphics: [
    "design:read",
    "design:write"
  ],
};

module.exports = roles;