import dayjs from "dayjs";
import type { Repository } from "../api";
import { CommonOptionType } from "./common";

export enum RepositorySortOption {
  MostStars = "most stars",
  FewestStars = "fewest stars",
  Newest = "newest",
  Oldest = "oldest",
  RecentlyUpdated = "recently",
  LeastRecentlyUpdated = "least recently",
}

export const RepositorySortTypes: CommonOptionType[] = [
  { id: "1", name: "Most stars", value: RepositorySortOption.MostStars },
  { id: "2", name: "Fewest stars", value: RepositorySortOption.FewestStars },
  { id: "3", name: "Newest", value: RepositorySortOption.Newest },
  { id: "4", name: "Oldest", value: RepositorySortOption.Oldest },
  { id: "5", name: "Recently updated", value: RepositorySortOption.RecentlyUpdated },
  { id: "6", name: "Least recently updated", value: RepositorySortOption.LeastRecentlyUpdated },
];

export function SortRepositories(list: Repository[], sortType: RepositorySortOption | string): Repository[] {
  switch (sortType) {
    case RepositorySortOption.MostStars:
      return list.toSorted((a: Repository, b: Repository) => (b.stars_count ?? 0) - (a.stars_count ?? 0));
    case RepositorySortOption.FewestStars:
      return list.toSorted((a: Repository, b: Repository) => (a.stars_count ?? 0) - (b.stars_count ?? 0));
    case RepositorySortOption.Newest:
      return list.toSorted((a: Repository, b: Repository) => {
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;
        return dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1;
      });
    case RepositorySortOption.Oldest:
      return list.toSorted((a: Repository, b: Repository) => {
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;
        return dayjs(a.created_at).isAfter(dayjs(b.created_at)) ? 1 : -1;
      });
    case RepositorySortOption.RecentlyUpdated:
      return list.toSorted((a: Repository, b: Repository) => {
        if (!a.updated_at) return 1;
        if (!b.updated_at) return -1;
        return dayjs(a.updated_at).isBefore(dayjs(b.updated_at)) ? 1 : -1;
      });
    case RepositorySortOption.LeastRecentlyUpdated:
      return list.toSorted((a: Repository, b: Repository) => {
        if (!a.updated_at) return 1;
        if (!b.updated_at) return -1;
        return dayjs(a.updated_at).isAfter(dayjs(b.updated_at)) ? 1 : -1;
      });
    default:
      return list;
  }
}

export type GiteaRepositorySort = { sort?: string; order?: "asc" | "desc" };
export function mapRepositorySortToGitea(sortType: RepositorySortOption | string): GiteaRepositorySort {
  switch (sortType) {
    case RepositorySortOption.MostStars:
      return { sort: "stars", order: "desc" };
    case RepositorySortOption.FewestStars:
      return { sort: "stars", order: "asc" };
    case RepositorySortOption.Newest:
      return { sort: "created", order: "desc" };
    case RepositorySortOption.Oldest:
      return { sort: "created", order: "asc" };
    case RepositorySortOption.RecentlyUpdated:
      return { sort: "updated", order: "desc" };
    case RepositorySortOption.LeastRecentlyUpdated:
      return { sort: "updated", order: "asc" };
    default:
      return {};
  }
}
