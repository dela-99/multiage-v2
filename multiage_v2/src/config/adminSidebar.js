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
    key: "Products",
    label: "Products",
    path: "/admin/products",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.ADMINISTRATOR],
  },
  {
    key: "Inventory",
    label: "Inventory",
    path: "/admin/inventory",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.ADMINISTRATOR, ROLES.FINANCE],
  },
  {
    key: "Orders",
    label: "Orders",
    path: "/admin/orders",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.ADMINISTRATOR, ROLES.FINANCE, ROLES.SECRETARY],
  },
  {
    key: "Sales",
    label: "Sales",
    path: "/admin/sales",
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
    key: "Communications",
    label: "Communications",
    path: "/admin/communications",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.SECRETARY],
  },
  {
    key: "Settings",
    label: "Settings",
    path: "/admin/settings",
    roles: [ROLES.CEO, ROLES.CYBER_IT, ROLES.ADMINISTRATOR, ROLES.SECRETARY],
  },
];

export const normalizeAdminRole = (role) => {
  const rawRole = String(role || "").trim();
  if (!rawRole) {
    return "";
  }

  return ROLE_ALIASES[rawRole.toLowerCase()] || rawRole.toUpperCase();
};

export const getSidebarItems = (role) => {
  const normalizedRole = normalizeAdminRole(role);
  return SIDEBAR_ITEMS.filter((item) => item.roles.includes(normalizedRole));
};
