import { List } from "@raycast/api";
import { getNotificationFilter, NotificationFilter } from "../interfaces/notification";
import { toTitleCase } from "../common/utils";

export default function NotificationDropdown(props: {
  notifyFilter: NotificationFilter[];
  onFilterChange: (newValue: NotificationFilter) => void;
}) {
  const { notifyFilter, onFilterChange } = props;
  return (
    <List.Dropdown
      tooltip="Filter notifications"
      storeValue={true}
      onChange={(newValue) => {
        onFilterChange(getNotificationFilter(newValue)!);
      }}
    >
      <List.Dropdown.Section>
        {notifyFilter.map((filter) => (
          <List.Dropdown.Item key={filter} title={toTitleCase(filter)} value={filter} />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}
