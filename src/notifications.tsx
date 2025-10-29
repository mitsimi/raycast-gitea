import { List, Icon } from "@raycast/api";
import { NotificationDropdown, NotificationMenu } from "./components/notifications";
import { NotificationSortTypes } from "./types/sorts/notification-search";
import { Fragment, useState } from "react";
import { useNotifications } from "./hooks";

export default function Command() {
  const [filter, setFilter] = useState<"unread" | "all">("unread");
  const { items, isLoading, mutate } = useNotifications(filter);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <NotificationDropdown
          notifyFilter={NotificationSortTypes}
          onFilterChange={(v) => setFilter(v as "unread" | "all")}
        />
      }
      throttle
    >
      {items.length <= 0 ? (
        <List.EmptyView icon={Icon.Tray} title="No unread notifications." />
      ) : (
        <Fragment>
          <List.Section>
            <NotificationMenu items={items.filter((v) => v.pinned)} mutate={mutate} />
          </List.Section>
          <List.Section>
            <NotificationMenu items={items.filter((v) => !v.pinned)} mutate={mutate} />
          </List.Section>
        </Fragment>
      )}
    </List>
  );
}
