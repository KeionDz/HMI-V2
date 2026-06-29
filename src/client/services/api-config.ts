const rawApiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const API_BASE_URL = /\/api\/v\d+$/i.test(rawApiBaseUrl)
  ? rawApiBaseUrl
  : `${rawApiBaseUrl}/api/v1`;
