import { Action, ActionPanel, Icon, showToast, Toast } from "@raycast/api";
import { Notification } from "../../interfaces/notification";
import { updateNotificationStatus } from "../../api/notifications";
import { MutatePromise } from "@raycast/utils";

export default function NotificationActions(props: {
  item: Notification;
  mutate?: MutatePromise<Notification[], Notification[]>;
}) {
  const markAsRead = async () => {
    let toStatus: "read" | "unread" = props.item.unread ? "read" : "unread";
    if (props.item.pinned) toStatus = "read";
    const toast = await showToast({ style: Toast.Style.Animated, title: "Updating..." });
    try {
      await props.mutate?.(updateNotificationStatus(props.item.id, toStatus), { shouldRevalidateAfter: true });
      toast.style = Toast.Style.Success;
      toast.title = `Marked as ${toStatus}`;
    } catch (err: unknown) {
      toast.style = Toast.Style.Failure;
      toast.title = `Could not mark as ${toStatus}`;
      toast.message = err instanceof Error ? err.message : String(err);
    }
  };

  const pinNotification = async () => {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Updating..." });
    try {
      await props.mutate?.(updateNotificationStatus(props.item.id, "pinned"), { shouldRevalidateAfter: true });
      toast.style = Toast.Style.Success;
      toast.title = `${props.item.pinned ? "Unpinned" : "Pinned"} notification`;
    } catch (err: unknown) {
      toast.style = Toast.Style.Failure;
      toast.title = `Could not ${props.item.pinned ? "unpin" : "pin"} notification`;
      toast.message = err instanceof Error ? err.message : String(err);
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
          title={props.item.unread || props.item.pinned ? "Mark as Read" : "Mark as Unread"}
          icon={props.item.unread ? Icon.Eye : Icon.EyeDisabled}
          shortcut={{ modifiers: ["ctrl"], key: "r" }}
          onAction={markAsRead}
        />
        {!props.item.pinned ? (
          <Action
            title="Pin Notification"
            icon={Icon.Pin}
            shortcut={{ modifiers: ["ctrl"], key: "p" }}
            onAction={pinNotification}
          />
        ) : null}
      </ActionPanel.Section>
    </ActionPanel>
  );
}
