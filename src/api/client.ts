import { getPreferenceValues } from "@raycast/api";

type Prefs = { serverUrl: string; accessToken: string };
const API_BASE = "/api/v1";

export function getClient() {
  const { serverUrl, accessToken } = getPreferenceValues<Prefs>();
  const base = serverUrl.replace(/\/+$/, "") + API_BASE;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `token ${accessToken}`,
  };

  async function request<T>(path: string, init?: RequestInit) {
    const url = `${base}${path}`;
    const res = await fetch(url, { ...init, headers: { ...headers, ...init?.headers } });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }

    if (res.status === 204 || res.status === 205) return undefined as unknown as T;
    return (await res.json()) as T;
  }

  const get = <T>(path: string, qs?: Record<string, string | number | boolean>) =>
    request<T>(qs ? `${path}?${new URLSearchParams(qs as Record<string, string>).toString()}` : path);

  const patch = <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });

  const put = <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });

  return { get, patch, put };
}
