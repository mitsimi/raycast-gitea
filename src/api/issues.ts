import { getClient } from "./client";
import type { Issue } from "../types/api";

export type IssueListParams = {
  state?: "open" | "closed" | "all";
  labels?: string;
  milestones?: string;
  q?: string;
  priority_repo_id?: number;
  type?: "issues" | "pulls";
  since?: string;
  before?: string;
  assigned?: boolean;
  created?: boolean;
  mentioned?: boolean;
  review_requested?: boolean;
  reviewed?: boolean;
  owner?: string;
  team?: string;
  page?: number;
  limit?: number;
};

export async function searchIssues(params: IssueListParams = {}): Promise<Issue[]> {
  const client = getClient();
  const { data, error } = await client.GET("/repos/issues/search", { params: { query: params } });
  if (error) throw new Error("Failed to fetch issues");
  return data ?? [];
}

export type ListRepoIssuesParams = {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  labels?: string;
  milestones?: string;
  q?: string;
  since?: string;
  before?: string;
  page?: number;
  limit?: number;
};

export async function listRepoIssues(params: ListRepoIssuesParams): Promise<Issue[]> {
  const client = getClient();
  const { owner, repo, ...query } = params;
  const { data, error } = await client.GET("/repos/{owner}/{repo}/issues", {
    params: { path: { owner, repo }, query },
  });
  if (error) throw new Error("Failed to fetch repository issues");
  return data ?? [];
}

export type MyIssuesParams = {
  includeCreated: boolean;
  includeAssigned: boolean;
  includeMentioned: boolean;
  includeRecentlyClosed: boolean;
  query?: string;
  page?: number;
  limit?: number;
};

export async function getMyIssues(params: MyIssuesParams): Promise<Issue[]> {
  const baseQuery = {
    type: "issues",
    q: params.query,
    page: params.page,
    limit: params.limit,
  } satisfies IssueListParams;

  if (!params.includeCreated && !params.includeAssigned && !params.includeMentioned) {
    return [];
  }

  const [created, assigned, mentioned] = await Promise.all([
    params.includeCreated
      ? searchIssues({ ...baseQuery, state: params.includeRecentlyClosed ? "all" : "open", created: true })
      : Promise.resolve([]),
    params.includeAssigned
      ? searchIssues({ ...baseQuery, state: params.includeRecentlyClosed ? "all" : "open", assigned: true })
      : Promise.resolve([]),
    params.includeMentioned
      ? searchIssues({ ...baseQuery, state: params.includeRecentlyClosed ? "all" : "open", mentioned: true })
      : Promise.resolve([]),
  ]);

  const merged = [...created, ...assigned, ...mentioned];
  const deduped = new Map<number, Issue>();
  for (const issue of merged) {
    if (issue.id != null) deduped.set(issue.id, issue);
  }

  return Array.from(deduped.values());
}
