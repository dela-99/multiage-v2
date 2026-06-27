import RoleDashboardLayout from "../../components/admin/RoleDashboardLayout";

export default function AdministratorDashboard({ role, token, user }) {
  const sections = {
    Dashboard: <div>Administrator Dashboard Content</div>,
    Users: <div>Manage Users Section</div>,
    Staff: <div>Manage Staff Section</div>,
    Projects: <div>Manage Projects Section</div>,
    Announcements: <div>Manage Announcements Section</div>,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Administrator Dashboard"
      subtitle={`Welcome, ${user?.name}. Manage company operations, users, and staff.`}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}