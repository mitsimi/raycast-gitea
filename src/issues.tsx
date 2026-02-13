import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useIssues } from "./hooks/useIssues";

export default function Command() {
  const { items, isLoading } = useIssues();

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search issues">
      {items.map((issue) => (
        <List.Item
          key={issue.id}
          title={issue.title}
          subtitle={issue.state}
          icon={
            issue.state === "open"
              ? { source: Icon.Circle, tintColor: Color.Green }
              : { source: Icon.XMarkCircle, tintColor: Color.Red }
          }
          accessories={[
            {
              text: `#${issue.number.toString()}`,
            },
          ]}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.OpenInBrowser title="Open Repository" url={issue.html_url} />
                <Action.CopyToClipboard title="Copy URL to Clipboard" content={issue.html_url} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
