import { Action, Color, Icon, List } from "@raycast/api";
import { RepositoryDropdown, RepositoryActions } from "./components/repositories";
import { RepositorySortTypes, RepositorySortOption, mapRepositorySortToGitea } from "./types/sorts/repository-search";
import { useMemo, useState } from "react";
import { useRepositories } from "./hooks/useRepositories";
import { useCachedState } from "@raycast/utils";
import dayjs from "dayjs";
import { Repository } from "./types/repository";

import RepositoryDetails from "./components/repositories/repository-details";
import { getLanguageColor } from "./utils/languages";

export default function Command() {
  const [sort, setSort] = useCachedState<RepositorySortOption>(RepositorySortOption.MostStars);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const { giteaSort, giteaOrder } = useMemo(() => {
    const mapped = mapRepositorySortToGitea(sort as RepositorySortOption);
    return { giteaSort: mapped.sort, giteaOrder: mapped.order } as {
      giteaSort: string | undefined;
      giteaOrder: "asc" | "desc" | undefined;
    };
  }, [sort]);

  const { items, isLoading, pagination } = useRepositories(giteaSort, giteaOrder);

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
      pagination={pagination}
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
                  Windows: { modifiers: ["ctrl", "shift"], key: "x" },
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
