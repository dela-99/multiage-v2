const rawApiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_BASE = rawApiBase.replace(/\/+$/, "");

async function apiRequest(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  login: (body) => apiRequest("/auth/login", { method: "POST", body }),
  me: (token) => apiRequest("/auth/me", { token }),
  sendMessage: (body) => apiRequest("/messages", { method: "POST", body }),
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    return apiRequest(`/products${query ? `?${query}` : ""}`);
  },
  createOrder: (body, token) => apiRequest("/orders", { method: "POST", body, token }),
  getOrders: (token) => apiRequest("/orders", { token }),
  getMyOrders: (token) => apiRequest("/orders/my", { token }),
  getMessages: (token) => apiRequest("/messages", { token }),
  createProduct: (body, token) => apiRequest("/products", { method: "POST", body, token }),
};

export { API_BASE };
