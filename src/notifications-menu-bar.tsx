import { MenuBarExtra, Icon, showToast, Toast, Color, open, launchCommand, LaunchType } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { listNotifications, readAllNotificationStatus } from "./api/notifications";
import { NotificationThread } from "./types/api";
import { getNotificationIcon } from "./utils/icons";

export default function MenuBarCommand() {
  const {
    data: notifications,
    isLoading,
    revalidate,
  } = useCachedPromise(() => listNotifications({ limit: 20, all: false }), []);

  const unreadCount = notifications?.length ?? 0;

  const handleMarkAllAsRead = async () => {
    try {
      await readAllNotificationStatus();
      revalidate();
    } catch {
      showToast({ style: Toast.Style.Failure, title: "Failed to mark all as read" });
    }
  };

  const handleOpenNotification = (item: NotificationThread) => {
    if (item.subject?.html_url) {
      open(item.subject.html_url);
    }
  };

  return (
    <MenuBarExtra
      icon={{
        source: "gitea-icon.png",
        tintColor: unreadCount > 0 ? Color.PrimaryText : Color.SecondaryText,
      }}
      isLoading={isLoading}
      title={unreadCount > 0 ? String(unreadCount) : undefined}
      tooltip={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
    >
      {unreadCount === 0 ? (
        <MenuBarExtra.Item title="No unread notifications" />
      ) : (
        <>
          <MenuBarExtra.Section>
            {notifications?.map((item) => (
              <MenuBarExtra.Item
                key={item.id}
                title={item.subject?.title ?? "(no title)"}
                subtitle={item.repository?.full_name}
                icon={getNotificationIcon(item)}
                onAction={() => handleOpenNotification(item)}
              />
            ))}
          </MenuBarExtra.Section>
          <MenuBarExtra.Section>
            <MenuBarExtra.Item title="Mark All as Read" icon={Icon.CheckCircle} onAction={handleMarkAllAsRead} />
            <MenuBarExtra.Item
              title="Open Notifications"
              icon={Icon.List}
              onAction={() => launchCommand({ name: "notifications", type: LaunchType.UserInitiated })}
            />
          </MenuBarExtra.Section>
        </>
      )}
    </MenuBarExtra>
  );
}
