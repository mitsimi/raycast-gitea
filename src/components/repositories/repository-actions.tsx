import { Action, ActionPanel, Icon, Keyboard } from "@raycast/api";
import type { Repository } from "../../types/api";
import { ReactNode } from "react";
import CreateIssue from "../../create-issue";
import { useInstalledEditors, getEditorUrlScheme } from "../../hooks/useInstalledEditors";

function CloneActions({ cloneUrl }: { cloneUrl: string }) {
  const { installedEditors } = useInstalledEditors();

  if (installedEditors.length === 0) {
    return null;
  }

  const shortcut_keys = (i: number) => (i + 1).toString() as "1" | "2" | "3" | "4" | "5" | "6";

  return (
    <ActionPanel.Section title="Clone with Editor">
      {installedEditors.map((editor, index) => (
        <Action.OpenInBrowser
          key={editor.bundleId}
          title={`Clone with ${editor.name}`}
          icon={{ source: editor.icon }}
          url={getEditorUrlScheme(editor.id, cloneUrl)}
          shortcut={{
            macOS: { modifiers: ["cmd", "shift"], key: shortcut_keys(index) },
            Windows: {
              modifiers: ["ctrl", "shift"],
              key: shortcut_keys(index),
            },
          }}
        />
      ))}
    </ActionPanel.Section>
  );
}

export default function RepositoryActions(props: {
  item: Repository;
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  children?: ReactNode;
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
          shortcut={{
            macOS: { modifiers: ["cmd", "shift"], key: "d" },
            Windows: { modifiers: ["ctrl", "shift"], key: "d" },
          }}
          onAction={() => props.setShowDetails(!props.showDetails)}
        />

        {props.item.full_name ? (
          <Action.Push
            title="Create Issue"
            icon={Icon.Plus}
            shortcut={Keyboard.Shortcut.Common.New}
            target={<CreateIssue initialRepo={props.item.full_name} />}
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
            shortcut={{
              macOS: { modifiers: ["cmd", "shift"], key: "s" },
              Windows: { modifiers: ["ctrl", "shift"], key: "s" },
            }}
          />
        ) : null}
      </ActionPanel.Section>

      {cloneUrl ? <CloneActions cloneUrl={cloneUrl} /> : null}

      {props.children && (
        <ActionPanel.Section>
          {/* @ts-expect-error - React 19 types are incompatible with Raycast's bundled React types */}
          {props.children}
        </ActionPanel.Section>
      )}
    </ActionPanel>
  );
}
