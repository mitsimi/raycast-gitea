import { api } from "../api";
import type { ListNotificationParams } from "../api/notifications";
import type { PaginatedResult } from ".";
import type { NotificationThread } from "../types/api";

export async function getNotifications(
  params: ListNotificationParams = {},
): Promise<PaginatedResult<NotificationThread>> {
  const items = await api.notifications.list(params);
  return { items, hasMore: typeof params.limit === "number" && items.length === params.limit };
}
