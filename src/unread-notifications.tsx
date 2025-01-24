import { Color, List, getPreferenceValues, Icon, Toast } from "@raycast/api";
import { apiBaseUrl } from "./common/global";
import { Notification, NotifySubjectType } from "./interfaces/notification";
import { showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import { StateType } from "./interfaces/issue";
import { getLastStr } from "./common/utils";
import NotificationActions from "./components/notification-actions";
import NotificationDropdown from "./components/notification-dropdown";
import { notificationSortTypes } from "./types/notification-search";
import NotificationMenu from "./components/notification-menu";
import { Fragment } from "react/jsx-runtime";

export default function Command() {
  const [notifications, setNotifications] = useCachedState<Notification[]>("notifications", []);
  const [filter, setFilter] = useCachedState<string>("notifications-filter", "unread");
  const onFilterChange = (newValue: string) => {
    setFilter(newValue);
  };

  const { serverUrl, accessToken } = getPreferenceValues<{ serverUrl: string; accessToken: string }>();
  const notifyUrl =
    serverUrl +
    apiBaseUrl +
    `/notifications?token=${accessToken}&limit=20&all=${filter == "unread" ? "false" : "true"}`;

  const { isLoading } = useFetch(notifyUrl, {
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
      searchBarAccessory={<NotificationDropdown notifyFilter={notificationSortTypes} onFilterChange={onFilterChange} />}
      throttle
    >
      {notifications.length === 0 ? (
        <List.EmptyView icon={{ source: "https://placekitten.com/500/500" }} title="You have no new notifications" />
      ) : (
        <NotificationPanel notifications={notifications} setNotifications={setNotifications} />
      )}
    </List>
  );
}

function NotificationPanel(props: { notifications: Notification[]; setNotifications }) {
  return props.notifications.find((value) => value.pinned) ? (
    <Fragment>
      <List.Section>
        <NotificationMenu
          items={props.notifications.filter((value) => value.pinned)}
          setNotifications={props.setNotifications}
        />
      </List.Section>
      <List.Section>
        <NotificationMenu
          items={props.notifications.filter((value) => !value.pinned)}
          setNotifications={props.setNotifications}
        />
      </List.Section>
    </Fragment>
  ) : (
    <NotificationMenu items={props.notifications} setNotifications={props.setNotifications} />
  );
}
