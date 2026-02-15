import { getPreferenceValues } from "@raycast/api";
import createClient from "openapi-fetch";
import type { paths } from "../types/gitea";

type Prefs = { serverUrl: string; accessToken: string };
const API_BASE = "/api/v1";

let cachedClient: ReturnType<typeof createClient<paths>> | null = null;
let cachedKey: string | null = null;

export function getClient() {
  const { serverUrl, accessToken } = getPreferenceValues<Prefs>();
  const baseUrl = serverUrl.replace(/\/+$/, "") + API_BASE;
  const nextKey = `${baseUrl}::${accessToken}`;

  if (cachedClient && cachedKey === nextKey) return cachedClient;

  cachedClient = createClient<paths>({
    baseUrl,
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  cachedKey = nextKey;

  return cachedClient;
}
