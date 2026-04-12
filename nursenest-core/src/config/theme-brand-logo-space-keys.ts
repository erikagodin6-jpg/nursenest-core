/**
 * Compatibility exports for callers that need theme -> Spaces object key lookups.
 * Mapping source-of-truth lives in `src/lib/branding/theme-logo-map.ts`.
 */
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { themeLogoObjectKeyForTheme } from "@/lib/branding/theme-logo-map";

export type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

/** Explicit theme id → Spaces key (no leading slash). */
export const THEME_BRAND_LOGO_SPACE_KEYS = Object.fromEntries(
  THEME_OPTIONS.map((o) => [o.id, themeLogoObjectKeyForTheme(o.id)]),
) as Record<ThemeId, string>;

const KEYS = THEME_BRAND_LOGO_SPACE_KEYS as Readonly<Record<string, string>>;

export function getThemeBrandLogoSpaceKeyForCanonicalId(themeId: string): string {
  const k = KEYS[themeId];
  if (k) return k;
  return KEYS[NURSENEST_DEFAULT_THEME]!;
}
