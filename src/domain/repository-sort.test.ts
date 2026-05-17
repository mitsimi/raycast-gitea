import { describe, expect, it } from "vitest";
import type { Repository } from "../types/api";
import { RepositorySort, mapRepositorySortToGitea, sortRepositories } from "./repository-sort";
import { SortOrder } from "./options";

function repo(overrides: Partial<Repository>): Repository {
  return overrides as Repository;
}

describe("repository sort domain", () => {
  const repositories = [
    repo({ full_name: "b", stars_count: 2, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-03T00:00:00Z" }),
    repo({ full_name: "a", stars_count: 5, created_at: "2024-01-03T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }),
    repo({ full_name: "c", stars_count: 1, created_at: "2024-01-02T00:00:00Z", updated_at: "2024-01-02T00:00:00Z" }),
  ];

  it("sorts repositories by stars", () => {
    expect(sortRepositories(repositories, RepositorySort.MostStars).map((item) => item.full_name)).toEqual([
      "a",
      "b",
      "c",
    ]);
    expect(sortRepositories(repositories, RepositorySort.FewestStars).map((item) => item.full_name)).toEqual([
      "c",
      "b",
      "a",
    ]);
  });

  it("sorts repositories by creation and update timestamps", () => {
    expect(sortRepositories(repositories, RepositorySort.Newest).map((item) => item.full_name)).toEqual([
      "a",
      "c",
      "b",
    ]);
    expect(sortRepositories(repositories, RepositorySort.LeastRecentlyUpdated).map((item) => item.full_name)).toEqual([
      "a",
      "c",
      "b",
    ]);
  });

  it("maps UI sort options to Gitea query params", () => {
    expect(mapRepositorySortToGitea(RepositorySort.MostStars)).toEqual({
      sort: "stars",
      order: SortOrder.Descending,
    });
    expect(mapRepositorySortToGitea(RepositorySort.Oldest)).toEqual({
      sort: "created",
      order: SortOrder.Ascending,
    });
  });
});
