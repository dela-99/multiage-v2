import { useEffect } from "react";
import { useNavigate } from "../router";
import { useAuth } from "../context/AuthContext";

const ADMIN_ROLES = new Set(["ADMIN", "CEO", "ADMINISTRATOR", "CYBER_IT", "FINANCE", "SECRETARY", "GRAPHICS"]);

export default function ProtectedRoute({ children, adminOnly = false }) {
  const navigate = useNavigate();
  const { isReady, isAuthenticated, role } = useAuth();
  const isAdminRole = ADMIN_ROLES.has(String(role || "").trim().toUpperCase());

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      navigate(adminOnly ? "/admin/login" : "/login");
      return;
    }

    if (adminOnly && !isAdminRole) {
      navigate("/");
    }
  }, [adminOnly, isAdminRole, isAuthenticated, isReady, navigate, role]);

  if (!isReady || !isAuthenticated || (adminOnly && !isAdminRole)) {
    return null;
  }

  return children;
}
