import { List, Toast, Icon } from "@raycast/api";
import { Notification } from "./interfaces/notification";
import { MutatePromise, showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import NotificationDropdown from "./components/notification-dropdown";
import { NotificationSortTypes } from "./types/notification-search";
import NotificationMenu from "./components/notification-menu";
import { APIBuilder } from "./common/api";
import { Fragment } from "react/jsx-runtime";

export default function Command() {
  const [notifications, setNotifications] = useCachedState<Notification[]>("notifications", []);
  const [filter, setFilter] = useCachedState<string>("notifications-filter", "unread");
  const onFilterChange = (newValue: string) => {
    setFilter(newValue);
  };

  const notifyUrl = new APIBuilder()
    .setPath(`/notifications`)
    .setQueryArg("limit", "20")
    .setQueryArg("all", filter == "unread" ? "false" : "true")
    .build();

  const { isLoading, mutate } = useFetch(notifyUrl, {
    initialData: [],
    keepPreviousData: true,
    onError() {
      showFailureToast({ style: Toast.Style.Failure, title: "Couldn't retreive notifications" });
    },
    onData(data) {
      Array.isArray(data) ? setNotifications(data) : null;
    },
  });

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={<NotificationDropdown notifyFilter={NotificationSortTypes} onFilterChange={onFilterChange} />}
      throttle
    >
      {notifications.length <= 0 ? (
        <List.EmptyView icon={Icon.Tray} title="No unread notifications." />
      ) : (
        <Fragment>
          <NotificationMenu items={notifications.filter((value) => value.pinned)} mutate={mutate} />
          <NotificationMenu items={notifications.filter((value) => !value.pinned)} mutate={mutate} />
        </Fragment>
      )}
    </List>
  );
}
