import {
  listRepositories,
  listUserRepositories,
  type ListRepositoriesParams,
  type ListUserRepositoriesParams,
} from "../api/repositories";
import type { PaginatedResult } from "../api/common";
import type { Repository } from "../types/api";

export async function getRepositories(params: ListRepositoriesParams = {}): Promise<PaginatedResult<Repository>> {
  const items = await listRepositories(params);
  return toPaginatedResult(items, params.limit);
}

export async function getUserRepositories(
  params: ListUserRepositoriesParams = {},
): Promise<PaginatedResult<Repository>> {
  const items = await listUserRepositories(params);
  return toPaginatedResult(items, params.limit);
}

function toPaginatedResult<T>(items: T[], limit?: number): PaginatedResult<T> {
  return { items, hasMore: typeof limit === "number" && items.length === limit };
}
