import { Action, ActionPanel, List, Icon, getPreferenceValues } from "@raycast/api";
import { useIssues } from "./hooks/useIssues";
import { useMemo, useState } from "react";
import CreateIssue from "./create-issue";
import { getIssueIcon } from "./utils/icons";

type IssueCommandPreferences = {
  includeCreated: boolean;
  includeAssigned: boolean;
  includeMentioned: boolean;
  includeRecentlyClosed: boolean;
};
export default function Command() {
  const prefs = getPreferenceValues<IssueCommandPreferences>();
  const filters = useMemo(
    () => ({
      includeCreated: prefs.includeCreated ?? true,
      includeAssigned: prefs.includeAssigned ?? true,
      includeMentioned: prefs.includeMentioned ?? true,
      includeRecentlyClosed: prefs.includeRecentlyClosed ?? false,
    }),
    [prefs.includeCreated, prefs.includeAssigned, prefs.includeMentioned, prefs.includeRecentlyClosed],
  );

  const [searchText, setSearchText] = useState<string>("");
  const { items, isLoading, pagination } = useIssues({ ...filters, query: searchText });

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search issues"
      pagination={pagination}
      onSearchTextChange={setSearchText}
      throttle
    >
      {items.length === 0 ? (
        <List.EmptyView
          icon={Icon.BulletPoints}
          title="No issues found"
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.Push title="Create Issue" icon={Icon.Plus} target={<CreateIssue />} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ) : (
        items.map((issue) => (
          <List.Item
            key={issue.id ?? issue.number ?? issue.title ?? "issue"}
            title={issue.title ?? ""}
            subtitle={issue.repository?.full_name}
            icon={getIssueIcon(issue.state)}
            accessories={[
              {
                text: `#${issue.number ?? ""}`,
              },
            ]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  {issue.html_url && <Action.OpenInBrowser title="Open Issue" url={issue.html_url} />}
                  {issue.html_url && <Action.CopyToClipboard title="Copy URL to Clipboard" content={issue.html_url} />}
                  {issue.number != null && (
                    <Action.CopyToClipboard title="Copy Issue Number" content={`#${issue.number}`} />
                  )}
                  {issue.repository?.full_name && (
                    <Action.Push
                      title="Create Issue"
                      icon={Icon.Plus}
                      target={<CreateIssue initialRepo={issue.repository.full_name} />}
                    />
                  )}
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
