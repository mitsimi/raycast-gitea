import { Color, Icon, List } from "@raycast/api";
import { Repository } from "../../types/repository";
import RepositoryActions from "./repository-actions";
import GitHubColors from "../../utils/colors";
import dayjs from "dayjs";

export default function RepositoryMenu(props: { items: Repository[]; currentFilter?: string }) {
  return props.items.map((item) => {
    return (
      <List.Item
        key={item.id}
        icon={item.avatar_url ? { source: item.avatar_url } : { source: "repo.svg", tintColor: Color.PrimaryText }}
        title={item.full_name}
        subtitle={item.description}
        actions={<RepositoryActions item={item} />}
        accessories={
          [
            ...(item.language
              ? [{ tag: { value: item.language, color: GitHubColors.get(item.language, true)?.color } }]
              : []),
            getAccessoryByFilter(item, props.currentFilter),
          ] as List.Item.Accessory[]
        }
      />
    );
  });
}

function getAccessoryByFilter(item: Repository, filter?: string): List.Item.Accessory {
  switch (filter) {
    case "most stars":
    case "fewest stars":
      return { icon: Icon.Star, text: { value: `${item.stars_count}`, color: Color.SecondaryText } };
    case "newest":
    case "oldest":
      return {
        icon: Icon.Calendar,
        date: dayjs(item.created_at).toDate(),
      };
    case "recently":
    case "least recently":
      return {
        icon: Icon.Calendar,
        date: dayjs(item.created_at).toDate(),
      };
  }

  return {};
}
