import { Action, ActionPanel, Icon, Keyboard } from "@raycast/api";
import type { Repository } from "../../types/api";
import { crossPlatformShortcut } from "../../utils/shortcuts";
import RepositoryCloneActions from "./repository-clone-actions";

export default function RepositoryActions(props: {
  item: Repository;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  createIssueAction?: ActionPanel.Section.Children;
  children?: ActionPanel.Section.Children;
}) {
  const cloneUrl = props.item.ssh_url || props.item.clone_url;

  return (
    <ActionPanel>
      <ActionPanel.Section>
        {props.item.html_url ? (
          <Action.OpenInBrowser
            title="Open Repository"
            url={props.item.html_url}
            shortcut={Keyboard.Shortcut.Common.Open}
          />
        ) : null}

        <Action
          title={props.showDetails ? "Hide Details" : "Show Details"}
          icon={props.showDetails ? Icon.EyeDisabled : Icon.Eye}
          shortcut={crossPlatformShortcut("d", ["cmd", "shift"])}
          onAction={() => props.setShowDetails(!props.showDetails)}
        />

        {props.createIssueAction}
      </ActionPanel.Section>

      <ActionPanel.Section title="Copy">
        {props.item.html_url ? (
          <Action.CopyToClipboard
            title="Copy HTML URL"
            content={props.item.html_url}
            shortcut={crossPlatformShortcut("h", ["cmd", "shift"])}
          />
        ) : null}
        {props.item.clone_url ? (
          <Action.CopyToClipboard
            title="Copy Clone URL"
            content={props.item.clone_url}
            shortcut={crossPlatformShortcut("c", ["cmd", "shift"])}
          />
        ) : null}
        {props.item.ssh_url ? (
          <Action.CopyToClipboard
            title="Copy SSH URL"
            content={props.item.ssh_url}
            shortcut={crossPlatformShortcut("s", ["cmd", "shift"])}
          />
        ) : null}
      </ActionPanel.Section>

      {cloneUrl ? <RepositoryCloneActions cloneUrl={cloneUrl} /> : null}

      {props.children && <ActionPanel.Section>{props.children}</ActionPanel.Section>}
    </ActionPanel>
  );
}
