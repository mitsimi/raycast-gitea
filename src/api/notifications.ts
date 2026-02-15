import { getClient } from "./client";
import type { NotificationThread } from "../types/api";

export type ListNotificationParams = { limit?: number; all?: boolean; page?: number };
export async function listNotifications(params: ListNotificationParams = {}): Promise<NotificationThread[]> {
  const client = getClient();
  const { limit = 20, all = false, page } = params;
  const { data, error } = await client.GET("/notifications", {
    params: { query: { limit, all, ...(page ? { page } : {}) } },
  });
  if (error) throw new Error("Failed to fetch notifications");
  return data ?? [];
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
  const { data, error } = await client.PATCH("/notifications/threads/{id}", {
    params: { path: { id: params.id }, query: { "to-status": params.toStatus } },
  });
  if (error) throw new Error("Failed to update notification status");
  return data;
}

/**
 * Update the status of all notifications to read.
 * Defaults to filtering by unread status-type and setting to-status to read.
 */
export async function readAllNotificationStatus(...statusTypes: StatusType[]) {
  const client = getClient();
  const { data, error } = await client.PUT("/notifications", {
    params: {
      query: {
        "to-status": "read",
        ...(statusTypes.length > 0 ? { "status-types": statusTypes } : {}),
      },
    },
  });
  if (error) throw new Error("Failed to update notifications");
  return data ?? [];
}
