/**
 * Header presentation helpers for the brand mark (contrast mode only).
 * Theme → logo URLs: {@link resolveThemeLogo} in `resolve-theme-logo.ts`.
 */
import { relativeLuminanceFromHex } from "@/lib/color/hex-luminance";
import { getThemeSurfaceContrastTokens } from "@/lib/theme/theme-palette-tokens";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";
import { parseRegisteredThemeId } from "@/lib/theme/theme-logo-resolve";

export type HeaderLogoMode = "dark-header" | "light-header";

/**
 * Deterministic header logo mode based on tokenized header/topbar surface luminance.
 * Unknown theme ids fall back to default theme tokens for mode only (not for logo URL).
 */
export function headerLogoModeForTheme(themeId?: string | null): HeaderLogoMode {
  const registered = parseRegisteredThemeId(themeId);
  const canonicalThemeId = registered ?? NURSENEST_DEFAULT_THEME;
  const semantic = getThemeSurfaceContrastTokens(canonicalThemeId);
  const surface = semantic?.navBackground;
  const navForeground = semantic?.navForeground;
  if (!surface) return "dark-header";
  const luminance = relativeLuminanceFromHex(surface);
  if (navForeground) {
    const fgLuminance = relativeLuminanceFromHex(navForeground);
    if (fgLuminance > 0.8) return "dark-header";
  }
  return luminance < 0.5 ? "dark-header" : "light-header";
}
