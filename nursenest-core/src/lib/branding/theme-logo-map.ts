/**
 * Canonical local brand logo assets used across header/auth/dashboard shells.
 * These are the NurseNest-approved files in `/public/logos`.
 */
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";

const AVAILABLE_THEME_IDS = new Set(THEME_OPTIONS.map((theme) => theme.id));

export function getThemeLogoPathForThemeId(themeId?: string | null): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const resolvedThemeId = AVAILABLE_THEME_IDS.has(canonicalThemeId)
    ? canonicalThemeId
    : NURSENEST_DEFAULT_THEME;
  return `/logos/${resolvedThemeId}-brandlogo.png`;
}

export const THEME_LOGO_MAP: Record<string, string> = Object.fromEntries(
  THEME_OPTIONS.map((theme) => [theme.id, getThemeLogoPathForThemeId(theme.id)]),
);
