import { getClient } from "./client";
import type { Issue } from "../types/api";

// export type IssueView = "your_repositories" | "assigned" | "created" | "mentioned";
export async function getIssues(/*view: IssueView = "your_repositories"*/): Promise<Issue[]> {
  const client = getClient();
  const { data, error } = await client.GET("/repos/issues/search");
  if (error) throw new Error("Failed to fetch issues");
  return data ?? [];
}
