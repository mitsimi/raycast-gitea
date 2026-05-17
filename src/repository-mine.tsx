import { List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { RepositoryDropdown, RepositoryList } from "./components/repositories";
import { useUserRepositories } from "./hooks/useUserRepositories";
import { RepositorySort, RepositorySortOptions } from "./domain/repository-sort";

import { useState } from "react";

export default function Command() {
  const [sort, setSort] = useCachedState<RepositorySort>(RepositorySort.RecentlyUpdated);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const { items, isLoading, pagination } = useUserRepositories(sort);

  return (
    <List
      isLoading={isLoading}
      isShowingDetail={showDetails}
      searchBarAccessory={
        <RepositoryDropdown repoFilter={RepositorySortOptions} onFilterChange={(newValue) => setSort(newValue)} />
      }
      pagination={pagination}
      throttle
    >
      <RepositoryList items={items} sort={sort} showDetails={showDetails} setShowDetails={setShowDetails} />
    </List>
  );
}
