import { listNotifications, type ListNotificationParams } from "../api/notifications";
import type { PaginatedResult } from "../api/common";
import type { NotificationThread } from "../types/api";

export async function getNotifications(
  params: ListNotificationParams = {},
): Promise<PaginatedResult<NotificationThread>> {
  const items = await listNotifications(params);
  return { items, hasMore: typeof params.limit === "number" && items.length === params.limit };
}
