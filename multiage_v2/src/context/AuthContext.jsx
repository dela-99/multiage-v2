import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const STORAGE_KEY = "multiage_auth";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      setIsReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setToken(parsed.token || "");
      setUser(parsed.user || null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  const persistAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  };

  const login = async (credentials) => {
    const data = await api.login(credentials);
    const nextUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      adminRole: data.adminRole || data.role || "",
      firebaseId: data.firebaseId || "",
      profilePicture: data.profilePicture || "",
    };

    persistAuth(data.token, nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    const nextUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      adminRole: data.adminRole || data.role || "",
      firebaseId: data.firebaseId || "",
      profilePicture: data.profilePicture || "",
    };

    persistAuth(data.token, nextUser);
    return nextUser;
  };

  const loginWithGoogle = async (payload) => {
    const data = await api.googleLogin(payload);
    const nextUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      adminRole: data.adminRole || data.role || "",
      firebaseId: data.firebaseId || "",
      profilePicture: data.profilePicture || "",
    };

    persistAuth(data.token, nextUser);
    return nextUser;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("multiage_last_order");
  };

  const refreshProfile = async () => {
    if (!token) {
      return null;
    }

    const profile = await api.me(token);
    persistAuth(token, profile);
    return profile;
  };

  const value = useMemo(() => ({
    token,
    user,
    role: user?.role || "",
    adminRole: user?.adminRole || user?.role || "",
    isAuthenticated: Boolean(token),
    isReady,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshProfile,
  }), [token, user, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
