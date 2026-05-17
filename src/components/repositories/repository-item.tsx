import { Color, Icon, List } from "@raycast/api";
import type { Repository } from "../../types/api";
import RepositoryDetails from "./repository-details";
import RepositoryActions from "./repository-actions";
import { getLanguageColor } from "../../utils/languages";
import { RepositorySort } from "../../domain/repository-sort";

export default function RepositoryItem(props: {
  item: Repository;
  sort: RepositorySort | undefined;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
}) {
  const item = props.item;
  const showDetails = props.showDetails;
  const setShowDetails = props.setShowDetails;
  const sort = props.sort;

  return (
    <List.Item
      icon={item.avatar_url ? { source: item.avatar_url } : { source: "icon/repo.svg", tintColor: Color.PrimaryText }}
      title={item.full_name || "[No Name]"}
      subtitle={item.description || ""}
      detail={<RepositoryDetails repo={item} />}
      actions={<RepositoryActions item={item} showDetails={showDetails} setShowDetails={setShowDetails} />}
      accessories={
        showDetails
          ? []
          : ([
              ...(item.language
                ? [{ tag: { value: item.language, color: getLanguageColor(item.language, true) } }]
                : []),
              getAccessoryByFilter(item, sort),
            ] as List.Item.Accessory[])
      }
    />
  );
}

function getAccessoryByFilter(item: Repository, filter?: RepositorySort): List.Item.Accessory {
  switch (filter) {
    case RepositorySort.MostStars:
    case RepositorySort.FewestStars:
      return { icon: Icon.Star, text: { value: `${item.stars_count ?? 0}`, color: Color.SecondaryText } };
    case RepositorySort.Newest:
    case RepositorySort.Oldest:
      return item.created_at ? { icon: Icon.Calendar, date: new Date(item.created_at) } : { icon: Icon.Calendar };
    case RepositorySort.RecentlyUpdated:
    case RepositorySort.LeastRecentlyUpdated:
      return item.updated_at ? { icon: Icon.Calendar, date: new Date(item.updated_at) } : { icon: Icon.Calendar };
  }

  return {};
}
