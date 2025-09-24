export function getApiBaseUrl() {
  // Use VITE_API_BASE_URL in production, fall back to relative path in dev (Vite proxy)
  return import.meta.env.VITE_API_BASE_URL || "";
}


