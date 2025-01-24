import { Action, ActionPanel, getPreferenceValues, Icon, showToast, Toast } from "@raycast/api";
import { Notification } from "../interfaces/notification";
import { apiBaseUrl } from "../common/global";
import { useFetch } from "@raycast/utils";

export default function NotificationActions(props: { item: Notification }) {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action.OpenInBrowser title="Open Repository" url={props.item.subject.html_url} />
        <Action.CopyToClipboard title="Copy URL to Clipboard" content={props.item.subject.html_url} />
      </ActionPanel.Section>

      <ActionPanel.Section>
        <Action
          title={props.item.unread ? "Mark as Read" : "Mark as Unread"}
          icon={Icon.Eye}
          shortcut={{ modifiers: ["ctrl"], key: "r" }}
          onAction={() => markAsRead(props.item)}
        />
        <Action
          title={props.item.unread ? "Pin Notification" : "Unpin Notification"}
          icon={Icon.Pin}
          shortcut={{ modifiers: ["ctrl"], key: "p" }}
          //onAction={() => pinNotification(item)}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

function markAsRead(item: Notification) {
  const { serverUrl, accessToken } = getPreferenceValues<{ serverUrl: string; accessToken: string }>();
  const notifyUrl = serverUrl + apiBaseUrl + `/notifications/threads/${item.id}?token=${accessToken}`;

  showToast({ style: Toast.Style.Animated, title: "Marking notification as read" });

  console.log("MARKING READ");
  console.log(
    useFetch<Notification[]>(notifyUrl, {
      method: "PATCH",
    }),
  );
}
