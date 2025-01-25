import { Detail, getPreferenceValues, List, Toast } from "@raycast/api";
import RepositorynMenu from "./components/repository-menu";
import { showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import { Repository } from "./interfaces/repository";
import { apiBaseUrl } from "./common/global";

export default function Command() {
  const [repositories, setRepository] = useCachedState<Repository[]>("repositories", []);
  const [filter, setFilter] = useCachedState<string>("repositories-filter", "all");
  const onFilterChange = (newValue: string) => {
    setFilter(newValue);
  };

  const { serverUrl, accessToken } = getPreferenceValues<{ serverUrl: string; accessToken: string }>();
  const repoUrl = serverUrl + apiBaseUrl + `/user/repos?token=${accessToken}&page=${1}&limit=${20}`;

  // TODO: Make proper use of pagination
  const { isLoading, pagination, mutate } = useFetch(repoUrl, {
    initialData: [],
    keepPreviousData: true,
    onError() {
      showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retreive repositories" });
    },
    onData(data) {
      Array.isArray(data) ? setRepository(data) : null;
    },
  });

  return (
    <List isLoading={isLoading} pagination={pagination} throttle>
      <RepositorynMenu items={repositories} mutate={mutate} />
    </List>
  );
}
