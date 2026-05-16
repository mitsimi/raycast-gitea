import type { Repository } from "../types/api";
import type { PaginatedResult } from "./common";
import { getClient } from "./client";
import { SortOrder } from "../types/sorts/common";

export type ListRepositoriesParams = { limit?: number; page?: number; sort?: string; order?: SortOrder };
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

export type ListUserRepositoriesParams = { limit?: number; page?: number };
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
