import { useMemo } from "react";
import RoleDashboardLayout from "../../components/admin/RoleDashboardLayout";
import { MetricOverview, ProjectsSection, SimpleInfoSection } from "../../components/admin/roleSections"; // Assuming these are created
import { useApi } from "../../hooks/useApi";
import { StatIcon } from "../../components/admin/RoleDashboardLayout";
import StaffManagementSection from "../../components/admin/StaffManagementSection"; // New component

export default function AdministratorDashboard({ role, token, user }) {
  const { data: metrics, loading: metricsLoading, error: metricsError } = useApi(token, "/api/users/dashboard/metrics");
  const { data: users, loading: usersLoading, error: usersError } = useApi(token, "/api/users");

  const cards = useMemo(() => {
    if (!metrics || !users) return [];
    return [
      { label: "Total Staff", value: String(metrics.totalStaff || 0), icon: <StatIcon type="users" /> },
      { label: "Active Staff", value: String(metrics.activeStaff || 0), icon: <StatIcon type="check" /> },
      { label: "Registered Clients", value: String(users.filter(u => u.userType === 'Client').length), icon: <StatIcon type="shield" /> },
      { label: "Assigned Projects", value: String(metrics.activeProjects + metrics.pendingProjects), icon: <StatIcon type="orders" /> },
    ];
  }, [metrics, users]);

  const sections = {
    Dashboard: <MetricOverview cards={cards} analytics={{ hasChartData: !!metrics }} messages={[]} />,
    Staff: <StaffManagementSection token={token} />, // This component will use its own useApi hook
    Projects: <ProjectsSection messages={[]} />, // Placeholder
    Users: <SimpleInfoSection title="All Users" description="View all registered users, including clients and staff." />,
    Announcements: <SimpleInfoSection title="Announcements" description="Publish and manage company-wide or department-specific announcements." />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Administrator Dashboard"
      subtitle={`Welcome, ${user?.name}. Manage company operations, users, and staff.`}
      loading={metricsLoading || usersLoading}
      error={metricsError || usersError}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}