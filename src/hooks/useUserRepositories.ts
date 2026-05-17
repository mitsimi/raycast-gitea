import { useMemo } from "react";
import { getUserRepositories } from "../services/repositories";
import { CacheKey, DEFAULT_PAGE_SIZE } from "../constants";
import type { Repository } from "../types/api";
import { RepositorySortOption, SortRepositories } from "../types/sorts/repository-search";
import { usePaginatedResource } from "./usePaginatedResource";

/**
 * Hook for fetching and sorting the authenticated user's repositories.
 * Note: Sorts client-side because Gitea's userCurrentListRepos endpoint doesn't support sort params.
 */
export function useUserRepositories(sort?: RepositorySortOption) {
  const result = usePaginatedResource<Repository, { sort?: RepositorySortOption }>({
    cacheKey: CacheKey.UserRepositories,
    errorTitle: "Couldn't retrieve repositories",
    pageSize: DEFAULT_PAGE_SIZE,
    params: { sort },
    fetchPage: ({ page, limit }) =>
      getUserRepositories({
        limit,
        page,
      }),
  });

  // Client-side sorting (Gitea API limitation - userCurrentListRepos doesn't support sort params)
  const items = useMemo(() => (sort ? SortRepositories(result.items, sort) : result.items), [result.items, sort]);

  return { ...result, items };
}
