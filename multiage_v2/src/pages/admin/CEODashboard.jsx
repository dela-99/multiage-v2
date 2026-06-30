import { useMemo } from "react";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import {
  LeadsSection,
  MetricOverview,
  ProjectsSection,
  ReportsSection,
  SimpleInfoSection,
} from "../../components/admin/roleSections";
import { useApi } from "../../hooks/useApi";

// Helper to format currency
const formatCurrency = (value) => `GHS ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function CEODashboard({ role, token, user }) {
  const { data: metrics, loading, error } = useApi(token, "/api/users/dashboard/metrics");

  const netProfit = (metrics?.monthlyRevenue ?? 0) - (metrics?.monthlyExpenses ?? 0);

  const cards = useMemo(() => {
    return [
      // Finance
      { label: "Monthly Revenue", value: formatCurrency(metrics?.monthlyRevenue ?? 0), icon: <StatIcon type="income" /> },
      { label: "Monthly Expenses", value: formatCurrency(metrics?.monthlyExpenses ?? 0), icon: <StatIcon type="expenses" /> },
      { label: "Net Profit", value: formatCurrency(netProfit), icon: <StatIcon type="balance" /> },
      { label: "Outstanding Payments", value: formatCurrency(metrics?.outstandingPayments ?? 0), icon: <StatIcon type="revenue" /> },
      // Projects
      { label: "Active Projects", value: String(metrics?.activeProjects ?? 0), icon: <StatIcon type="orders" /> },
      { label: "Completed Projects", value: String(metrics?.completedProjects ?? 0), icon: <StatIcon type="check" /> },
      { label: "Pending Projects", value: String(metrics?.pendingProjects ?? 0), icon: <StatIcon type="media" /> },
      // Leads & Staff
      { label: "New Leads", value: String(metrics?.newClientRequests ?? 0), subtitle: "Last 30 days", icon: <StatIcon type="users" /> },
      { label: "Total Staff", value: String(metrics?.totalStaff ?? 0), icon: <StatIcon type="shield" /> },
      { label: "Active Staff", value: String(metrics?.activeStaff ?? 0), icon: <StatIcon type="shield" /> },
    ];
  }, [metrics, netProfit]);

  const sections = {
    Dashboard: (
      <MetricOverview
        cards={cards}
        // Placeholder for charts and recent activity
        analytics={{ hasChartData: !!(metrics && Object.keys(metrics).length > 0) }}
        messages={metrics?.activityTimeline ?? []} // To be replaced with Activity Timeline
      />
    ),
    Leads: <LeadsSection messages={[]} />,
    Projects: <ProjectsSection messages={[]} />,
    Reports: <ReportsSection messages={[]} rangeDays={30} />,
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
