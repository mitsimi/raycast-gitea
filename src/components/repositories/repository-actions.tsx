import { Action, ActionPanel, Icon, Keyboard } from "@raycast/api";
import type { Repository } from "../../types/api";
import { ReactNode } from "react";
import CreateIssue from "../../create-issue";

export default function RepositoryActions(props: { item: Repository; children?: ReactNode }) {
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
      </ActionPanel.Section>
      <ActionPanel.Section title="Copy">
        {props.item.html_url ? (
          <Action.CopyToClipboard
            title="Copy URL"
            content={props.item.html_url}
            shortcut={Keyboard.Shortcut.Common.Copy}
          />
        ) : null}
        {props.item.ssh_url ? (
          <Action.CopyToClipboard
            title="Copy SSH URL"
            content={props.item.ssh_url}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
        ) : null}
      </ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.full_name ? (
          <Action.Push
            title="Create Issue"
            icon={Icon.Plus}
            shortcut={Keyboard.Shortcut.Common.New}
            target={<CreateIssue initialRepo={props.item.full_name} />}
          />
        ) : null}
      </ActionPanel.Section>
      {props.children && (
        <ActionPanel.Section>
          {/* @ts-expect-error - React 19 types are incompatible with Raycast's bundled React types */}
          {props.children}
        </ActionPanel.Section>
      )}
    </ActionPanel>
  );
}
