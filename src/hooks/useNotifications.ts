import { useCachedState, useCachedPromise } from "@raycast/utils";
import { listNotifications } from "../api/notifications";
import type { Notification } from "../types/notification";

export function useNotifications(filter: "unread" | "all") {
  const [items, setItems] = useCachedState<Notification[]>("notifications", []);
  const { isLoading, revalidate, mutate } = useCachedPromise(
    (f: "unread" | "all"): Promise<Notification[]> => listNotifications({ limit: 20, all: f === "all" }),
    [filter] as [typeof filter],
    {
      keepPreviousData: true,
      initialData: [] as Notification[],
      onData: (data) => {
        if (Array.isArray(data)) setItems(data as Notification[]);
      },
    },
  );
  return { items, isLoading, revalidate, mutate };
}
