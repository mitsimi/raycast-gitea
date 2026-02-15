import { useCachedState, useCachedPromise, showFailureToast } from "@raycast/utils";
import type { Repository } from "../types/api";
import { Toast } from "@raycast/api";
import { listUserRepositories } from "../api/repositories";
import { RepositorySortOption, SortRepositories } from "../types/sorts/repository-search";

export function useUserRepositories(sort?: RepositorySortOption) {
  const [items, setItems] = useCachedState<Repository[]>("user-repositories", []);

  const { isLoading, revalidate, mutate } = useCachedPromise(
    async (s?: RepositorySortOption) => {
      const data = await listUserRepositories();
      return s ? SortRepositories(data, s) : data;
    },
    [sort] as [RepositorySortOption | undefined],
    {
      keepPreviousData: true,
      initialData: items as Repository[],
      onData: (data) => {
        if (!Array.isArray(data)) return;
        const next = data as Repository[];
        const prev = items;
        if (
          prev.length === next.length &&
          prev.every((r, i) => (r.id ?? r.full_name ?? "") === (next[i]?.id ?? next[i]?.full_name ?? ""))
        ) {
          return;
        }
        setItems(next);
      },
      onError() {
        showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retrieve repositories" });
      },
    },
  );

  return { items, isLoading, revalidate, mutate };
}
