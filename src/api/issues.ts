import { Issue } from "../types/issue";
import { getClient } from "./client";

export async function getIssues() {
  const client = getClient();
  return client.get<Issue[]>(`/repos/issues/search`);
}
