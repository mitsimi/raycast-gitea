import { List } from "@raycast/api";
import type { CommonOptionType } from "../../types/sorts/common";

type NotificationDropdownProps<TValue extends string> = {
  options: readonly CommonOptionType<TValue>[];
  onFilterChange: (newValue: TValue) => void;
};

export default function NotificationDropdown<TValue extends string>({
  options,
  onFilterChange,
}: NotificationDropdownProps<TValue>) {
  return (
    <List.Dropdown
      tooltip="Filter notifications"
      storeValue={true}
      onChange={(newValue) => {
        onFilterChange(newValue as TValue);
      }}
    >
      <List.Dropdown.Section>
        {options.map((filter) => (
          <List.Dropdown.Item key={filter.id} title={filter.name} value={filter.value} />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}
