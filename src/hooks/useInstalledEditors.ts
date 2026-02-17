import { useCachedPromise } from "@raycast/utils";
import { getApplications, getPreferenceValues } from "@raycast/api";

export type EditorId = "vscode" | "cursor" | "zed" | "intellij" | "webstorm" | "pycharm";

export interface EditorInfo {
  id: EditorId;
  name: string;
  bundleId: string;
  icon: string;
  prefKey: string;
}

interface EditorPreferences {
  editorVSCode: boolean;
  editorCursor: boolean;
  editorZed: boolean;
  editorIntelliJ: boolean;
  editorWebStorm: boolean;
  editorPyCharm: boolean;
}

const EDITORS: EditorInfo[] = [
  {
    id: "vscode",
    name: "VS Code",
    bundleId: "com.microsoft.VSCode",
    icon: "logo/vscode.png",
    prefKey: "editorVSCode",
  },
  {
    id: "cursor",
    name: "Cursor",
    bundleId: "com.todesktop.230313mzl4w4u92",
    icon: "logo/cursor.png",
    prefKey: "editorCursor",
  },
  {
    id: "zed",
    name: "Zed",
    bundleId: "dev.zed.Zed",
    icon: "logo/zed.png",
    prefKey: "editorZed",
  },
  {
    id: "intellij",
    name: "IntelliJ IDEA",
    bundleId: "com.jetbrains.intellij",
    icon: "logo/intellij.png",
    prefKey: "editorIntelliJ",
  },
  {
    id: "webstorm",
    name: "WebStorm",
    bundleId: "com.jetbrains.WebStorm",
    icon: "logo/webstorm.png",
    prefKey: "editorWebStorm",
  },
  {
    id: "pycharm",
    name: "PyCharm",
    bundleId: "com.jetbrains.PyCharm",
    icon: "logo/pycharm.png",
    prefKey: "editorPyCharm",
  },
];

export function getEditorUrlScheme(editorId: EditorId, repoUrl: string): string {
  const encodedUrl = encodeURIComponent(repoUrl);

  switch (editorId) {
    case "vscode":
      return `vscode://vscode.git/clone?url=${encodedUrl}`;
    case "cursor":
      return `vscode://vscode.git/clone?url=${encodedUrl}`;
    case "zed":
      return `zed://git/clone?repo=${encodedUrl}`;
    case "intellij":
      return `jetbrains://idea/checkout/git?checkout.repo=${encodedUrl}&idea.required.plugins.id=Git4Idea`;
    case "webstorm":
      return `jetbrains://webstorm/checkout/git?checkout.repo=${encodedUrl}&idea.required.plugins.id=Git4Idea`;
    case "pycharm":
      return `jetbrains://pycharm/checkout/git?checkout.repo=${encodedUrl}&idea.required.plugins.id=Git4Idea`;
    default:
      return "";
  }
}

export function useInstalledEditors() {
  const prefs = getPreferenceValues<EditorPreferences>();

  const { data: installedEditors = [], isLoading } = useCachedPromise(
    async (): Promise<EditorInfo[]> => {
      const apps = await getApplications();
      const installedBundleIds = new Set(apps.map((app) => app.bundleId));

      return EDITORS.filter((editor) => {
        // Must be installed
        if (!installedBundleIds.has(editor.bundleId)) {
          return false;
        }
        // Must be enabled in preferences
        return prefs[editor.prefKey as keyof EditorPreferences] ?? true;
      });
    },
    [],
    {
      initialData: [],
    },
  );

  return { installedEditors, isLoading };
}
