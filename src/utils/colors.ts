import colorsData from "../../assets/colors.json";

export interface LanguageColor {
  color?: string;
}

type ColorsJsonEntry = {
  color?: string;
  extensions?: string[];
  aliases?: string[];
};

type ColorsJson = Record<string, ColorsJsonEntry>;

class GitHubColors {
  private languageMap: Map<string, LanguageColor> | null;
  private extensionMap: Map<string, LanguageColor> | null;

  constructor() {
    this.languageMap = null;
    this.extensionMap = null;
  }

  private ensureInitialized(): void {
    if (this.languageMap && this.extensionMap) return;

    const data = colorsData as ColorsJson;
    const langMap = new Map<string, LanguageColor>();
    const extMap = new Map<string, LanguageColor>();

    for (const [languageName, entry] of Object.entries(data)) {
      const colorObj: LanguageColor = entry.color ? { color: entry.color } : {};

      // Map language name (case-insensitive)
      langMap.set(languageName.toLowerCase(), colorObj);

      // Map aliases (case-insensitive)
      if (entry.aliases) {
        for (const alias of entry.aliases) {
          langMap.set(alias.toLowerCase(), colorObj);
        }
      }

      // Map extensions (normalized to start with a dot)
      if (entry.extensions) {
        for (const ext of entry.extensions) {
          const key = ext.startsWith(".") ? ext : `.${ext}`;
          extMap.set(key.toLowerCase(), colorObj);
        }
      }
    }

    this.languageMap = langMap;
    this.extensionMap = extMap;
  }

  get(lang: string, handleOthers?: boolean): LanguageColor | undefined {
    this.ensureInitialized();
    const key = (lang || "").toLowerCase();
    const found = (this.languageMap as Map<string, LanguageColor>).get(key);
    if (found) return found;
    if (handleOthers) return { color: "#ccc" };
    return undefined;
  }

  ext(ext: string, handleOthers?: boolean): LanguageColor | undefined {
    this.ensureInitialized();
    const normalized = ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
    const found = (this.extensionMap as Map<string, LanguageColor>).get(normalized);
    if (found) return found;
    if (handleOthers) return { color: "#ccc" };
    return undefined;
  }
}

const instance = new GitHubColors();
export default instance;
