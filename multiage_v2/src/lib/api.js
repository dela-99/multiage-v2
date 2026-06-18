function resolveApiBaseUrl() {
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");

  if (fromEnv) {
    return fromEnv;
  }

  if (import.meta.env.DEV) {
    return "";
  }

  throw new Error("VITE_API_BASE_URL is required for production builds.");
}

const API_BASE_URL = resolveApiBaseUrl();

export const apiBaseUrl = API_BASE_URL;

async function apiRequest(path, { method = "GET", body, token } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    const error = new Error("Network error. Please check your connection and try again.");
    error.status = 0;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message ||
      (response.status === 401
        ? "You need to log in to continue."
        : response.status === 403
          ? "You do not have permission to perform this action."
          : "Request failed")
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  register: (body) => apiRequest("/auth/register", { method: "POST", body }),
  login: (body) => apiRequest("/auth/login", { method: "POST", body }),
  googleLogin: (body) => apiRequest("/auth/google", { method: "POST", body }),
  forgotPassword: (body) => apiRequest("/auth/forgot-password", { method: "POST", body }),
  resetPassword: (body) => apiRequest("/auth/reset-password", { method: "POST", body }),
  me: (token) => apiRequest("/auth/me", { token }),
  changePassword: (body, token) =>
    apiRequest("/auth/password", { method: "PUT", body, token }),
  sendMessage: (body) => apiRequest("/messages", { method: "POST", body }),
  getMessages: (token) => apiRequest("/messages", { token }),
  getMessage: (id, token) => apiRequest(`/messages/${id}`, { token }),
  updateMessageStatus: (id, body, token) => apiRequest(`/messages/${id}/status`, { method: "PATCH", body, token }),
  getUsers: (token) => apiRequest("/auth/users", { token }),
};

