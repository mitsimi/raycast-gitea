import { Action, ActionPanel, getPreferenceValues, Icon, showToast, Toast } from "@raycast/api";
import { Notification } from "../interfaces/notification";
import { apiBaseUrl } from "../common/global";
import fetch from "node-fetch";

export default function NotificationActions(props: {
  item: Notification;
  setNotifications: (newNotifications: Notification[]) => void;
}) {
  const markAsRead = async () => {
    const toStatus = props.item.unread ? "read" : "unread";

    const { serverUrl, accessToken } = getPreferenceValues<{ serverUrl: string; accessToken: string }>();
    const notifyUrl =
      serverUrl + apiBaseUrl + `/notifications/threads/${props.item.id}?token=${accessToken}&to-status=${toStatus}`;

    const toast = await showToast({ style: Toast.Style.Animated, title: "Marking notification as read" });
    try {
      let response = await fetch(notifyUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data: Notification[] = await response.json();
      props.setNotifications(data);

      toast.style = Toast.Style.Success;
      toast.title = `Marked as ${toStatus}`;
    } catch (err: any) {
      toast.style = Toast.Style.Failure;
      toast.title = `Could not mark as ${toStatus}`;
      toast.message = err.message;
    }
  };

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
          onAction={markAsRead}
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
