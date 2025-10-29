import { List } from "@raycast/api";
import { RepositoryMenu, RepositoryDropdown } from "./components/repositories";
import { RepositorySortTypes, RepositorySortOption, mapRepositorySortToGitea } from "./types/sorts/repository-search";
import { useMemo } from "react";
import { useRepositories } from "./hooks/useRepositories";
import { useCachedState } from "@raycast/utils";

export default function Command() {
  const [sort, setSort] = useCachedState<RepositorySortOption>(RepositorySortOption.MostStars);

  const { giteaSort, giteaOrder } = useMemo(() => {
    const mapped = mapRepositorySortToGitea(sort);
    return { giteaSort: mapped.sort, giteaOrder: mapped.order } as {
      giteaSort: string | undefined;
      giteaOrder: "asc" | "desc" | undefined;
    };
  }, [sort]);

  const { items, isLoading, pagination } = useRepositories(giteaSort, giteaOrder);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <RepositoryDropdown
          repoFilter={RepositorySortTypes}
          onFilterChange={(newValue: string) => setSort(newValue as RepositorySortOption)}
        />
      }
      pagination={pagination}
      throttle
    >
      <RepositoryMenu items={items} currentFilter={sort} />
    </List>
  );
}
