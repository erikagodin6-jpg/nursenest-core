/**
 * Theme id → Spaces object key for nursenest-images CDN rasters.
 * Resolution (direct + family borrow): {@link themeLogoSpaceKeyForRegisteredTheme} in `resolve-theme-logo.ts`.
 */
import { themeLogoSpaceKeyForRegisteredTheme } from "@/lib/branding/resolve-theme-logo";
import { THEME_OPTIONS, type ThemeOption } from "@/lib/theme/theme-registry";

export type ThemeId = ThemeOption["id"];

/** Every registered theme id → Spaces key (includes borrowed keys for themes without a dedicated asset). */
export const THEME_BRAND_LOGO_SPACE_KEYS = Object.fromEntries(
  THEME_OPTIONS.map((o) => {
    const k = themeLogoSpaceKeyForRegisteredTheme(o.id, "full");
    if (!k) throw new Error(`theme-brand-logo-space-keys: missing logo key for ${o.id}`);
    return [o.id, k] as const;
  }),
) as Record<ThemeId, string>;

export function getThemeBrandLogoSpaceKeyForCanonicalId(themeId: string): string | null {
  return THEME_BRAND_LOGO_SPACE_KEYS[themeId as ThemeId] ?? null;
}
