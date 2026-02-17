import { useCachedState, useCachedPromise } from "@raycast/utils";
import { listNotifications } from "../api/notifications";
import type { NotificationThread } from "../types/api";
import { useEffect } from "react";

export function useNotifications(filter: "unread" | "all") {
  const cacheKey = `notifications-${filter}`;
  const [items, setItems] = useCachedState<NotificationThread[]>(cacheKey, []);
  const [page, setPage] = useCachedState<number>(`${cacheKey}-page`, 1);
  const [hasMore, setHasMore] = useCachedState<boolean>(`${cacheKey}-hasMore`, true);
  const LIMIT = 20;
  const { isLoading, revalidate, mutate } = useCachedPromise(
    (p: number, f: "unread" | "all"): Promise<NotificationThread[]> =>
      listNotifications({ limit: LIMIT, all: f === "all", page: p }),
    [page, filter] as [number, typeof filter],
    {
      keepPreviousData: true,
      initialData: items,
      onData: (data) => {
        if (!Array.isArray(data)) return;
        setHasMore(data.length === LIMIT);
        if (page === 1) {
          setItems(data as NotificationThread[]);
        } else if (data.length > 0) {
          setItems((prev) => [...prev, ...(data as NotificationThread[])]);
        }
      },
    },
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [filter]);

  const paginationAdapter = {
    pageSize: LIMIT,
    hasMore,
    onLoadMore: () => setPage((p) => p + 1),
  } as const;

  return { items, isLoading, revalidate, mutate, pagination: paginationAdapter };
}
