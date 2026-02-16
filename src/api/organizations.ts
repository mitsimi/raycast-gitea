import { getClient } from "./client";
import type { Organization } from "../types/api";

export async function listOrganizations(params?: { page?: number; limit?: number }): Promise<Organization[]> {
  const client = getClient();
  const { data, error } = await client.GET("/orgs", {
    params: { query: params },
  });
  if (error) throw new Error("Failed to fetch organizations");
  return data ?? [];
}
