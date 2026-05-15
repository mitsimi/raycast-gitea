import { useCachedPromise } from "@raycast/utils";
import { listNotifications } from "../api/notifications";
import type { NotificationThread } from "../types/api";
import { NotificationStatusFilter } from "../types/sorts/notification-search";

export function useNotifications(filter: NotificationStatusFilter) {
  const { data, isLoading, revalidate, mutate } = useCachedPromise(
    (f: NotificationStatusFilter): Promise<NotificationThread[]> => {
      return listNotifications({ all: f === NotificationStatusFilter.All });
    },
    [filter] as [NotificationStatusFilter],
    {
      initialData: [],
    },
  );

  return { items: data ?? [], isLoading, revalidate, mutate };
}
