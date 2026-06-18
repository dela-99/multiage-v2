export const ROLES = {
  CEO: "CEO",
  CYBER_IT: "CYBER_IT",
  FINANCE: "FINANCE",
  ADMINISTRATOR: "ADMINISTRATOR",
  SECRETARY: "SECRETARY",
  GRAPHICS: "GRAPHICS/MEDIA",
};

const ROLE_ALIASES = {
  admin: ROLES.ADMINISTRATOR,
  administrator: ROLES.ADMINISTRATOR,
  ceo: ROLES.CEO,
  cyber_it: ROLES.CYBER_IT,
  finance: ROLES.FINANCE,
  secretary: ROLES.SECRETARY,
  "graphics/media": ROLES.GRAPHICS,
  graphics: ROLES.GRAPHICS,
};

export const SIDEBAR_ITEMS = [
  {
    key: "Dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.FINANCE, ROLES.ADMINISTRATOR, ROLES.SECRETARY, ROLES.GRAPHICS],
  },
  {
    key: "Leads",
    label: "Leads",
    path: "/admin/leads",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.FINANCE, ROLES.ADMINISTRATOR, ROLES.SECRETARY],
  },
  {
    key: "Projects",
    label: "Projects",
    path: "/admin/projects",
    roles: [ROLES.CEO, ROLES.ADMINISTRATOR, ROLES.GRAPHICS],
  },
  {
    key: "Communications",
    label: "Communications",
    path: "/admin/messages",
    roles: [ROLES.ADMINISTRATOR, ROLES.SECRETARY],
  },
  {
    key: "Reports",
    label: "Reports",
    path: "/admin/reports",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.FINANCE],
  },
  {
    key: "Users",
    label: "Users",
    path: "/admin/users",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.ADMINISTRATOR],
  },
  {
    key: "Media / Content",
    label: "Media / Content",
    path: "/admin/media",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.GRAPHICS],
  },
  {
    key: "Settings",
    label: "Settings",
    path: "/admin/settings",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.ADMINISTRATOR, ROLES.SECRETARY],
  },
];

export const normalizeAdminRole = (role) => {
  const rawRole = String(role || "").trim().toUpperCase();
  if (!rawRole) {
    return "";
  }

  return ROLE_ALIASES[rawRole.toLowerCase()] || rawRole;
};

export const getSidebarItems = (role) => {
  const normalizedRole = normalizeAdminRole(role);
  return SIDEBAR_ITEMS.filter((item) => item.roles.includes(normalizedRole));
};
