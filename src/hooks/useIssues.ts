import { useCachedState, useCachedPromise, showFailureToast } from "@raycast/utils";
import { getMyIssues } from "../api/issues";
import type { Issue } from "../types/api";
import { Toast } from "@raycast/api";
import { useEffect } from "react";

type UseIssuesOptions = {
  includeCreated: boolean;
  includeAssigned: boolean;
  includeMentioned: boolean;
  includeRecentlyClosed: boolean;
  query?: string;
};

export function useIssues(options: UseIssuesOptions) {
  const [items, setItems] = useCachedState<Issue[]>("issues", []);
  const [page, setPage] = useCachedState<number>("issues-page", 1);
  const [hasMore, setHasMore] = useCachedState<boolean>("issues-hasMore", true);
  const LIMIT = 30;

  const { isLoading, revalidate, mutate } = useCachedPromise(
    async (
      p: number,
      includeCreated: boolean,
      includeAssigned: boolean,
      includeMentioned: boolean,
      includeRecentlyClosed: boolean,
      query?: string,
    ): Promise<Issue[]> =>
      getMyIssues({
        includeCreated,
        includeAssigned,
        includeMentioned,
        includeRecentlyClosed,
        query,
        page: p,
        limit: LIMIT,
      }),
    [
      page,
      options.includeCreated,
      options.includeAssigned,
      options.includeMentioned,
      options.includeRecentlyClosed,
      options.query,
    ] as [number, boolean, boolean, boolean, boolean, string | undefined],
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
      onError() {
        showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retrieve issues" });
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
    options.includeRecentlyClosed,
    options.query,
  ]);

  const paginationAdapter = {
    pageSize: LIMIT,
    hasMore,
    onLoadMore: () => setPage((p) => p + 1),
  } as const;

  return { items, isLoading, revalidate, mutate, pagination: paginationAdapter };
}
