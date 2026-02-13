import { Action, ActionPanel } from "@raycast/api";
import type { Repository } from "../../types/api";
import { ReactNode } from "react";

export default function RepositoryActions(props: { item: Repository; children?: ReactNode }) {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        {props.item.html_url ? <Action.OpenInBrowser title="Open Repository" url={props.item.html_url} /> : null}
        {props.item.html_url ? (
          <Action.CopyToClipboard title="Copy URL to Clipboard" content={props.item.html_url} />
        ) : null}
      </ActionPanel.Section>
      {props.children && <ActionPanel.Section>{props.children}</ActionPanel.Section>}
    </ActionPanel>
  );
}
