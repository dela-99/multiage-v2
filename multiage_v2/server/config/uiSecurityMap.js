/**
 * UI Security Map
 * Maps Frontend UI elements/pages to Backend Permission strings.
 * Used for UI visibility logic only.
 */
const uiSecurityMap = {
  Dashboard: "dashboard:read",
  FinanceDashboard: "finance:read",
  TransactionsPage: "finance:read",
  ExpensesPage: "finance:write",
  MediaPanel: "media:read",
  UploadContent: "media:write",
  DesignStudio: "design:write",
  UserManagement: "users:manage",
  SystemLogs: "security:read",
  OrdersPage: "orders:manage",
};

module.exports = uiSecurityMap;