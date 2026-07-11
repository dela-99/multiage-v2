import { useMemo, useState } from "react";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import {
  LeadsSection,
  MetricOverview,
  ProjectsSection,
  ReportsSection,
  SimpleInfoSection,
} from "../../components/admin/roleSections";
import { comparePeriods, computeServiceMetrics, countActiveStaff, filterByRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";

// Helper to format currency
const formatCurrency = (value) => `GHS ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CEODashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const { messages, users, loading, error } = useAdminResources(token, { messages: true, users: true });
  const scopedMessages = useMemo(() => filterByRange(messages, rangeDays), [messages, rangeDays]);
  const metrics = useMemo(() => computeServiceMetrics(messages, rangeDays), [messages, rangeDays]);
  const unreadInRange = scopedMessages.filter((message) => message.status === "unread").length;
  const readInRange = scopedMessages.filter((message) => message.status === "read").length;

  const cards = useMemo(() => {
    return [
      // Finance
      { label: "Monthly Revenue", value: formatCurrency(0), icon: <StatIcon type="income" /> },
      { label: "Monthly Expenses", value: formatCurrency(0), icon: <StatIcon type="expenses" /> },
      { label: "Net Profit", value: formatCurrency(0), icon: <StatIcon type="balance" /> },
      { label: "Outstanding Payments", value: formatCurrency(metrics.outstandingPayments), icon: <StatIcon type="revenue" /> },
      // Projects
      { label: "Active Projects", value: String(metrics.activeProjects || 0), icon: <StatIcon type="orders" /> },
      { label: "Completed Projects", value: String(metrics.completedProjects || 0), icon: <StatIcon type="check" /> },
      { label: "Pending Projects", value: String(metrics.openRequests || 0), icon: <StatIcon type="media" /> },
      // Leads & Staff
      { label: "New Leads", value: String(metrics.newLeads || 0), subtitle: "Last 30 days", icon: <StatIcon type="users" /> },
      { label: "Total Staff", value: String((users || []).filter((account) => account.isAdmin).length), icon: <StatIcon type="shield" /> },
      { label: "Active Staff", value: String(countActiveStaff(users)), icon: <StatIcon type="shield" /> },
    ];
  }, [metrics, users]);

  const analyticsProps = {
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
  };

  const sections = {
    Dashboard: (
      <MetricOverview
        cards={cards}
        analytics={analyticsProps}
        messages={scopedMessages}
      />
    ),
    Leads: <LeadsSection messages={messages} />,
    Projects: <ProjectsSection messages={messages} />,
    Reports: <ReportsSection messages={scopedMessages} rangeDays={rangeDays} />,
    Staff: <SimpleInfoSection title="Staff Management" description="Manage all staff records, roles, and departments." />,
    Finance: <SimpleInfoSection title="Finance Overview" description="Access all financial transactions, reports, and summaries." />,
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
