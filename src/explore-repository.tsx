import { List, Toast } from "@raycast/api";
import RepositorynMenu from "./components/repository-menu";
import { showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import { Repository, RepositorySearchResponse } from "./interfaces/repository";
import { APIBuilder } from "./common/api";
import RepositoryDropdown from "./components/repository-dropdown";
import { RepositorySortTypes, SortRepositories } from "./types/repository-search";
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
      <RepositorynMenu items={sortedRepos} currentFilter={sort} />
    </List>
  );
}
