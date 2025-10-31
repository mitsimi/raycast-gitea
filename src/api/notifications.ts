import { getClient } from "./client";
import type { Notification } from "../types/notification";

export type ListNotificationParams = { limit?: number; all?: boolean; page?: number };
export async function listNotifications(params: ListNotificationParams = {}) {
  const client = getClient();
  const { limit = 20, all = false, page } = params;
  return client.get<Notification[]>("/notifications", { limit, all, ...(page ? { page } : {}) });
}

export enum StatusType {
  Read = "read",
  Unread = "unread",
  Pinned = "pinned",
}
export type UpdateNotificationsParams = { id: string; toStatus: StatusType };
export async function updateNotificationStatus(params: UpdateNotificationsParams) {
  const client = getClient();
  return client.patch<Notification>(
    `/notifications/threads/${params.id}?${new URLSearchParams({ "to-status": params.toStatus })}`,
  );
}

/**
 * Update the status of all notifications to read.
 * Defaults to filtering by unread status-type and setting to-status to read.
 */
export async function readAllNotificationStatus(...statusTypes: StatusType[]) {
  const client = getClient();
  return client.put<Notification[]>("/notifications", {
    "to-status": "read",
    ...(statusTypes.length > 0 ? { "status-type": statusTypes } : {}),
  });
}
