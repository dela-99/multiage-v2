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
  secretary: [
    "dashboard:read",
    "orders:read",
    "orders:manage"
  ],
  finance: [
    "finance:read",
    "finance:write",
    "orders:read"
  ],
  graphics: [
    "media:read",
    "media:write",
    "design:read",
    "design:write"
  ],
};

module.exports = roles;