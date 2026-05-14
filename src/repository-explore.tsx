import { List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useMemo, useState } from "react";
import { RepositoryDropdown, RepositoryList } from "./components/repositories";
import { useRepositories } from "./hooks/useRepositories";
import { RepositorySortOption, RepositorySortTypes, mapRepositorySortToGitea } from "./types/sorts/repository-search";

export default function Command() {
  const [sort, setSort] = useCachedState<RepositorySortOption>(RepositorySortOption.MostStars);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const { giteaSort, giteaOrder } = useMemo(() => {
    const mapped = mapRepositorySortToGitea(sort as RepositorySortOption);
    return { giteaSort: mapped.sort, giteaOrder: mapped.order } as {
      giteaSort: string | undefined;
      giteaOrder: "asc" | "desc" | undefined;
    };
  }, [sort]);

  const { items, isLoading, pagination } = useRepositories(giteaSort, giteaOrder);

  return (
    <List
      isLoading={isLoading}
      isShowingDetail={showDetails}
      searchBarAccessory={
        <RepositoryDropdown
          repoFilter={RepositorySortTypes}
          onFilterChange={(newValue: string) => setSort(newValue as RepositorySortOption)}
        />
      }
      pagination={pagination}
      throttle
    >
      <RepositoryList items={items} sort={sort} showDetails={showDetails} setShowDetails={setShowDetails} />
    </List>
  );
}
