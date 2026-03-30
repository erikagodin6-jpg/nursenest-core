/**
 * Unified theme logo URLs for the `nursenest-images` DigitalOcean Spaces CDN.
 *
 * - **Primary API:** {@link getThemeLogoUrl} — canonical CDN URL for a theme id (object keys in `theme-brand-logo-space-keys.ts`).
 * - **UI:** use `SiteBrandLogoMark` (`getHeaderBrandLogoLoadChain` adds proxy / local SVG / legacy fallbacks).
 * - **Base URL:** `marketing-cdn.catalog.json` → `digitalOceanSpaces.nursenestImages.publicBaseUrl` (override via catalog / asset generation, not ad-hoc strings).
 */
import { getThemeBrandLogoSpaceKeyForCanonicalId } from "@/config/theme-brand-logo-space-keys";
import {
  NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL,
  nursenestImagesSpaceObjectUrl,
} from "@/config/marketing-cdn.catalog";
import { LOCAL_BRAND_MARK_PATH } from "@/lib/branding/logo-config";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";

/** Same as `NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL` — public raster base for theme marks. */
export const MARKETING_CDN_PUBLIC_BASE = NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL;

export const THEME_LOGO_FALLBACK_ID = NURSENEST_DEFAULT_THEME;

/** Legacy prefix for docs / discovery scripts (bucket paths use root filenames from space-keys). */
export const THEME_BRAND_LOGO_PREFIX = "branding/themes" as const;

/**
 * Public CDN URL for the theme’s pre-colored brand raster on DigitalOcean Spaces (`nursenest-images` CDN).
 * Canonical entry point for theme logo URLs — uses real object keys (e.g. `lavenderbrandlogo.png`).
 */
export function getThemeLogoUrl(themeId?: string | null): string {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const key = getThemeBrandLogoSpaceKeyForCanonicalId(id);
  return nursenestImagesSpaceObjectUrl(key);
}

/** @deprecated Use {@link getThemeLogoUrl} — same behavior. */
export function getThemeLogo(theme: string | undefined): string {
  return getThemeLogoUrl(theme);
}

export const THEME_BRAND_LOGO_CDN_BY_ID = Object.fromEntries(
  THEME_OPTIONS.map((t) => [t.id, getThemeLogoUrl(t.id)] as const),
) as Record<(typeof THEME_OPTIONS)[number]["id"], string>;

export function getThemeBrandLogoCdnUrlForCanonicalId(themeId: string): string {
  return getThemeLogoUrl(themeId);
}

export function themeBrandLogoObjectKey(themeId: string): string {
  return getThemeLogoObjectKeyFromNormalizedId(themeId);
}

/** Spaces object key for the theme logo — for `/api/marketing-assets/...` and CDN URLs. */
export function getThemeLogoObjectKeyFromNormalizedId(themeId: string): string {
  const id = normalizeThemeIdForLogo(themeId);
  return getThemeBrandLogoSpaceKeyForCanonicalId(id);
}

/** Same-origin path for `<img src>` — committed SVG, all themes. */
export function getThemeLogoPublicPath(_theme: string | undefined): string {
  return LOCAL_BRAND_MARK_PATH;
}
