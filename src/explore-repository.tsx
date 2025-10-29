import { List } from "@raycast/api";
import { RepositoryMenu, RepositoryDropdown } from "./components/repositories";
import { RepositorySortTypes, mapRepositorySortToGitea } from "./types/sorts/repository-search";
import { useState, useMemo } from "react";
import { useRepositories } from "./hooks/useRepositories";

export default function Command() {
  const [sort, setSort] = useState<string>("most stars");

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
        <RepositoryDropdown repoFilter={RepositorySortTypes} onFilterChange={(newValue: string) => setSort(newValue)} />
      }
      pagination={pagination}
      throttle
    >
      <RepositoryMenu items={items} currentFilter={sort} />
    </List>
  );
}
