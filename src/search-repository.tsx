import { List, Toast } from "@raycast/api";
import RepositorynMenu from "./components/repository-menu";
import { showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import { Repository } from "./interfaces/repository";
import { APIBuilder } from "./common/api";

export default function Command() {
  const [repositories, setRepository] = useCachedState<Repository[]>("repositories", []);
  const [filter, setFilter] = useCachedState<string>("repositories-filter", "all");
  const onFilterChange = (newValue: string) => {
    setFilter(newValue);
  };

  const repoUrl = new APIBuilder().setPath(`/user/repos`).build();

  const { isLoading, mutate } = useFetch(repoUrl, {
    initialData: [],
    keepPreviousData: true,
    onError() {
      showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retreive repositories" });
    },
    onData(data) {
      Array.isArray(data) ? setRepository(data as Repository[]) : null;
    },
  });

  return (
    <List isLoading={isLoading} throttle>
      <RepositorynMenu items={repositories} mutate={mutate} />
    </List>
  );
}
