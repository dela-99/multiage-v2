import { useEffect } from "react";
import { useNavigate } from "../router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const navigate = useNavigate();
  const { isReady, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated) {
      navigate(adminOnly ? "/admin-login" : "/login");
      return;
    }

    if (adminOnly && role !== "admin") {
      navigate("/");
    }
  }, [adminOnly, isAuthenticated, isReady, navigate, role]);

  if (!isReady || !isAuthenticated || (adminOnly && role !== "admin")) {
    return null;
  }

  return children;
}
