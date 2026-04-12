/**
 * Theme id → Spaces object key for nursenest-images CDN rasters.
 * Source of truth: {@link THEME_LOGO_SPACE_KEYS} in `src/lib/branding/resolve-theme-logo.ts`.
 */
import { THEME_LOGO_SPACE_KEYS } from "@/lib/branding/resolve-theme-logo";
import { THEME_OPTIONS, type ThemeOption } from "@/lib/theme/theme-registry";

export type ThemeId = ThemeOption["id"];

/** Explicit theme id → Spaces key when a CDN logo exists; omitted ids have no mapped asset. */
export const THEME_BRAND_LOGO_SPACE_KEYS = Object.fromEntries(
  THEME_OPTIONS.flatMap((o) => {
    const k = THEME_LOGO_SPACE_KEYS[o.id];
    return k ? ([[o.id, k]] as const) : [];
  }),
) as Partial<Record<ThemeId, string>>;

export function getThemeBrandLogoSpaceKeyForCanonicalId(themeId: string): string | null {
  return THEME_BRAND_LOGO_SPACE_KEYS[themeId as ThemeId] ?? null;
}
