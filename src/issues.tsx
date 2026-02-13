import { Action, ActionPanel, Color, List } from "@raycast/api";
import { useIssues } from "./hooks/useIssues";
export default function Command() {
  const { items, isLoading } = useIssues();

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search issues">
      {items.map((issue) => (
        <List.Item
          key={issue.id ?? issue.number ?? issue.title ?? "issue"}
          title={issue.title ?? ""}
          subtitle={issue.state ?? ""}
          icon={
            issue.state === "open"
              ? { source: "issue-open.svg", tintColor: Color.Green }
              : { source: "issue-closed.svg", tintColor: Color.Red }
          }
          accessories={[
            {
              text: `#${issue.number ?? ""}`,
            },
          ]}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                {issue.html_url ? <Action.OpenInBrowser title="Open Repository" url={issue.html_url} /> : null}
                {issue.html_url ? (
                  <Action.CopyToClipboard title="Copy URL to Clipboard" content={issue.html_url} />
                ) : null}
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
