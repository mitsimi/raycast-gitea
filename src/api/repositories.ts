import type { Repository } from "../types/api";
import type { PaginatedResult } from "./common";
import { getClient } from "./client";
import { SortOrder } from "../types/sorts/common";

/**
 * Parameters for repoSearch endpoint - supports server-side sorting.
 * Used by Explore Repositories command.
 */
export type ListRepositoriesParams = { limit?: number; page?: number; sort?: string; order?: SortOrder };

/**
 * Search repositories across all accessible repositories.
 * Supports server-side sorting via sort/order parameters.
 */
export async function listRepositories(params: ListRepositoriesParams = {}): Promise<Repository[]> {
  const client = getClient();
  const { limit = 20, page, sort, order } = params;
  const { data } = await client.rest.repository.repoSearch({
    limit,
    ...(page ? { page } : {}),
    ...(sort ? { sort } : {}),
    ...(order ? { order } : {}),
  });
  if (!data?.ok) throw new Error("Search failed for repositories");
  return data?.data ?? [];
}

export async function getRepositories(params: ListRepositoriesParams = {}): Promise<PaginatedResult<Repository>> {
  const items = await listRepositories(params);
  return { items, hasMore: typeof params.limit === "number" && items.length === params.limit };
}

/**
 * Parameters for userCurrentListRepos endpoint - does NOT support sort/order.
 * Sorting must be done client-side via SortRepositories() in useUserRepositories hook.
 */
export type ListUserRepositoriesParams = { limit?: number; page?: number };

/**
 * List repositories for the authenticated user.
 * Note: This endpoint does NOT support sort/order parameters (Gitea API limitation).
 */
export async function listUserRepositories(params: ListUserRepositoriesParams = {}): Promise<Repository[]> {
  const client = getClient();

  const { data } = await client.rest.user.userCurrentListRepos({
    ...(typeof params.page === "number" ? { page: params.page } : {}),
    ...(typeof params.limit === "number" ? { limit: params.limit } : {}),
  });
  return data ?? [];
}

export async function getUserRepositories(
  params: ListUserRepositoriesParams = {},
): Promise<PaginatedResult<Repository>> {
  const items = await listUserRepositories(params);
  return { items, hasMore: typeof params.limit === "number" && items.length === params.limit };
}
