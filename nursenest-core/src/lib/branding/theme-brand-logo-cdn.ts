/**
 * Theme wordmark URLs for marketing helpers. {@link resolveThemeLogo} returns same-origin `/logos/…` SVGs;
 * Spaces keys below remain for legacy `/api/marketing-assets` and catalog tooling.
 */
import { getThemeBrandLogoSpaceKeyForCanonicalId } from "@/config/theme-brand-logo-space-keys";
import { NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL } from "@/config/marketing-cdn.catalog";
import { resolveThemeLogo } from "@/lib/branding/resolve-theme-logo";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { parseRegisteredThemeId } from "@/lib/theme/theme-logo-resolve";

/** Same as `NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL` — public raster base for theme marks. */
export const MARKETING_CDN_PUBLIC_BASE = NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL;

export const THEME_LOGO_FALLBACK_ID = NURSENEST_DEFAULT_THEME;

/** Legacy prefix for docs / discovery scripts (bucket paths use root filenames from space-keys). */
export const THEME_BRAND_LOGO_PREFIX = "branding/themes" as const;

/** CDN URL per theme id when mapped; unmapped themes are omitted. */
export const THEME_BRAND_LOGO_CDN_BY_ID = Object.fromEntries(
  THEME_OPTIONS.flatMap((t) => {
    const r = resolveThemeLogo(t.id, "full");
    return r.kind === "local" && r.url ? ([[t.id, r.url]] as const) : [];
  }),
) as Partial<Record<(typeof THEME_OPTIONS)[number]["id"], string>>;

/** Public CDN URL for the theme’s mapped raster, or null when unmapped. */
export function getThemeLogoUrl(themeId?: string | null): string | null {
  const id = parseRegisteredThemeId(themeId ?? NURSENEST_DEFAULT_THEME);
  if (!id) return null;
  return resolveThemeLogo(id, "full").url;
}

/** @deprecated Use {@link getThemeLogoUrl} — same behavior. */
export function getThemeLogo(theme: string | undefined): string | null {
  return getThemeLogoUrl(theme);
}

export function getThemeBrandLogoCdnUrlForCanonicalId(themeId: string): string | null {
  return getThemeLogoUrl(themeId);
}

export function themeBrandLogoObjectKey(themeId: string): string | null {
  return getThemeLogoObjectKeyFromNormalizedId(themeId);
}

/** Spaces object key for the theme logo — for `/api/marketing-assets/...` and CDN URLs. */
export function getThemeLogoObjectKeyFromNormalizedId(themeId: string): string | null {
  const id = parseRegisteredThemeId(themeId);
  if (!id) return null;
  return getThemeBrandLogoSpaceKeyForCanonicalId(id);
}

/** Same-origin SVG path for a registered theme id, or null when unknown. */
export function getThemeLogoPublicPath(theme: string | undefined): string | null {
  const id = parseRegisteredThemeId(theme ?? NURSENEST_DEFAULT_THEME);
  if (!id) return null;
  const r = resolveThemeLogo(id, "full");
  return r.kind === "local" ? r.url : null;
}
