const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.detail || data.message || "Request failed.");
  return data;
}

export const sendChatMessage = (message) =>
  request("/chat/", { method: "POST", body: JSON.stringify({ message }) });

export const sendContactMessage = (payload) =>
  request("/contact/", { method: "POST", body: JSON.stringify(payload) });
