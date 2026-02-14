import { Action, ActionPanel, Icon, List, Toast } from "@raycast/api";
import { showFailureToast, useCachedPromise, useCachedState } from "@raycast/utils";
import { useMemo, useState } from "react";
import { searchIssues } from "./api/issues";
import type { Issue } from "./types/api";
import CreateIssue from "./create-issue";
import { getIssueIcon } from "./utils/icons";

type IssueSearchState = "open" | "closed" | "all";

type IssueSearchOptions = {
  state: IssueSearchState;
  owner?: string;
  repo?: string;
  query?: string;
};

export default function Command() {
  const [state, setState] = useCachedState<IssueSearchState>("issues-search-state", "open");
  const [searchText, setSearchText] = useState<string>("");

  const options = useMemo<IssueSearchOptions>(() => {
    const { query, owner, repo } = parseSearchQuery(searchText);
    return { state, owner, repo, query } as IssueSearchOptions & { query?: string };
  }, [searchText, state]);

  const { items, isLoading } = useSearchIssues(options);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search issues"
      onSearchTextChange={setSearchText}
      throttle
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter issues"
          storeValue={true}
          onChange={(value) => {
            setState(value.replace("state:", "") as IssueSearchState);
          }}
        >
          <List.Dropdown.Section title="State">
            <List.Dropdown.Item title="Open" value="state:open" />
            <List.Dropdown.Item title="Closed" value="state:closed" />
            <List.Dropdown.Item title="All" value="state:all" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {items.length === 0 ? (
        <List.EmptyView icon={Icon.MagnifyingGlass} title="No issues found" />
      ) : (
        items.map((issue) => (
          <List.Item
            key={issue.id ?? issue.number ?? issue.title ?? "issue"}
            title={issue.title ?? ""}
            subtitle={issue.repository?.full_name}
            icon={getIssueIcon(issue.state)}
            accessories={[{ text: `#${issue.number ?? ""}` }]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  {issue.html_url ? <Action.OpenInBrowser title="Open Issue" url={issue.html_url} /> : null}
                  {issue.html_url ? (
                    <Action.CopyToClipboard title="Copy URL to Clipboard" content={issue.html_url} />
                  ) : null}
                  {issue.number != null ? (
                    <Action.CopyToClipboard title="Copy Issue Number" content={`#${issue.number}`} />
                  ) : null}
                  {issue.repository?.full_name ? (
                    <Action.Push
                      title="Create Issue"
                      icon={Icon.Plus}
                      target={<CreateIssue initialRepo={issue.repository.full_name} />}
                    />
                  ) : null}
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}

type UseSearchIssuesParams = {
  query?: string;
  state?: IssueSearchState;
  owner?: string;
  repo?: string;
};

function useSearchIssues(params: UseSearchIssuesParams) {
  const { state, owner, repo, query } = params;
  const [items, setItems] = useCachedState<Issue[]>("issues-search", []);

  const { isLoading } = useCachedPromise(
    async (s?: IssueSearchState, o?: string, r?: string, q?: string) => {
      const data = await searchIssues({
        type: "issues",
        state: s,
        q: q?.trim() ? q : undefined,
        owner: o,
        limit: 50,
      });
      return r ? data.filter((issue) => issue.repository?.full_name === r) : data;
    },
    [state, owner, repo, query] as [
      IssueSearchState | undefined,
      string | undefined,
      string | undefined,
      string | undefined,
    ],
    {
      keepPreviousData: true,
      initialData: items,
      onData: (data) => setItems(data),
      onError() {
        showFailureToast({ style: Toast.Style.Failure, title: "Couldn't search issues" });
      },
    },
  );

  return { items, isLoading };
}

function parseSearchQuery(raw: string) {
  const repoMatch = raw.match(/\brepo:([^\s]+)/i);
  const ownerMatch = raw.match(/\bowner:([^\s]+)/i);
  const repo = repoMatch?.[1];
  const owner = repo ? repo.split("/")[0] : ownerMatch?.[1];
  const query = raw
    .replace(/\brepo:[^\s]+/gi, "")
    .replace(/\bowner:[^\s]+/gi, "")
    .trim();

  return { query, owner, repo };
}
