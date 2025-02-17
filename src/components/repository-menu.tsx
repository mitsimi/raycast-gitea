import { Color, Icon, List } from "@raycast/api";
import { Repository } from "../interfaces/repository";
import RepositoryActions from "./repository-actions";

export default function RepositorynMenu(props: { items: Repository[] }) {
  return props.items.map((item) => {
    return (
      <List.Item
        key={item.id}
        icon={item.avatar_url ? { source: item.avatar_url } : { source: "repo.svg", tintColor: Color.PrimaryText }}
        title={item.full_name}
        subtitle={item.updated_at}
        actions={<RepositoryActions item={item} />}
        accessories={[
          { text: { value: item.language, color: Color.PrimaryText } },
          { icon: Icon.Star, text: { value: `${item.stars_count}`, color: Color.SecondaryText } },
        ]}
      />
    );
  });
}
