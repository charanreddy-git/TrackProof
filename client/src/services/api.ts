import { disconnectSocket } from "../sockets";

const API_URL = import.meta.env.VITE_API_URL || "/api";

class ApiError extends Error {
  response: { data: { message?: string } };

  constructor(message: string, data: { message?: string }) {
    super(message);
    this.name = "ApiError";
    this.response = { data };
  }
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  extraHeaders?: Record<string, string>
): Promise<{ data: T }> {
  const token = localStorage.getItem("token");
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (extraHeaders) Object.assign(headers, extraHeaders);
  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    disconnectSocket();
    if (
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/register") &&
      !window.location.pathname.includes("/signup")
    ) {
      window.location.href = "/login";
    }
  }

  const json = await response.json();

  if (!response.ok) {
    throw new ApiError(json.message || "Request failed", json);
  }

  return { data: json };
}

const api = {
  get<T>(url: string, config?: { params?: Record<string, string> }): Promise<{ data: T }> {
    const qs = config?.params ? "?" + new URLSearchParams(config.params).toString() : "";
    return request<T>("GET", `${url}${qs}`);
  },
  post<T>(url: string, body?: unknown, config?: { headers?: Record<string, string> }): Promise<{ data: T }> {
    return request<T>("POST", url, body, config?.headers);
  },
};

export default api;
