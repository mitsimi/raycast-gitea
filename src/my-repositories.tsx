import { Color, Icon, List } from "@raycast/api";
import { RepositoryDropdown, RepositoryActions } from "./components/repositories";
import { useCachedState } from "@raycast/utils";
import { RepositorySortOption, RepositorySortTypes } from "./types/sorts/repository-search";
import { useUserRepositories } from "./hooks/useUserRepositories";
import dayjs from "dayjs";
import type { Repository } from "./types/api";

import RepositoryDetails from "./components/repositories/repository-details";
import { useState } from "react";
import { getLanguageColor } from "./utils/languages";

export default function Command() {
  const [sort, setSort] = useCachedState<RepositorySortOption>(RepositorySortOption.RecentlyUpdated);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const { items, isLoading } = useUserRepositories(sort);

  return (
    <List
      isLoading={isLoading}
      isShowingDetail={showDetails}
      searchBarAccessory={
        <RepositoryDropdown
          repoFilter={RepositorySortTypes}
          onFilterChange={(newValue: string) => setSort(newValue as RepositorySortOption)}
        />
      }
      throttle
    >
      {items.map((item) => (
        <List.Item
          key={item.id ?? item.full_name ?? "repo"}
          icon={
            item.avatar_url ? { source: item.avatar_url } : { source: "icon/repo.svg", tintColor: Color.PrimaryText }
          }
          title={item.full_name ?? ""}
          subtitle={item.description ?? ""}
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
      ))}
    </List>
  );
}

function getAccessoryByFilter(item: Repository, filter?: string): List.Item.Accessory {
  switch (filter) {
    case "most stars":
    case "fewest stars":
      return { icon: Icon.Star, text: { value: `${item.stars_count ?? 0}`, color: Color.SecondaryText } };
    case "newest":
    case "oldest":
      return item.created_at ? { icon: Icon.Calendar, date: dayjs(item.created_at).toDate() } : { icon: Icon.Calendar };
    case "recently":
    case "least recently":
      return item.updated_at ? { icon: Icon.Calendar, date: dayjs(item.updated_at).toDate() } : { icon: Icon.Calendar };
  }

  return {};
}
