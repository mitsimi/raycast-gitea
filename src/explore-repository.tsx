import { List, Toast } from "@raycast/api";
import RepositorynMenu from "./components/repository-menu";
import { showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import { Repository } from "./interfaces/repository";
import { APIBuilder } from "./common/api";
import RepositoryDropdown from "./components/repository-dropdown";
import { RepositorySortTypes, SortRepositories } from "./types/repository-search";

export default function Command() {
  const [repositories, setRepository] = useCachedState<Repository[]>("repositories", []);
  const [filter, setFilter] = useCachedState<string>("repositories-filter", "most stars");
  const onFilterChange = (newValue: string) => {
    setFilter(newValue);
  };

  const repoUrl = new APIBuilder().setPath(`/user/repos`).build();

  const { isLoading } = useFetch(repoUrl, {
    initialData: [],
    keepPreviousData: true,
    onError() {
      showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retrieve repositories" });
    },
    onData(data) {
      Array.isArray(data) ? setRepository(data as Repository[]) : null;
    },
  });

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<RepositoryDropdown repoFilter={RepositorySortTypes} onFilterChange={onFilterChange} />}
      throttle
    >
      <RepositorynMenu items={SortRepositories(repositories, filter)} />
    </List>
  );
}
