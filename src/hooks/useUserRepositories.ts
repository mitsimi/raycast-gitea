import { useCachedState, useCachedPromise, showFailureToast } from "@raycast/utils";
import { Repository } from "../types/repository";
import { Toast } from "@raycast/api";
import { listUserRepositories } from "../api/repositories";
import { useEffect } from "react";
import { RepositorySortOption, SortRepositories } from "../types/sorts/repository-search";

export function useUserRepositories(sort?: RepositorySortOption) {
  const [items, setItems] = useCachedState<Repository[]>("user-repositories", []);
  const [page, setPage] = useCachedState<number>("user-repositories-page", 1);
  const [hasMore, setHasMore] = useCachedState<boolean>("user-repositories-hasMore", true);

  const LIMIT = 20;

  type SearchResults<T> = { data?: T[]; ok?: boolean };

  const { isLoading, revalidate, mutate } = useCachedPromise(
    async (p: number): Promise<Repository[] | SearchResults<Repository>> =>
      listUserRepositories({ limit: LIMIT, page: p }),
    [page] as [number],
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
          setItems(sort ? SortRepositories(current, sort) : current);
        } else if (current.length > 0) {
          setItems((prev) => {
            const merged = [...prev, ...current];
            return sort ? SortRepositories(merged, sort) : merged;
          });
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
  }, [sort]);

  const paginationAdapter = {
    pageSize: LIMIT,
    hasMore,
    onLoadMore: () => setPage((p) => p + 1),
  } as const;

  return { items, isLoading, revalidate, mutate, pagination: paginationAdapter };
}
