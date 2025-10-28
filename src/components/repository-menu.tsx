import { Color, Icon, List } from "@raycast/api";
import { Repository } from "../interfaces/repository";
import RepositoryActions from "./repository-actions";
import dayjs from "dayjs";

export default function RepositorynMenu(props: { items: Repository[]; currentFilter?: string }) {
  return props.items.map((item) => {
    return (
      <List.Item
        key={item.id}
        icon={item.avatar_url ? { source: item.avatar_url } : { source: "repo.svg", tintColor: Color.PrimaryText }}
        title={item.full_name}
        subtitle={item.description}
        actions={<RepositoryActions item={item} />}
        accessories={[
          { text: { value: item.language, color: Color.PrimaryText } },
          getAccessoryByFilter(item, props.currentFilter),
        ]}
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
        text: { value: `${dayjs(item.created_at).format("DD/MM/YYYY")}`, color: Color.SecondaryText },
      };
    case "recently":
    case "least recently":
      return {
        icon: Icon.Calendar,
        text: { value: `${dayjs(item.updated_at).format("DD/MM/YYYY")}`, color: Color.SecondaryText },
      };
  }

  return {};
}
