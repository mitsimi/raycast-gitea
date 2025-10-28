import { List, Toast } from "@raycast/api";
import RepositoryMenu from "./components/repository-menu";
import { showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import { Repository } from "./interfaces/repository";
import { APIBuilder } from "./common/api";
import { useMemo, useState } from "react";
import { RepositorySortTypes, SortRepositories } from "./types/repository-search";
import RepositoryDropdown from "./components/repository-dropdown";

export default function Command() {
  const [repositories, setRepository] = useCachedState<Repository[]>("my-repositories", []);
  const [sort, setSort] = useState<string>("least recently");

  const repoUrl = new APIBuilder().setPath(`/user/repos`).build();
  const { isLoading } = useFetch(repoUrl, {
    initialData: [],
    keepPreviousData: true,
    onError() {
      showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retrieve repositories" });
    },
    onData(data) {
      if (Array.isArray(data)) {
        setRepository(data as Repository[]);
      }
    },
  });

  const filteredRepos = repositories.filter((repo) => repo.owner.username == "mitsimi");

  const sortedRepos = useMemo(() => SortRepositories(filteredRepos, sort), [filteredRepos, sort]);

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
