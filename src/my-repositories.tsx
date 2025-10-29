import { Action, Color, Icon, List } from "@raycast/api";
import { RepositoryDropdown, RepositoryActions } from "./components/repositories";
import { useCachedState } from "@raycast/utils";
import { RepositorySortOption, RepositorySortTypes } from "./types/sorts/repository-search";
import { useUserRepositories } from "./hooks/useUserRepositories";
import dayjs from "dayjs";
import { Repository } from "./types/repository";

import GitHubColors from "./utils/colors";
import RepositoryDetails from "./components/repositories/repository-details";
import { useState } from "react";

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
          key={item.id}
          icon={item.avatar_url ? { source: item.avatar_url } : { source: "repo.svg", tintColor: Color.PrimaryText }}
          title={item.full_name}
          subtitle={item.description}
          detail={<RepositoryDetails repo={item} />}
          actions={
            <RepositoryActions item={item}>
              <Action
                title={showDetails ? "Hide Details" : "Show Details"}
                icon={showDetails ? Icon.EyeDisabled : Icon.Eye}
                shortcut={{
                  macOS: { modifiers: ["cmd", "shift"], key: "x" },
                  windows: { modifiers: ["ctrl", "shift"], key: "x" },
                }}
                onAction={() => setShowDetails(!showDetails)}
              />
            </RepositoryActions>
          }
          accessories={
            showDetails
              ? []
              : ([
                  ...(item.language
                    ? [{ tag: { value: item.language, color: GitHubColors.get(item.language, true)?.color } }]
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
        date: dayjs(item.updated_at).toDate(),
      };
  }

  return {};
}
