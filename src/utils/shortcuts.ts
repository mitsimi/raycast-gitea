import type { Keyboard } from "@raycast/api";

export function crossPlatformShortcut(
  key: Keyboard.KeyEquivalent,
  modifiers: Keyboard.KeyModifier[],
): Keyboard.Shortcut {
  return {
    macOS: { modifiers, key },
    Windows: { modifiers: mapWindowsModifiers(modifiers), key },
  };
}

function mapWindowsModifiers(modifiers: Keyboard.KeyModifier[]): Keyboard.KeyModifier[] {
  return modifiers.map((modifier) => (modifier === "cmd" ? "ctrl" : modifier));
}
