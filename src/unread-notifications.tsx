import { Color, List, getPreferenceValues, Icon, Toast } from "@raycast/api";
import { apiBaseUrl } from "./common/global";
import { Notification, NotificationFilter, NotifySubjectType } from "./interfaces/notification";
import { showFailureToast, useCachedState, useFetch } from "@raycast/utils";
import { StateType } from "./interfaces/issue";
import { getLastStr } from "./common/utils";
import NotificationActions from "./components/NotificationActions";
import NotificationDropdown from "./components/NotificationDropdown";

export default function Command() {
  const [notifications, setNotifications] = useCachedState<Notification[]>("notifications", []);
  const [filter, setFilter] = useCachedState<NotificationFilter>("notifications-filter", NotificationFilter.Unread);
  const onFilterChange = (newValue: NotificationFilter) => {
    setFilter(newValue);
  };

  const { serverUrl, accessToken } = getPreferenceValues<{ serverUrl: string; accessToken: string }>();
  const notifyUrl =
    serverUrl +
    apiBaseUrl +
    `/notifications?token=${accessToken}&limit=20&all=${filter == NotificationFilter.Unread ? "false" : "true"}`;

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
      searchBarAccessory={
        <NotificationDropdown
          notifyFilter={[NotificationFilter.Unread, NotificationFilter.All]}
          onFilterChange={onFilterChange}
        />
      }
      throttle
    >
      {notifications.map((item) => {
        return (
          <List.Item
            key={item.id}
            icon={getIcon(item)}
            title={item.subject.title}
            subtitle={item.repository.full_name}
            accessories={[
              { text: { value: item.subject.type, color: Color.PrimaryText } },
              { text: "#" + getLastStr(item.subject.html_url) },
            ]}
            actions={<NotificationActions item={item} />}
          />
        );
      })}
    </List>
  );
}

function getIcon(notification: Notification) {
  switch (notification.subject.type) {
    case NotifySubjectType.Issue:
      switch (notification.subject.state) {
        case StateType.Open:
          return { source: "issue-open.svg", tintColor: Color.Green };
        case StateType.Closed:
          return { source: "issue-closed.svg", tintColor: Color.Red };
      }
      break;

    case NotifySubjectType.Pull:
      switch (notification.subject.state) {
        case StateType.Open:
          return notification.subject.title.startsWith("WIP")
            ? { source: "pr-draft.svg", tintColor: Color.SecondaryText }
            : { source: "pr-open.svg", tintColor: Color.Green };
        case StateType.Closed:
          return { source: "pr-open.svg", tintColor: Color.Red };
        case StateType.Merged:
          return { source: "pr-merged.svg", tintColor: Color.Purple };
      }
      break;
  }

  return { source: Icon.Bug, tintColor: Color.Red };
}

//function pinNotification(notification: Notification) {}
