import { Repository } from "../types/repository";
import { getClient } from "./client";

export type ListRepositoriesParams = { limit?: number; page?: number; sort?: string; order?: "asc" | "desc" };
export async function listRepositories(params: ListRepositoriesParams = {}) {
  const client = getClient();
  const { limit = 20, page, sort, order } = params;
  return client.get<Repository[]>("/repos/search", {
    limit,
    ...(page ? { page } : {}),
    ...(sort ? { sort } : {}),
    ...(order ? { order } : {}),
  });
}

export async function listUserRepositories() {
  const client = getClient();
  return client.get<Repository[]>("/user/repos");
}
