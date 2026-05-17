import { api } from "../api";
import type { ListOrganizationsParams } from "../api/organizations";
import type { PaginatedResult } from ".";
import type { Organization } from "../types/api";

export async function getOrganizations(params: ListOrganizationsParams = {}): Promise<PaginatedResult<Organization>> {
  const items = await api.organizations.list(params);
  return { items, hasMore: typeof params.limit === "number" && items.length === params.limit };
}
