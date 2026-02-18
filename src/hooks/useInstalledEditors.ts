import { useCachedPromise } from "@raycast/utils";
import { getApplications, getPreferenceValues } from "@raycast/api";

export type EditorId = "vscode" | "cursor" | "zed" | "intellij" | "webstorm" | "pycharm";

export interface EditorInfo {
  id: EditorId;
  name: string;
  icon: string;
  prefKey: string;
  bundleId: string;
  namePatterns: RegExp[];
  windowsPathPatterns?: RegExp[];
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
    namePatterns: [/^visual studio code$/i, /^code$/i, /^vscode$/i],
    windowsPathPatterns: [/visual studio code\.lnk$/i, /visual studio code\.lnk$/i],
  },
  {
    id: "cursor",
    name: "Cursor",
    bundleId: "com.todesktop.230313mzl4w4u92",
    icon: "logo/cursor.png",
    prefKey: "editorCursor",
    namePatterns: [/^cursor$/i],
    windowsPathPatterns: [/\/cursor\/cursor\.lnk$/i, /\/cursor\/cursor\.exe$/i],
  },
  {
    id: "zed",
    name: "Zed",
    bundleId: "dev.zed.Zed",
    icon: "logo/zed.png",
    prefKey: "editorZed",
    namePatterns: [/^zed$/i, /^zed preview$/i],
    windowsPathPatterns: [
      /\/zed\/zed\.lnk$/i,
      /\/zed\/zed\.exe$/i,
      /\/zed preview\/zed\.lnk$/i,
      /\/zed preview\/zed\.exe$/i,
    ],
  },
  {
    id: "intellij",
    name: "IntelliJ IDEA",
    bundleId: "com.jetbrains.intellij",
    icon: "logo/intellij.png",
    prefKey: "editorIntelliJ",
    namePatterns: [/^intellij idea$/i, /^idea$/i],
    windowsPathPatterns: [
      /\/jetbrains\/intellij idea.*\/bin\/idea64\.exe$/i,
      /\/jetbrains\/idea\/bin\/idea64\.exe$/i,
      /\/intellij idea.*\.lnk$/i,
    ],
  },
  {
    id: "webstorm",
    name: "WebStorm",
    bundleId: "com.jetbrains.WebStorm",
    icon: "logo/webstorm.png",
    prefKey: "editorWebStorm",
    namePatterns: [/^webstorm$/i],
    windowsPathPatterns: [/\/jetbrains\/webstorm.*\/bin\/webstorm64\.exe$/i, /\/webstorm.*\.lnk$/i],
  },
  {
    id: "pycharm",
    name: "PyCharm",
    bundleId: "com.jetbrains.PyCharm",
    icon: "logo/pycharm.png",
    prefKey: "editorPyCharm",
    namePatterns: [/^pycharm$/i, /^pycharm community edition$/i, /^pycharm professional$/i],
    windowsPathPatterns: [/\/jetbrains\/pycharm.*\/bin\/pycharm64\.exe$/i, /\/pycharm.*\.lnk$/i],
  },
];

function matchesAny(value: string, patterns?: RegExp[]): boolean {
  return patterns?.some((pattern) => pattern.test(value)) ?? false;
}

function isEditorInstalled(
  editor: EditorInfo,
  apps: Array<{ name?: string; localizedName?: string; path?: string; bundleId?: string }>,
): boolean {
  if (process.platform === "win32") {
    return apps.some((app) => {
      const name = app.name ?? "";
      const localizedName = app.localizedName ?? "";
      const path = app.path ?? "";
      const normalizedPath = path.replace(/\\/g, "/");

      return (
        matchesAny(name, editor.namePatterns) ||
        matchesAny(localizedName, editor.namePatterns) ||
        matchesAny(normalizedPath, editor.windowsPathPatterns)
      );
    });
  }

  return apps.some((app) => {
    if (app.bundleId === editor.bundleId) {
      return true;
    }

    const name = app.name ?? "";
    const localizedName = app.localizedName ?? "";

    return matchesAny(name, editor.namePatterns) || matchesAny(localizedName, editor.namePatterns);
  });
}

export function getEditorUrlScheme(editorId: EditorId, repoUrl: string): string {
  const encodedUrl = encodeURIComponent(repoUrl);

  switch (editorId) {
    case "vscode":
      return `vscode://vscode.git/clone?url=${encodedUrl}`;
    case "cursor":
      return `cursor://vscode.git/clone?url=${encodedUrl}`;
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

      return EDITORS.filter((editor) => {
        if (!isEditorInstalled(editor, apps)) {
          return false;
        }

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
