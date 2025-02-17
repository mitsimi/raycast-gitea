import { Action, ActionPanel } from "@raycast/api";
import { Repository } from "../interfaces/repository";

export default function RepositoryActions(props: { item: Repository }) {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action.OpenInBrowser title="Open Repository" url={props.item.html_url} />
        <Action.CopyToClipboard title="Copy URL to Clipboard" content={props.item.html_url} />
      </ActionPanel.Section>
    </ActionPanel>
  );
}
