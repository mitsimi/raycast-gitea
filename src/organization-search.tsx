import { Icon, List } from "@raycast/api";
import { useOrganizations } from "./hooks/useOrganizations";

export default function Command() {
  const { items, isLoading, pagination } = useOrganizations();

  return (
    <List searchBarPlaceholder="Search organizations" isLoading={isLoading} pagination={pagination}>
      {items.length === 0 ? (
        <List.EmptyView icon={Icon.Building} title="No organizations found" />
      ) : (
        items.map((org) => {
          const accessories: List.Item.Accessory[] = [];
          if (org.visibility === "private") {
            accessories.push({ icon: Icon.Lock, text: "Private" });
          }
          return (
            <List.Item
              key={org.id || org.name || "org"}
              title={org.full_name || org.name || ""}
              subtitle={org.description}
              icon={org.avatar_url ? { source: org.avatar_url } : Icon.Building}
              accessories={accessories}
            />
          );
        })
      )}
    </List>
  );
}
