import { List } from "@raycast/api";
import { RepositoryMenu, RepositoryDropdown } from "./components/repositories";
import { useCachedState } from "@raycast/utils";
import { RepositorySortOption, RepositorySortTypes } from "./types/sorts/repository-search";
import { useUserRepositories } from "./hooks/useUserRepositories";

export default function Command() {
  const [sort, setSort] = useCachedState<RepositorySortOption>(RepositorySortOption.RecentlyUpdated);

  const { items, isLoading } = useUserRepositories(sort);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <RepositoryDropdown
          repoFilter={RepositorySortTypes}
          onFilterChange={(v: string) => setSort(v as RepositorySortOption)}
        />
      }
      throttle
    >
      <RepositoryMenu items={items} currentFilter={sort} />
    </List>
  );
}
