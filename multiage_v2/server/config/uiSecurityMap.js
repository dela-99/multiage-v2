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
  LeadsPage: "leads:read",
  ProjectsPage: "projects:read",
  ReportsPage: "reports:read",
  CommunicationsPage: "messages:read",
};

module.exports = uiSecurityMap;
