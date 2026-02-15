import { useCachedState, useCachedPromise } from "@raycast/utils";
import { listNotifications } from "../api/notifications";
import type { NotificationThread } from "../types/api";

export function useNotifications(filter: "unread" | "all") {
  const [items, setItems] = useCachedState<NotificationThread[]>("notifications", []);
  const { isLoading, revalidate, mutate } = useCachedPromise(
    (f: "unread" | "all"): Promise<NotificationThread[]> => listNotifications({ limit: 20, all: f === "all" }),
    [filter] as [typeof filter],
    {
      keepPreviousData: true,
      initialData: items,
      onData: (data) => {
        if (Array.isArray(data)) setItems(data as NotificationThread[]);
      },
    },
  );
  return { items, isLoading, revalidate, mutate };
}
