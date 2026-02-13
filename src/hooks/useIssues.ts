import { useCachedState, useCachedPromise } from "@raycast/utils";
import { getIssues } from "../api/issues";
import type { Issue } from "../types/api";

export function useIssues() {
  const [items, setItems] = useCachedState<Issue[]>("issues", []);
  const { isLoading, revalidate, mutate } = useCachedPromise((): Promise<Issue[]> => getIssues(), [], {
    keepPreviousData: true,
    initialData: items,
    onData: (data: Issue[]) => {
      if (Array.isArray(data)) setItems(data);
    },
  });
  return { items, isLoading, revalidate, mutate };
}
