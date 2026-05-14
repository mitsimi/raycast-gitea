import { useCachedState, useCachedPromise, showFailureToast } from "@raycast/utils";
import type { Issue } from "../types/api";

import { useEffect } from "react";
import { getMyPullRequests } from "../api/issues";

type UsePullRequestsOptions = {
  includeCreated: boolean;
  includeAssigned: boolean;
  includeMentioned: boolean;
  includeReviewRequested: boolean;
  includeReviewed: boolean;
  includeOwnedRepositories: boolean;
  includeRecentlyClosed: boolean;
  owner?: string;
  query?: string;
};

export function usePullRequests(options: UsePullRequestsOptions) {
  const [items, setItems] = useCachedState<Issue[]>("pull-requests", []);
  const [page, setPage] = useCachedState<number>("pull-requests-page", 1);
  const [hasMore, setHasMore] = useCachedState<boolean>("pull-requests-hasMore", true);
  const LIMIT = 30;

  const { isLoading, revalidate, mutate } = useCachedPromise(
    async (
      p: number,
      includeCreated: boolean,
      includeAssigned: boolean,
      includeMentioned: boolean,
      includeReviewRequested: boolean,
      includeReviewed: boolean,
      includeOwnedRepositories: boolean,
      includeRecentlyClosed: boolean,
      owner?: string,
      query?: string,
    ): Promise<Issue[]> =>
      getMyPullRequests({
        includeCreated,
        includeAssigned,
        includeMentioned,
        includeReviewRequested,
        includeReviewed,
        includeOwnedRepositories,
        includeRecentlyClosed,
        owner,
        query,
        page: p,
        limit: LIMIT,
      }),
    [
      page,
      options.includeCreated,
      options.includeAssigned,
      options.includeMentioned,
      options.includeReviewRequested,
      options.includeReviewed,
      options.includeOwnedRepositories,
      options.includeRecentlyClosed,
      options.owner,
      options.query,
    ] as [
      number,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      boolean,
      string | undefined,
      string | undefined,
    ],
    {
      keepPreviousData: true,
      initialData: items,
      onData: (data: Issue[]) => {
        setHasMore(data.length === LIMIT);
        if (page === 1) {
          setItems(data);
        } else if (data.length > 0) {
          setItems((prev) => [...prev, ...data]);
        }
      },
      onError(error) {
        showFailureToast(error, { title: "Couldn't retrieve pull requests" });
      },
    },
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [
    options.includeCreated,
    options.includeAssigned,
    options.includeMentioned,
    options.includeReviewRequested,
    options.includeReviewed,
    options.includeOwnedRepositories,
    options.includeRecentlyClosed,
    options.owner,
    options.query,
  ]);

  const paginationAdapter = {
    pageSize: LIMIT,
    hasMore,
    onLoadMore: () => setPage((p) => p + 1),
  } as const;

  return { items, isLoading, revalidate, mutate, pagination: paginationAdapter };
}
