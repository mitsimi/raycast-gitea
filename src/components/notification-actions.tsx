import { Action, ActionPanel, Icon, showToast, Toast } from "@raycast/api";
import { Notification } from "../interfaces/notification";
import fetch from "node-fetch";
import { MutatePromise } from "@raycast/utils";
import { APIBuilder } from "../common/api";

export default function NotificationActions(props: { item: Notification; mutate: MutatePromise<unknown, unknown> }) {
  const markAsRead = async () => {
    let toStatus = props.item.unread ? "read" : "unread";

    if (props.item.pinned) toStatus = "read";

    const notifyUrl = new APIBuilder()
      .setPath(`/notifications/threads/${props.item.id}`)
      .setQueryArg("to-status", toStatus)
      .build();

    const toast = await showToast({ style: Toast.Style.Animated, title: "Marking notification as read" });
    try {
      await props.mutate(
        fetch(notifyUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      toast.style = Toast.Style.Success;
      toast.title = `Marked as ${toStatus}`;
    } catch (err: unknown) {
      toast.style = Toast.Style.Failure;
      toast.title = `Could not mark as ${toStatus}`;
      toast.message = err instanceof Error ? err.message : String(err);
    }
  };

  const pinNotification = async () => {
    const toStatus = props.item.pinned ? "unread" : "pinned";

    const notifyUrl = new APIBuilder()
      .setPath(`/notifications/threads/${props.item.id}`)
      .setQueryArg("to-status", toStatus)
      .build();

    const toast = await showToast({ style: Toast.Style.Animated, title: "Marking notification as read" });
    try {
      await props.mutate(
        fetch(notifyUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        { shouldRevalidateAfter: true },
      );

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
          title={props.item.unread ? "Mark as Read" : "Mark as Unread"}
          icon={Icon.Eye}
          shortcut={{ modifiers: ["ctrl"], key: "r" }}
          onAction={markAsRead}
        />
        <Action
          title={props.item.unread ? "Pin Notification" : "Unpin Notification"}
          icon={Icon.Pin}
          shortcut={{ modifiers: ["ctrl"], key: "p" }}
          onAction={pinNotification}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}
