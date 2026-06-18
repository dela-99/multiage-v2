import { useMemo, useState } from "react";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import {
  LeadsSection,
  MessagesSection,
  MetricOverview,
  ProjectsSection,
  SettingsSection,
  SimpleInfoSection,
} from "../../components/admin/roleSections";
import { comparePeriods, computeServiceMetrics, countActiveStaff, filterByRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";
import { getSidebarItems } from "../../config/adminSidebar";

export default function AdministratorDashboard({ role, token, user }) {
  const [rangeDays] = useState(30);
  const { messages, users, loading, error } = useAdminResources(token, { messages: true, users: true });
  const scopedMessages = useMemo(() => filterByRange(messages, rangeDays), [messages, rangeDays]);
  const metrics = useMemo(() => computeServiceMetrics(messages, rangeDays), [messages, rangeDays]);
  const unreadCount = useMemo(() => (messages || []).filter((message) => message.status === "unread").length, [messages]);
  const sidebarItems = useMemo(() => {
    return getSidebarItems(role).map((item) => (
      item.key === "Communications" ? { ...item, unreadCount } : item
    ));
  }, [role, unreadCount]);

  const cards = useMemo(() => [
    { label: "Total Users", value: String((users || []).length), subtitle: "Registered accounts", change: 0, icon: <StatIcon type="shield" /> },
    { label: "Active Staff", value: String(countActiveStaff(users)), subtitle: "Admin accounts", change: 0, icon: <StatIcon type="income" /> },
    { label: "Open Requests", value: String(metrics.openRequests), subtitle: "Pending inquiries", change: comparePeriods(messages, (message) => (message.status === "unread" ? 1 : 0), rangeDays), icon: <StatIcon type="orders" /> },
    { label: "Closed Requests", value: String(metrics.closedRequests), subtitle: "Contacted inquiries", change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), rangeDays), icon: <StatIcon type="balance" /> },
  ], [users, metrics, messages, rangeDays]);

  const sections = {
    Dashboard: <MetricOverview cards={cards} messages={scopedMessages} />,
    Leads: <LeadsSection messages={messages} />,
    Projects: <ProjectsSection messages={messages} />,
    Communications: <MessagesSection messages={messages} token={token} loading={loading} />,
    Users: <SimpleInfoSection title="Users" description="Administrative access visibility." body="This area is reserved for controlled user and role governance. Backend RBAC remains the source of truth even when the frontend workspace evolves." />,
    Settings: <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Administrator Dashboard"
      subtitle={`Welcome back, ${user?.name || "Administrator"}. Your workspace is tailored to service operations, communications, and user oversight.`}
      loading={loading}
      error={error}
      sections={sections}
      sidebarItems={sidebarItems}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
