import { getClient } from "./client";
import type { Notification } from "../interfaces/notification";

export type ListNotificationParams = { limit?: number; all?: boolean; page?: number };
export async function listNotifications(params: ListNotificationParams = {}) {
  const client = getClient();
  const { limit = 20, all = false, page } = params;
  return client.get<Notification[]>("/notifications", { limit, all, ...(page ? { page } : {}) });
}

export async function updateNotificationStatus(id: string, toStatus: "read" | "unread" | "pinned") {
  const client = getClient();
  return client.patch<Notification>(`/notifications/threads/${id}?${new URLSearchParams({ "to-status": toStatus })}`);
}
