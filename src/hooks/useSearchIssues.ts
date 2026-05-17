import { showFailureToast, useCachedPromise, useCachedState } from "@raycast/utils";
import { searchIssues, type SearchIssuesParams } from "../services/issues";
import type { Issue } from "../types/api";

export type UseSearchIssuesParams = SearchIssuesParams;

export function useSearchIssues(params: UseSearchIssuesParams) {
  const { state, owner, repo, query } = params;
  const [items, setItems] = useCachedState<Issue[]>("issues-search", []);

  const { isLoading } = useCachedPromise(
    async (s?: SearchIssuesParams["state"], o?: string, r?: string, q?: string) =>
      searchIssues({ state: s, owner: o, repo: r, query: q, limit: 50 }),
    [state, owner, repo, query] as [
      SearchIssuesParams["state"] | undefined,
      string | undefined,
      string | undefined,
      string | undefined,
    ],
    {
      keepPreviousData: true,
      initialData: items,
      onData: (data) => setItems(data),
      onError(error) {
        showFailureToast(error, { title: "Couldn't search issues" });
      },
    },
  );

  return { items, isLoading };
}
