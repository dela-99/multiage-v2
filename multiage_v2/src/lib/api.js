function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  throw new Error(
    "VITE_API_BASE_URL must be set when building for production (your API origin, e.g. https://api.example.com/api)."
  );
}

const API_BASE = resolveApiBase();

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
  register: (body) => apiRequest("/auth/register", { method: "POST", body }),
  login: (body) => apiRequest("/auth/login", { method: "POST", body }),
  googleLogin: (body) => apiRequest("/auth/google", { method: "POST", body }),
  me: (token) => apiRequest("/auth/me", { token }),
  changePassword: (body, token) =>
    apiRequest("/auth/password", { method: "PUT", body, token }),
  sendMessage: (body) => apiRequest("/messages", { method: "POST", body }),
  getProducts: async (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    const data = await apiRequest(`/products${query ? `?${query}` : ""}`);

    // Support both response shapes:
    // 1) { items: [...] } from the API
    // 2) raw array (some proxies or older clients)
    if (Array.isArray(data)) {
      return { items: data, pagination: null };
    }

    if (data && Array.isArray(data.items)) {
      return data;
    }

    return { items: [], pagination: null };
  },
  getProduct: (id) => apiRequest(`/products/${id}`),
  createOrder: (body, token) => apiRequest("/orders", { method: "POST", body, token }),
  getOrders: (token) => apiRequest("/orders", { token }),
  getMyOrders: (token) => apiRequest("/orders/my", { token }),
  initializePayment: (body, token) => apiRequest("/payment/initialize", { method: "POST", body, token }),
  verifyPayment: (reference) => apiRequest(`/payment/verify?reference=${encodeURIComponent(reference)}`),
  getMessages: (token) => apiRequest("/messages", { token }),
  createProduct: (body, token) => apiRequest("/products", { method: "POST", body, token }),
};

export { API_BASE };
