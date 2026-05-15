import type { PaginatedResult } from "./common";
import { getClient } from "./client";
import type { NotificationThread } from "../types/api";

export type ListNotificationParams = {
  all?: boolean;
  statusTypes?: string[];
  limit?: number;
  page?: number;
};
export async function listNotifications(params: ListNotificationParams = {}): Promise<NotificationThread[]> {
  const client = getClient();
  const { limit, all = false, page } = params;

  const requestParams = {
    all,
    ...(typeof limit === "number" ? { limit } : {}),
    ...(typeof page === "number" ? { page } : {}),
    ...(params.statusTypes ? { "status-types": params.statusTypes } : {}),
  };

  const { data } = await client.rest.notification.notifyGetList(requestParams);
  return data;
}

export async function getNotifications(
  params: ListNotificationParams = {},
): Promise<PaginatedResult<NotificationThread>> {
  const items = await listNotifications(params);
  return { items, hasMore: typeof params.limit === "number" && items.length === params.limit };
}

export const StatusType = {
  Read: "read",
  Unread: "unread",
  Pinned: "pinned",
} as const;
export type StatusType = (typeof StatusType)[keyof typeof StatusType];
export type UpdateNotificationsParams = { id: string; toStatus: StatusType };
export async function updateNotificationStatus(params: UpdateNotificationsParams): Promise<void> {
  const client = getClient();

  // The generated SDK method sends `to-status` in the request body, but Gitea expects it as a query parameter.
  await client.request("PATCH /notifications/threads/{id}{?to-status}", {
    id: params.id,
    "to-status": params.toStatus,
  });
}

/**
 * Update the status of all notifications to read.
 * Defaults to filtering by unread status-type and setting to-status to read.
 */
export async function readAllNotificationStatus(...statusTypes: StatusType[]) {
  const client = getClient();

  // The generated SDK method sends `to-status` and `status-types`` in the request body, but Gitea expects it as a query parameter.
  await client.request("PUT /notifications{?to-status,status-types}", {
    "to-status": "read",
    ...(statusTypes.length > 0 ? { "status-types": statusTypes } : {}),
  });
}
