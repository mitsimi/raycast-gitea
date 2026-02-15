import { useCachedState, useCachedPromise, showFailureToast } from "@raycast/utils";
import { listRepositories } from "../api/repositories";
import type { Repository } from "../types/api";
import { Toast } from "@raycast/api";
import { useEffect } from "react";

export function useRepositories(sort?: string, order?: "asc" | "desc") {
  const [items, setItems] = useCachedState<Repository[]>("repositories", []);
  const [page, setPage] = useCachedState<number>("repositories-page", 1);
  const [hasMore, setHasMore] = useCachedState<boolean>("repositories-hasMore", true);

  const LIMIT = 20;

  const { isLoading, revalidate, mutate } = useCachedPromise(
    async (p: number, s?: string, o?: "asc" | "desc"): Promise<Repository[]> =>
      listRepositories({ limit: LIMIT, page: p, sort: s, order: o }),
    [page, sort, order] as [number, string | undefined, "asc" | "desc" | undefined],
    {
      initialData: items as Repository[],
      onData: (data) => {
        setHasMore(data.length === LIMIT);
        if (page === 1) {
          setItems(data);
        } else if (data.length > 0) {
          setItems((prev) => [...prev, ...data]);
        }
      },
      onError() {
        showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retrieve repositories" });
      },
    },
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [sort, order]);

  const paginationAdapter = {
    pageSize: LIMIT,
    hasMore,
    onLoadMore: () => setPage((p) => p + 1),
  } as const;

  return { items, isLoading, revalidate, mutate, pagination: paginationAdapter };
}
