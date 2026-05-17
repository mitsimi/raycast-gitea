import { getOrganizations } from "../services/organizations";
import { CacheKey, DEFAULT_PAGE_SIZE } from "../constants";
import { usePaginatedResource } from "./usePaginatedResource";

export function useOrganizations() {
  return usePaginatedResource({
    cacheKey: CacheKey.Organizations,
    errorTitle: "Couldn't retrieve organizations",
    pageSize: DEFAULT_PAGE_SIZE,
    params: {},
    fetchPage: ({ page, limit }) =>
      getOrganizations({
        page,
        limit,
      }),
  });
}
