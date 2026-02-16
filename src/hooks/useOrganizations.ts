import { useCachedPromise } from "@raycast/utils";
import { listOrganizations } from "../api/organizations";
import type { Organization } from "../types/api";

export function useOrganizations() {
  const { data, isLoading, error } = useCachedPromise(
    async (): Promise<Organization[]> => {
      return listOrganizations({ limit: 1000 });
    },
    [],
    {
      initialData: [],
    },
  );

  return { items: data ?? [], isLoading, error };
}
