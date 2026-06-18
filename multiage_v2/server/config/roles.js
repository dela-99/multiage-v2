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
    "messages:read",
    "messages:manage",
    "leads:read",
    "projects:read",
  ],
  secretary: [
    "dashboard:read",
    "messages:read",
    "messages:manage",
    "leads:read",
    "leads:manage",
  ],
  finance: [
    "finance:read",
    "finance:write",
    "leads:read",
    "reports:read",
  ],
  graphics: [
    "media:read",
    "media:write",
    "design:read",
    "design:write",
    "projects:read",
  ],
};

module.exports = roles;
