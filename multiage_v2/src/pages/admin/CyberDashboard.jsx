import { useMemo, useState } from "react";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import {
  LeadsSection,
  MetricOverview,
  ReportsSection,
  SettingsSection,
  SimpleInfoSection,
} from "../../components/admin/roleSections";
import { comparePeriods, computeServiceMetrics, filterByRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";

export default function CyberDashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const { messages, loading, error } = useAdminResources(token, { messages: true });
  const scopedMessages = useMemo(() => filterByRange(messages, rangeDays), [messages, rangeDays]);
  const metrics = useMemo(() => computeServiceMetrics(messages, rangeDays), [messages, rangeDays]);

  const cards = [
    { label: "Security Events", value: String(scopedMessages.length), subtitle: `Last ${rangeDays} days`, change: comparePeriods(messages, () => 1, rangeDays), icon: <StatIcon type="shield" /> },
    { label: "Access Logs", value: String(metrics.closedRequests), subtitle: "Reviewed records", change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), rangeDays), icon: <StatIcon type="orders" /> },
    { label: "User Sessions", value: String(metrics.openRequests), subtitle: "Active follow-ups", change: comparePeriods(messages, (message) => (message.status === "unread" ? 1 : 0), rangeDays), icon: <StatIcon type="media" /> },
    { label: "Security Status", value: "Operational", subtitle: "Systems monitoring", change: 0, icon: <StatIcon type="income" /> },
  ];

  const sections = {
    Dashboard: <MetricOverview cards={cards} messages={scopedMessages} />,
    Leads: <LeadsSection messages={messages} title="Access Requests" description="Inbound service and support requests requiring systems review." />,
    Reports: <ReportsSection messages={scopedMessages} rangeDays={rangeDays} title="System Reports" description="Operational activity summary for technology oversight." />,
    Users: <SimpleInfoSection title="Users" description="System access oversight." body="Use this space for role-aware access reviews, account readiness, and future identity tooling. Backend authorisation still remains the final authority." />,
    "Media / Content": <SimpleInfoSection title="Media / Content" description="Technical support for content systems." body="This dashboard can support media pipelines, upload integrations, and publishing workflows without exposing broader commercial data." iconType="media" />,
    Settings: <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Cyber IT Dashboard"
      subtitle={`Welcome back, ${user?.name || "Cyber IT"}. This workspace focuses on operational visibility, systems support, and controlled access.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
