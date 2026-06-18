import { useMemo, useState } from "react";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import { LeadsSection, MetricOverview, ReportsSection, SimpleInfoSection } from "../../components/admin/roleSections";
import { comparePeriods, computeServiceMetrics, filterByRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";

export default function FinanceDashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const { messages, loading, error } = useAdminResources(token, { messages: true });
  const scopedMessages = useMemo(() => filterByRange(messages, rangeDays), [messages, rangeDays]);
  const metrics = useMemo(() => computeServiceMetrics(messages, rangeDays), [messages, rangeDays]);
  const unreadInRange = scopedMessages.filter((message) => message.status === "unread").length;
  const readInRange = scopedMessages.filter((message) => message.status === "read").length;

  const cards = [
    { label: "Service Transactions", value: String(metrics.serviceTransactions), subtitle: `Last ${rangeDays} days`, change: comparePeriods(messages, () => 1, rangeDays), icon: <StatIcon type="orders" /> },
    { label: "Monthly Income", value: String(metrics.monthlyIncome), subtitle: "Completed engagements", change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), rangeDays), icon: <StatIcon type="income" /> },
    { label: "Outstanding Payments", value: String(metrics.outstandingPayments), subtitle: "Pending follow-ups", change: comparePeriods(messages, (message) => (message.status === "unread" ? 1 : 0), rangeDays), icon: <StatIcon type="expenses" /> },
    { label: "Revenue Pipeline", value: String(readInRange), subtitle: `Last ${rangeDays} days`, change: comparePeriods(messages, (message) => (message.status === "read" ? 1 : 0), rangeDays), icon: <StatIcon type="revenue" /> },
  ];

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
        messages={scopedMessages}
        analytics={analyticsProps}
      />
    ),
    Leads: <LeadsSection messages={messages} title="Billing Leads" description="Service inquiries that may require invoicing or payment follow-up." />,
    Reports: <ReportsSection messages={scopedMessages} rangeDays={rangeDays} title="Financial Reports" description="Service transaction and engagement summary for finance review." />,
    Settings: <SimpleInfoSection title="Settings" description="Finance workspace settings." body="This dashboard keeps the finance view focused on service transactions, reconciliation visibility, and trend monitoring. Sensitive identity and content tools stay outside this role." />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Finance Dashboard"
      subtitle={`Welcome back, ${user?.name || "Finance"}. This workspace is focused on service revenue, transactions, and payment follow-up visibility.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
