import { Action, ActionPanel } from "@raycast/api";
import { Repository } from "../../types/repository";
import { ReactNode } from "react";

export default function RepositoryActions(props: { item: Repository; children?: ReactNode }) {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action.OpenInBrowser title="Open Repository" url={props.item.html_url} />
        <Action.CopyToClipboard title="Copy URL to Clipboard" content={props.item.html_url} />
      </ActionPanel.Section>
      {props.children ?? <ActionPanel.Section>{props.children}</ActionPanel.Section>}
    </ActionPanel>
  );
}
