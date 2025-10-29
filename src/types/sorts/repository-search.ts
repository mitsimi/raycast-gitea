import dayjs from "dayjs";
import { Repository } from "../repository";
import { CommonOptionType } from "./common";

export const RepositorySortTypes: CommonOptionType[] = [
  { id: "1", name: "Most stars", value: "most stars" },
  { id: "2", name: "Fewest stars", value: "fewest stars" },
  { id: "3", name: "Newest", value: "newest" },
  { id: "4", name: "Oldest", value: "oldest" },
  { id: "5", name: "Recently updated", value: "recently" },
  { id: "6", name: "Least recently updated", value: "least recently" },
];

export function SortRepositories(list: Repository[], sortType: string): Repository[] {
  switch (sortType) {
    case "most stars":
      return list.toSorted((a: Repository, b: Repository) => b.stars_count - a.stars_count);
    case "fewest stars":
      return list.toSorted((a: Repository, b: Repository) => a.stars_count - b.stars_count);
    case "newest":
      return list.toSorted((a: Repository, b: Repository) =>
        dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1,
      );
    case "oldest":
      return list.toSorted((a: Repository, b: Repository) =>
        dayjs(a.created_at).isAfter(dayjs(b.created_at)) ? 1 : -1,
      );
    case "recently":
      return list.toSorted((a: Repository, b: Repository) =>
        dayjs(a.updated_at).isBefore(dayjs(b.updated_at)) ? 1 : -1,
      );
    case "least recently":
      return list.toSorted((a: Repository, b: Repository) =>
        dayjs(a.updated_at).isAfter(dayjs(b.updated_at)) ? 1 : -1,
      );
    default:
      return list;
  }
}

export type GiteaRepositorySort = { sort?: string; order?: "asc" | "desc" };
export function mapRepositorySortToGitea(sortType: string): GiteaRepositorySort {
  switch (sortType) {
    case "most stars":
      return { sort: "stars", order: "desc" };
    case "fewest stars":
      return { sort: "stars", order: "asc" };
    case "newest":
      return { sort: "created", order: "desc" };
    case "oldest":
      return { sort: "created", order: "asc" };
    case "recently":
      return { sort: "updated", order: "desc" };
    case "least recently":
      return { sort: "updated", order: "asc" };
    default:
      return {};
  }
}
