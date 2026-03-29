/**
 * Theme-aware brand mark URLs: `THEME_LOGO_MAP` + DigitalOcean Spaces CDN base.
 */
import {
  NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL,
  nursenestImagesSpaceObjectUrl,
} from "@/config/marketing-cdn.catalog";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";
import { THEME_LOGO_MAP } from "./theme-logo-map";

/** Same as `NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL` — public raster base for theme marks. */
export const MARKETING_CDN_PUBLIC_BASE = NURSENEST_IMAGES_SPACE_PUBLIC_BASE_URL;

export const THEME_LOGO_FALLBACK_ID = NURSENEST_DEFAULT_THEME;

export const THEME_BRAND_LOGO_PREFIX = "branding/themes" as const;

type LogoVariantKey = keyof typeof THEME_LOGO_MAP;

function resolveLogoVariantKey(canonicalThemeId: string): LogoVariantKey {
  const id = normalizeThemeIdForLogo(canonicalThemeId);
  if (id === "berry") return "berry";
  if (id === "clinical-light" || id === "ocean") return "blue";
  if (
    id === "dark-mode" ||
    id === "dark-clinical" ||
    id === "dark-academia" ||
    id === "midnight"
  ) {
    return "dark";
  }
  return "default";
}

/** Same-origin path (includes query string when present) for `<img src>` fallback. */
export function getThemeLogoPublicPath(theme: string | undefined): string {
  if (!theme) return THEME_LOGO_MAP.default;
  const variant = resolveLogoVariantKey(theme);
  return THEME_LOGO_MAP[variant];
}

/** Spaces object key only (no leading slash, no query). */
export function themeLogoObjectKeyForVariant(variantKey: LogoVariantKey): string {
  const raw = THEME_LOGO_MAP[variantKey];
  return raw.replace(/^\/+/, "").split("?")[0]!;
}

export function getThemeLogoObjectKeyFromNormalizedId(themeId: string): string {
  const id = normalizeThemeIdForLogo(themeId);
  const variant = resolveLogoVariantKey(id);
  return themeLogoObjectKeyForVariant(variant);
}

function absoluteCdnUrlForRelativeLogoPath(relativePath: string): string {
  const key = relativePath.replace(/^\/+/, "").split("?")[0]!;
  const q = relativePath.includes("?") ? `?${relativePath.split("?")[1]}` : "";
  return `${nursenestImagesSpaceObjectUrl(key)}${q}`;
}

/**
 * Public CDN URL for the theme’s logo raster (canonical theme id or alias string).
 */
export function getThemeLogo(theme: string | undefined): string {
  if (theme == null || String(theme).trim() === "") {
    return absoluteCdnUrlForRelativeLogoPath(THEME_LOGO_MAP.default);
  }
  const variant = resolveLogoVariantKey(theme);
  return absoluteCdnUrlForRelativeLogoPath(THEME_LOGO_MAP[variant]);
}

export const THEME_BRAND_LOGO_CDN_BY_ID = Object.fromEntries(
  THEME_OPTIONS.map((t) => [t.id, getThemeLogo(t.id)] as const),
) as Record<(typeof THEME_OPTIONS)[number]["id"], string>;

export function getThemeBrandLogoCdnUrlForCanonicalId(themeId: string): string {
  return getThemeLogo(themeId);
}

export function themeBrandLogoObjectKey(themeId: string): string {
  return getThemeLogoObjectKeyFromNormalizedId(themeId);
}
