import type { Repository } from "../types/api";
import { getClient } from "./client";

export type ListRepositoriesParams = { limit?: number; page?: number; sort?: string; order?: "asc" | "desc" };
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

export async function listUserRepositories(): Promise<Repository[]> {
  const client = getClient();
  const { data } = await client.rest.user.userCurrentListRepos();
  return data;
}
