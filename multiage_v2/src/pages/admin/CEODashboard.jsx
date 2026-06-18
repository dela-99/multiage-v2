import { useMemo, useState } from "react";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import {
  LeadsSection,
  MetricOverview,
  ProjectsSection,
  ReportsSection,
  SettingsSection,
  SimpleInfoSection,
} from "../../components/admin/roleSections";
import { comparePeriods, computeServiceMetrics, filterByRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";

export default function CEODashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const { messages, loading, error } = useAdminResources(token, { messages: true });
  const scopedMessages = useMemo(() => filterByRange(messages, rangeDays), [messages, rangeDays]);
  const metrics = useMemo(() => computeServiceMetrics(messages, rangeDays), [messages, rangeDays]);
  const unreadInRange = scopedMessages.filter((message) => message.status === "unread").length;
  const readInRange = scopedMessages.filter((message) => message.status === "read").length;

  const cards = [
    { label: "Total Service Requests", value: String(metrics.totalServiceRequests), subtitle: `Last ${rangeDays} days`, change: comparePeriods(messages, () => 1, rangeDays), icon: <StatIcon type="orders" /> },
    { label: "Active Projects", value: String(metrics.activeProjects), subtitle: "Contacted engagements", change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), rangeDays), icon: <StatIcon type="income" /> },
    { label: "Completed Projects", value: String(metrics.completedProjects), subtitle: "Closed engagements", change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), rangeDays), icon: <StatIcon type="balance" /> },
    { label: "New Leads", value: String(metrics.newLeads), subtitle: "Pending follow-up", change: comparePeriods(messages, (message) => (message.status === "unread" ? 1 : 0), rangeDays), icon: <StatIcon type="revenue" /> },
  ];

  const sections = {
    Dashboard: (
      <MetricOverview
        cards={cards}
        messages={scopedMessages}
        analytics={{
          rangeDays,
          onRangeChange: setRangeDays,
          income: scopedMessages.length,
          expenses: unreadInRange,
          balance: readInRange,
          changes: {
            income: comparePeriods(messages, () => 1, rangeDays),
            expenses: comparePeriods(messages, (message) => (message.status === "unread" ? 1 : 0), rangeDays),
            balance: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), rangeDays),
          },
          hasChartData: scopedMessages.length > 0,
        }}
      />
    ),
    Leads: <LeadsSection messages={messages} />,
    Projects: <ProjectsSection messages={messages} />,
    Reports: <ReportsSection messages={scopedMessages} rangeDays={rangeDays} />,
    Users: <SimpleInfoSection title="Users" description="Executive visibility only." body="User governance remains backend-protected. This CEO workspace is reserved for high-level user administration and audit decisions." />,
    "Media / Content": <SimpleInfoSection title="Media / Content" description="Brand and campaign oversight." body="Use this workspace to review content direction and approve media priorities. Dedicated publishing tools can plug in here without changing the dashboard switch logic." iconType="media" />,
    Settings: <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="CEO Dashboard"
      subtitle={`Welcome back, ${user?.name || "CEO"}. This executive workspace surfaces service pipeline performance, oversight, and strategic visibility.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
