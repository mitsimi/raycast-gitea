import { List, Toast } from "@raycast/api";
import { showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import { Repository, RepositorySearchResponse } from "./types/repository";
import { APIBuilder } from "./common/api";
import { RepositoryMenu, RepositoryDropdown } from "./components/repositories";
import { RepositorySortTypes, SortRepositories } from "./types/sorts/repository-search";
import { useMemo, useState } from "react";

export default function Command() {
  const [repositories, setRepository] = useCachedState<Repository[]>("repositories", []);
  const [sort, setSort] = useState<string>("most stars");

  const repoUrl = new APIBuilder().setPath(`/repos/search`).build();
  const { isLoading } = useFetch(repoUrl, {
    initialData: [],
    keepPreviousData: true,
    onError() {
      showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retrieve repositories" });
    },
    onData(data) {
      const resp = data as RepositorySearchResponse;
      if (Array.isArray(resp.data)) {
        setRepository(resp.data as Repository[]);
      }
    },
  });

  const sortedRepos = useMemo(() => SortRepositories(repositories, sort), [repositories, sort]);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <RepositoryDropdown repoFilter={RepositorySortTypes} onFilterChange={(newValue: string) => setSort(newValue)} />
      }
      throttle
    >
      <RepositoryMenu items={sortedRepos} currentFilter={sort} />
    </List>
  );
}
