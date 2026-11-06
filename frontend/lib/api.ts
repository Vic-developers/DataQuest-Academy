export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
export const token = () => (typeof window === "undefined" ? "" : localStorage.getItem("dq_token") ?? "");
export async function api(path: string, init: RequestInit = {}) {
  const r = await fetch(`${API}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...init.headers } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
