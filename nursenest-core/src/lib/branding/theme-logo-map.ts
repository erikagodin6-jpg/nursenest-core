/**
 * Single source of truth for theme -> logo mapping.
 *
 * Keep all explicit per-theme Spaces logo filenames in this file only.
 */
import { nursenestImagesSpaceObjectUrl } from "@/config/marketing-cdn.catalog";
import { relativeLuminanceFromHex } from "@/lib/color/hex-luminance";
import { marketingImageUsesProxy, marketingProxyFallbackEnabled, marketingProxyPathForKey } from "@/lib/marketing-resolve-image-url";
import { getThemePaletteTokens } from "@/lib/theme/theme-palette-tokens";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS, type ThemeOption } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";

const AVAILABLE_THEME_IDS = new Set(THEME_OPTIONS.map((theme) => theme.id));
export type ThemeId = ThemeOption["id"];

/**
 * Dedicated uploaded logo filenames in Spaces for specific themes.
 * If a theme is missing here, it falls back to the legacy `{themeId}brandlogo_transparent.png` key.
 */
export const THEME_LOGO_FILENAME_BY_THEME_ID: Readonly<Partial<Record<ThemeId, string>>> = {
  "pastel-lavender": "pastellavenderlogo.png",
  "pastel-lilac": "pastellilaclogo.png",
  "pastel-mint": "pastelmintlogo.png",
  "rose-gold": "rosegoldlogo.png",
  "rose-quartz": "rosequartzlogo.png",
  "neutral-sand": "sandlogo.png",
  "neutral-slate": "slatelogo.png",
  "soft-sage": "softsagelogo.png",
  "strawberry-cream": "strawberrycreamlogo.png",
  strawberry: "strawberrylogo.png",
  teal: "teallogo.png",
};

export function themeLogoObjectKeyForTheme(themeId?: string | null): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const resolvedThemeId = AVAILABLE_THEME_IDS.has(canonicalThemeId) ? canonicalThemeId : NURSENEST_DEFAULT_THEME;
  return THEME_LOGO_FILENAME_BY_THEME_ID[resolvedThemeId] ?? `${resolvedThemeId}brandlogo_transparent.png`;
}

/**
 * Canonical runtime logo URL for the active theme using existing Spaces/CDN/proxy conventions.
 * Use this for top-level brand rendering.
 */
export function resolveLogoForTheme(themeId?: string | null): string {
  const objectKey = themeLogoObjectKeyForTheme(themeId);
  const proxy = marketingProxyPathForKey(objectKey);
  const publicUrl = nursenestImagesSpaceObjectUrl(objectKey);
  if (marketingImageUsesProxy()) return proxy;
  if (marketingProxyFallbackEnabled()) return publicUrl;
  return publicUrl;
}

/**
 * Canonical local fallback assets used when Spaces logo loading fails.
 */
export function getThemeLogoPathForThemeId(themeId?: string | null): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const resolvedThemeId = AVAILABLE_THEME_IDS.has(canonicalThemeId)
    ? canonicalThemeId
    : NURSENEST_DEFAULT_THEME;
  return `/logos/themes/nursenest-logo-${resolvedThemeId}.png`;
}

export const THEME_LOCAL_LOGO_MAP: Record<string, string> = Object.fromEntries(
  THEME_OPTIONS.map((theme) => [theme.id, getThemeLogoPathForThemeId(theme.id)]),
);

/** @deprecated Use `THEME_LOCAL_LOGO_MAP`. */
export const THEME_LOGO_MAP = THEME_LOCAL_LOGO_MAP;

export type HeaderLogoMode = "dark-header" | "light-header";

/** Theme-specific local SVG wordmark path used as a light-header-first candidate. */
export function getThemeLogoSvgPathForThemeId(themeId?: string | null): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const resolvedThemeId = AVAILABLE_THEME_IDS.has(canonicalThemeId)
    ? canonicalThemeId
    : NURSENEST_DEFAULT_THEME;
  return `/logos/${resolvedThemeId}-brandlogo.svg`;
}

/**
 * Deterministic header logo mode based on tokenized header/topbar surface luminance.
 * Dark surfaces use dark-header mode (prefer high-contrast raster chain first).
 */
export function headerLogoModeForTheme(themeId?: string | null): HeaderLogoMode {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const palette = getThemePaletteTokens(canonicalThemeId);
  const surface = palette?.topBarBackground ?? palette?.navBackground;
  if (!surface) return "dark-header";
  const luminance = relativeLuminanceFromHex(surface);
  return luminance < 0.47 ? "dark-header" : "light-header";
}
