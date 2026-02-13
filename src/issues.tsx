import { Action, ActionPanel, Color, List, Icon, getPreferenceValues } from "@raycast/api";
import { useIssues } from "./hooks/useIssues";
import { useMemo, useState } from "react";
import type { Issue } from "./types/api";

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
        <List.EmptyView icon={Icon.BulletPoints} title="No issues found" />
      ) : (
        items.map((issue) => (
          <List.Item
            key={issue.id ?? issue.number ?? issue.title ?? "issue"}
            title={issue.title ?? ""}
            subtitle={getSubtitle(issue)}
            icon={
              issue.state === "open"
                ? { source: "issue-open.svg", tintColor: Color.Green }
                : { source: "issue-closed.svg", tintColor: Color.Red }
            }
            accessories={[
              {
                text: `#${issue.number ?? ""}`,
              },
              ...(issue.repository?.full_name ? [{ text: issue.repository.full_name }] : []),
            ]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  {issue.html_url && <Action.OpenInBrowser title="Open Issue" url={issue.html_url} />}
                  {issue.html_url && <Action.CopyToClipboard title="Copy URL to Clipboard" content={issue.html_url} />}
                  {issue.number != null && (
                    <Action.CopyToClipboard title="Copy Issue Number" content={`#${issue.number}`} />
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

function getSubtitle(issue: Issue) {
  if (!issue.state) return "";
  if (issue.state === "open") return "Open";
  if (issue.state === "closed") return "Closed";
  return issue.state;
}
