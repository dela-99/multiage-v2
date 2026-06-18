import { useMemo, useState } from "react";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import { LeadsSection, MessagesSection, MetricOverview, SettingsSection } from "../../components/admin/roleSections";
import { comparePeriods, computeServiceMetrics, filterByRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";
import { getSidebarItems } from "../../config/adminSidebar";

export default function SecretaryDashboard({ role, token, user }) {
  const [rangeDays] = useState(30);
  const { messages, loading, error } = useAdminResources(token, { messages: true });
  const scopedMessages = useMemo(() => filterByRange(messages, rangeDays), [messages, rangeDays]);
  const metrics = useMemo(() => computeServiceMetrics(messages, rangeDays), [messages, rangeDays]);
  const unreadCount = useMemo(() => (messages || []).filter((message) => message.status === "unread").length, [messages]);
  const sidebarItems = useMemo(() => {
    return getSidebarItems(role).map((item) => (
      item.key === "Communications" ? { ...item, unreadCount } : item
    ));
  }, [role, unreadCount]);

  const cards = [
    { label: "New Inquiries", value: String(scopedMessages.length), subtitle: `Last ${rangeDays} days`, change: comparePeriods(messages, () => 1, rangeDays), icon: <StatIcon type="orders" /> },
    { label: "Pending Leads", value: String(metrics.pendingLeads), subtitle: "Awaiting contact", change: comparePeriods(messages, (message) => (message.status === "unread" ? 1 : 0), rangeDays), icon: <StatIcon type="expenses" /> },
    { label: "Contacted Leads", value: String(metrics.contactedLeads), subtitle: "In progress", change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), rangeDays), icon: <StatIcon type="income" /> },
    { label: "Follow Ups", value: String(metrics.followUps), subtitle: "Needs attention", change: comparePeriods(messages, (message) => (message.status === "unread" ? 1 : 0), rangeDays), icon: <StatIcon type="media" /> },
  ];

  const sections = {
    Dashboard: <MetricOverview cards={cards} messages={scopedMessages} />,
    Leads: <LeadsSection messages={messages} />,
    Communications: <MessagesSection messages={messages} token={token} loading={loading} title="Communications" description="Customer contacts, inquiries, and message follow-ups." />,
    Settings: <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Secretary Dashboard"
      subtitle={`Welcome back, ${user?.name || "Secretary"}. This workspace centers on communications, coordination, and customer-facing follow-up.`}
      loading={loading}
      error={error}
      sections={sections}
      sidebarItems={sidebarItems}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
