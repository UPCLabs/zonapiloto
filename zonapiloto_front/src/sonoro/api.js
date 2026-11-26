const API_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request(path, { method = "GET", body, admin = false } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: admin ? "include" : "same-origin",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("No hay conexión con el servidor. Revisa tu red e inténtalo de nuevo.", 0);
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      data?.error ||
        `El servidor respondió con el código ${response.status}. Inténtalo de nuevo en unos minutos.`,
      response.status,
      data,
    );
  }
  return data;
}

export const sonoroApi = {
  zones: () => request("/acoustic/zones"),
  overview: (slot) =>
    request(`/acoustic/overview${slot ? `?slot=${slot}` : ""}`),
  history: (zoneId, days = 30) =>
    request(`/acoustic/zones/${zoneId}/history?days=${days}`),
  submitSample: (payload) =>
    request("/acoustic/samples", { method: "POST", body: payload }),
};

export const sonoroAdminApi = {
  zones: () => request("/acoustic/admin/zones", { admin: true }),
  createZone: (zone) =>
    request("/acoustic/admin/zones", { method: "POST", body: zone, admin: true }),
  updateZone: (id, zone) =>
    request(`/acoustic/admin/zones/${id}`, {
      method: "PUT",
      body: zone,
      admin: true,
    }),
  trends: (days = 14) =>
    request(`/acoustic/admin/trends?days=${days}`, { admin: true }),
  quality: (days = 30) =>
    request(`/acoustic/admin/quality?days=${days}`, { admin: true }),
};
