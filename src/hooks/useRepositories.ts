import { getRepositories } from "../services/repositories";
import { CacheKey, DEFAULT_PAGE_SIZE } from "../constants";
import { RepositorySortOption, mapRepositorySortToGitea } from "../types/sorts/repository-search";
import { usePaginatedResource } from "./usePaginatedResource";

export function useRepositories(sort?: RepositorySortOption) {
  return usePaginatedResource({
    cacheKey: CacheKey.Repositories,
    errorTitle: "Couldn't retrieve repositories",
    pageSize: DEFAULT_PAGE_SIZE,
    params: { sort },
    fetchPage: ({ sort: repositorySort, page, limit }) => {
      const { sort: giteaSort, order: giteaOrder } = mapRepositorySortToGitea(repositorySort ?? "");

      return getRepositories({
        limit,
        page,
        sort: giteaSort,
        order: giteaOrder,
      });
    },
  });
}
