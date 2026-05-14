import { getClient } from "./client";
import type { Organization } from "../types/api";

export async function listOrganizations(params?: { page?: number; limit?: number }): Promise<Organization[]> {
  const client = getClient();
  const { data } = await client.rest.organization.orgGetAll(params);
  return data;
}
