import { Color, Icon, List } from "@raycast/api";
import NotificationActions from "./notification-actions";
import { getLastStr } from "../common/utils";
import { getNotificationIcon, Notification, NotifySubjectType } from "../interfaces/notification";
import { StateType } from "../interfaces/issue";

export default function NotificationMenu(props: {
  items: Notification[];
  setNotifications: (newNotifications: Notification[]) => void;
}) {
  return props.items.map((item) => {
    return (
      <List.Item
        key={item.id}
        icon={getNotificationIcon(item)}
        title={item.subject.title}
        subtitle={item.repository.full_name}
        accessories={[
          { text: { value: item.subject.type, color: Color.PrimaryText } },
          { text: "#" + getLastStr(item.subject.html_url) },
          item.pinned ? { icon: Icon.Tack } : {},
        ]}
        actions={<NotificationActions item={item} setNotifications={props.setNotifications} />}
      />
    );
  });
}
