import { listOrganizations, type ListOrganizationsParams } from "../api/organizations";
import type { PaginatedResult } from "../api/common";
import type { Organization } from "../types/api";

export async function getOrganizations(params: ListOrganizationsParams = {}): Promise<PaginatedResult<Organization>> {
  const items = await listOrganizations(params);
  return { items, hasMore: typeof params.limit === "number" && items.length === params.limit };
}
