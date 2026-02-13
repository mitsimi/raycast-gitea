import { getPreferenceValues } from "@raycast/api";
import createClient from "openapi-fetch";
import type { paths } from "../types/gitea";

type Prefs = { serverUrl: string; accessToken: string };
const API_BASE = "/api/v1";

export function getClient() {
  const { serverUrl, accessToken } = getPreferenceValues<Prefs>();
  const baseUrl = serverUrl.replace(/\/+$/, "") + API_BASE;

  return createClient<paths>({
    baseUrl,
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
}
