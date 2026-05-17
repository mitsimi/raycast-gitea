import { PaginatedResult } from ".";
import { api } from "../api";
import type { IssueListParams } from "../api/issues";
import type { Issue } from "../types/api";

export type MyIssuesParams = {
  includeCreated: boolean;
  includeAssigned: boolean;
  includeMentioned: boolean;
  includeRecentlyClosed: boolean;
  query?: string;
  page?: number;
  limit?: number;
};

type IssueSearchRequest = {
  enabled: boolean;
  params: IssueListParams;
};

export async function getMyIssues(params: MyIssuesParams): Promise<PaginatedResult<Issue>> {
  const baseQuery = {
    type: "issues",
    q: params.query,
    page: params.page,
    limit: params.limit,
  } satisfies IssueListParams;

  if (!params.includeCreated && !params.includeAssigned && !params.includeMentioned) {
    return { items: [], hasMore: false };
  }

  const state = params.includeRecentlyClosed ? "all" : "open";
  return searchEnabledIssueRequests(
    [
      { enabled: params.includeCreated, params: { ...baseQuery, state, created: true } },
      { enabled: params.includeAssigned, params: { ...baseQuery, state, assigned: true } },
      { enabled: params.includeMentioned, params: { ...baseQuery, state, mentioned: true } },
    ],
    params.limit,
  );
}

export async function searchEnabledIssueRequests(
  requests: IssueSearchRequest[],
  limit?: number,
): Promise<PaginatedResult<Issue>> {
  const enabledRequests = requests.filter((request) => request.enabled);
  if (enabledRequests.length === 0) {
    return { items: [], hasMore: false };
  }

  const pages = await Promise.all(enabledRequests.map((request) => api.issues.search(request.params)));
  return {
    items: dedupeIssuesById(pages.flat()),
    hasMore: limit != null && pages.some((page) => page.length === limit),
  };
}

function dedupeIssuesById(items: Issue[]): Issue[] {
  const deduped = new Map<number, Issue>();
  const withoutId: Issue[] = [];

  for (const issue of items) {
    if (issue.id == null) {
      withoutId.push(issue);
      continue;
    }
    deduped.set(issue.id, issue);
  }

  return [...deduped.values(), ...withoutId];
}
