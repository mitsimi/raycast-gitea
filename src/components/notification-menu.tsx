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
          item.pinned ? { icon: Icon.Tack } : {},
          { text: { value: item.subject.type, color: Color.PrimaryText } },
          { text: { value: "#" + getLastStr(item.subject.html_url), color: Color.SecondaryText } },
          //{ text: `[${item.id}]` },
        ]}
        actions={<NotificationActions item={item} mutate={props.mutate} />}
      />
    );
  });
}
