import type { Organization } from "../types/api";
import { getClient } from "./client";

export type ListOrganizationsParams = { page?: number; limit?: number };

export async function listOrganizations(params?: ListOrganizationsParams): Promise<Organization[]> {
  const client = getClient();
  const { data, error } = await client.GET("/orgs", {
    params: { query: params },
  });
  if (error) throw new Error("Failed to fetch organizations");
  return data ?? [];
}
