import type { Repository } from "../types/api";
import { getClient } from "./client";

export type ListRepositoriesParams = { limit?: number; page?: number; sort?: string; order?: "asc" | "desc" };
export async function listRepositories(params: ListRepositoriesParams = {}): Promise<Repository[]> {
  const client = getClient();
  const { limit = 20, page, sort, order } = params;
  const { data, error } = await client.GET("/repos/search", {
    params: { query: { limit, ...(page ? { page } : {}), ...(sort ? { sort } : {}), ...(order ? { order } : {}) } },
  });
  if (error) throw new Error("Failed to fetch repositories");
  if (!data?.ok) throw new Error("Search failed for repositories");
  return data?.data ?? [];
}

export async function listUserRepositories(): Promise<Repository[]> {
  const client = getClient();
  const { data, error } = await client.GET("/user/repos");
  if (error) throw new Error("Failed to fetch user repositories");
  return data ?? [];
}
