const API = import.meta.env.VITE_API_URL;

export function getAPIURL(path: string='') {
    return `${API}${path}`;
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  return fetch(url, {
    credentials: "include",
    ...options,
  });
}