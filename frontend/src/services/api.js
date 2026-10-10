function getEndpointUrl(path) {
  const rawBase = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1").trim();

  // Remove any trailing slashes from the base URL
  let base = rawBase.replace(/\/+$/, "");

  // Ensure /api/v1 is part of the base URL
  if (!base.endsWith("/api/v1")) {
    base = `${base}/api/v1`;
  }

  // Ensure path starts with a leading slash
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Avoid duplicating /api/v1 if path already includes it
  if (normalizedPath.startsWith("/api/v1/")) {
    normalizedPath = normalizedPath.slice(7);
  }

  const combinedUrl = `${base}${normalizedPath}`;

  // Collapse any accidental double slashes (e.g. ".com//api") while preserving "https://"
  return combinedUrl.replace(/(https?:\/\/)|(\/)+/g, (match, protocol) => protocol || "/");
}

async function request(path, options = {}) {
  const url = getEndpointUrl(path);
  const response = await fetch(url, {
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
