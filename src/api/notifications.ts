import { getClient } from "./client";
import type { NotificationThread } from "../types/api";

export type ListNotificationParams = { limit?: number; all?: boolean; page?: number };
export async function listNotifications(params: ListNotificationParams = {}): Promise<NotificationThread[]> {
  const client = getClient();
  const { limit = 20, all = false, page } = params;
  const { data } = await client.rest.notification.notifyGetList({ limit, all, ...(page ? { page } : {}) });
  return data;
}

export enum StatusType {
  Read = "read",
  Unread = "unread",
  Pinned = "pinned",
}
export type UpdateNotificationsParams = { id: string; toStatus: StatusType };
export async function updateNotificationStatus(
  params: UpdateNotificationsParams,
): Promise<NotificationThread | undefined> {
  const client = getClient();
  await client.rest.notification.notifyReadThread({ id: params.id, "to-status": params.toStatus });
  return undefined;
}

/**
 * Update the status of all notifications to read.
 * Defaults to filtering by unread status-type and setting to-status to read.
 */
export async function readAllNotificationStatus(...statusTypes: StatusType[]) {
  const client = getClient();
  await client.rest.notification.notifyReadList({
    "to-status": "read",
    ...(statusTypes.length > 0 ? { "status-types": statusTypes } : {}),
  });
  return [];
}
