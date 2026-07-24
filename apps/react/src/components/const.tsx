const API = "http://localhost:2600";

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