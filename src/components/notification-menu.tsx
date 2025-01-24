import { Color, Icon, List } from "@raycast/api";
import NotificationActions from "./notification-actions";
import { getLastStr } from "../common/utils";
import { Notification, NotifySubjectType } from "../interfaces/notification";
import { StateType } from "../interfaces/issue";

export default function NotificationMenu(props: { items: Notification[]; setNotifications }) {
  const { items, setNotifications } = props;

  return items.map((item) => {
    return (
      <List.Item
        key={item.id}
        icon={getIcon(item)}
        title={item.subject.title}
        subtitle={item.repository.full_name}
        accessories={[
          { text: { value: item.subject.type, color: Color.PrimaryText } },
          { text: "#" + getLastStr(item.subject.html_url) },
          item.pinned ? { icon: Icon.Tack } : {},
        ]}
        actions={<NotificationActions item={item} setNotifications={setNotifications} />}
      />
    );
  });
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
