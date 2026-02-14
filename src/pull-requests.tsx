import { Action, ActionPanel, Icon, List, getPreferenceValues } from "@raycast/api";
import { useMemo, useState } from "react";
import { usePullRequests } from "./hooks/usePullRequests";
import CreateIssue from "./create-issue";
import { getPullRequestIcon } from "./utils/icons";

type PullRequestCommandPreferences = {
  includeCreated: boolean;
  includeAssigned: boolean;
  includeMentioned: boolean;
  includeReviewRequested: boolean;
  includeReviewed: boolean;
  includeRecentlyClosed: boolean;
};

export default function Command() {
  const prefs = getPreferenceValues<PullRequestCommandPreferences>();
  const filters = useMemo(
    () => ({
      includeCreated: prefs.includeCreated ?? true,
      includeAssigned: prefs.includeAssigned ?? true,
      includeMentioned: prefs.includeMentioned ?? true,
      includeReviewRequested: prefs.includeReviewRequested ?? true,
      includeReviewed: prefs.includeReviewed ?? false,
      includeRecentlyClosed: prefs.includeRecentlyClosed ?? false,
    }),
    [
      prefs.includeCreated,
      prefs.includeAssigned,
      prefs.includeMentioned,
      prefs.includeReviewRequested,
      prefs.includeReviewed,
      prefs.includeRecentlyClosed,
    ],
  );

  const [searchText, setSearchText] = useState<string>("");
  const { items, isLoading, pagination } = usePullRequests({ ...filters, query: searchText });

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search pull requests"
      pagination={pagination}
      onSearchTextChange={setSearchText}
      throttle
    >
      {items.length === 0 ? (
        <List.EmptyView icon={Icon.Code} title="No pull requests found" />
      ) : (
        items.map((pr) => (
          <List.Item
            key={pr.id ?? pr.number ?? pr.title ?? "pull-request"}
            title={pr.title ?? ""}
            subtitle={pr.repository?.full_name}
            icon={getPullRequestIcon(pr.state, pr.title)}
            accessories={[{ text: `#${pr.number ?? ""}` }]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  {pr.html_url && <Action.OpenInBrowser title="Open Pull Request" url={pr.html_url} />}
                  {pr.html_url && <Action.CopyToClipboard title="Copy URL to Clipboard" content={pr.html_url} />}
                  {pr.number != null && (
                    <Action.CopyToClipboard title="Copy Pull Request Number" content={`#${pr.number}`} />
                  )}
                  {pr.repository?.full_name && (
                    <Action.Push
                      title="Create Issue"
                      icon={Icon.Plus}
                      target={<CreateIssue initialRepo={pr.repository.full_name} />}
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
