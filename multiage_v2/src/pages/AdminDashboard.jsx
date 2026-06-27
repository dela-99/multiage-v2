import PageLayout from "../components/PageLayout";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { ROLES, normalizeAdminRole } from "../config/adminSidebar";
import CEODashboard from "./admin/CEODashboard";
import CyberITDashboard from "./admin/CyberDashboard";
import FinanceDashboard from "./admin/FinanceDashboard";
import AdministratorDashboard from "./admin/AdminDashboard";
import SecretaryDashboard from "./admin/SecretaryDashboard";
import GraphicsDashboard from "./admin/GraphicsDashboard";

function NotAuthorizedDashboard() {
  const { t } = useTheme();

  return (
    <PageLayout>
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "110px 24px 100px" }}>
        <div style={{
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: 28,
          padding: "42px 32px",
          textAlign: "center",
          backdropFilter: "blur(16px)",
        }}>
          <h1 style={{ margin: 0, fontSize: 34, color: t.textPrimary, fontWeight: 800, letterSpacing: -0.8 }}>
            Access restricted
          </h1>
          <p style={{ margin: "14px auto 0", maxWidth: 520, color: t.textSecondary, lineHeight: 1.7 }}>
            You are not authorised to view this dashboard.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const role = normalizeAdminRole(user?.adminRole || user?.role);
  const props = { role, token, user };

  switch (role) {
    case ROLES.CEO:
      return <CEODashboard {...props} />;
    case ROLES.CYBER_IT:
      return <CyberITDashboard {...props} />;
    case ROLES.FINANCE:
      return <FinanceDashboard {...props} />;
    case ROLES.ADMINISTRATOR:
      return <AdministratorDashboard {...props} />;
    case ROLES.SECRETARY:
      return <SecretaryDashboard {...props} />;
    case ROLES.GRAPHICS:
      return <GraphicsDashboard {...props} />;
    default:
      return <NotAuthorizedDashboard />;
  }
}
