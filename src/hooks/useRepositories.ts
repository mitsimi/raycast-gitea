import { useCachedState, useCachedPromise, showFailureToast } from "@raycast/utils";
import { listRepositories } from "../api/repositories";
import { Repository } from "../types/repository";
import { Toast } from "@raycast/api";
import { useEffect } from "react";

export function useRepositories(sort?: string, order?: "asc" | "desc") {
  const [items, setItems] = useCachedState<Repository[]>("repositories", []);
  const [page, setPage] = useCachedState<number>("repositories-page", 1);
  const [hasMore, setHasMore] = useCachedState<boolean>("repositories-hasMore", true);

  const LIMIT = 20;

  type SearchResults<T> = { data?: T[]; ok?: boolean };

  const { isLoading, revalidate, mutate } = useCachedPromise(
    async (p: number, s?: string, o?: "asc" | "desc"): Promise<Repository[] | SearchResults<Repository>> =>
      listRepositories({ limit: LIMIT, page: p, sort: s, order: o }),
    [page, sort, order] as [number, string | undefined, "asc" | "desc" | undefined],
    {
      initialData: [] as Repository[],
      onData: (data) => {
        const normalize = (input: Repository[] | SearchResults<Repository>): Repository[] => {
          if (Array.isArray(input)) return input as Repository[];
          const maybe = input as SearchResults<Repository>;
          if (maybe.ok === false) {
            showFailureToast({ style: Toast.Style.Failure, title: "Search failed for repositories" });
            return [] as Repository[];
          }
          return (maybe.data ?? []) as Repository[];
        };

        const current = normalize(data);
        setHasMore(current.length === LIMIT);
        if (page === 1) {
          setItems(current);
        } else if (current.length > 0) {
          setItems((prev) => [...prev, ...current]);
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
