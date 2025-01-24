import { Color, Icon, List } from "@raycast/api";
import NotificationActions from "./notification-actions";
import { getLastStr } from "../common/utils";
import { getNotificationIcon, Notification } from "../interfaces/notification";
import { MutatePromise } from "@raycast/utils";

export default function NotificationMenu(props: { items: Notification[]; mutate: MutatePromise<unknown, unknown> }) {
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
          //{ text: `[${item.id}]` },
          item.pinned ? { icon: Icon.Tack } : {},
        ]}
        actions={<NotificationActions item={item} mutate={props.mutate} />}
      />
    );
  });
}
