import { useEffect } from "react";
import { useNavigate } from "../router";
import { useAuth } from "../context/AuthContext";

const ADMIN_ROLES = new Set(["admin", "ceo", "administrator", "cyber_it", "finance", "secretary", "graphics", "media"]);

export default function ProtectedRoute({ children, adminOnly = false }) {
  const navigate = useNavigate();
  const { isReady, isAuthenticated, role } = useAuth();
  const isAdminRole = ADMIN_ROLES.has(String(role || "").toLowerCase());

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
