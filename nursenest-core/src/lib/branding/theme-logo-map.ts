/**
 * Single source of truth for theme -> logo mapping.
 *
 * All explicit per-theme Spaces logo filenames live here only.
 * Object keys follow the pattern: Logos/{themeId-nohyphens}-transparent.png
 * (confirmed naming convention from nursenest-images/Logos/ bucket folder).
 *
 * Do NOT add per-theme logo overrides elsewhere — delegate to themeLogoObjectKeyForTheme.
 */
import { nursenestImagesSpaceObjectUrl } from "@/config/marketing-cdn.catalog";
import { relativeLuminanceFromHex } from "@/lib/color/hex-luminance";
import { marketingImageUsesProxy, marketingProxyFallbackEnabled, marketingProxyPathForKey } from "@/lib/marketing-resolve-image-url";
import { getThemeSurfaceContrastTokens } from "@/lib/theme/theme-palette-tokens";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS, type ThemeOption } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";

const AVAILABLE_THEME_IDS = new Set(THEME_OPTIONS.map((theme) => theme.id));
export type ThemeId = ThemeOption["id"];

/**
 * Canonical Spaces object keys for each theme's final uploaded transparent logo.
 * All files live in the nursenest-images bucket under the Logos/ prefix.
 * Naming: Logos/{themeId-with-hyphens-removed}-transparent.png
 *
 * This is the ONLY place theme→logo key mappings are defined. Every theme in the
 * required set has an explicit entry. Themes not listed fall back to the same computed
 * Logos/ pattern via themeLogoObjectKeyForTheme.
 */
export const THEME_LOGO_FILENAME_BY_THEME_ID: Readonly<Record<string, string>> = {
  // ── Clinical / Default ──
  ocean:               "Logos/ocean-transparent.png",
  "clinical-light":    "Logos/clinicallight-transparent.png",

  // ── Named production themes ──
  "blueberry-sherbet": "Logos/blueberrysherbet-transparent.png",
  "strawberry-cream":  "Logos/strawberrycream-transparent.png",
  "ocean-mist":        "Logos/oceanmist-transparent.png",
  "lavender-dream":    "Logos/lavenderdream-transparent.png",
  "mint-breeze":       "Logos/mintbreeze-transparent.png",
  "rose-quartz":       "Logos/rosequartz-transparent.png",
  "golden-hour":       "Logos/goldenhour-transparent.png",
  "sage-garden":       "Logos/sagegarden-transparent.png",
  "coral-sunset":      "Logos/coralsunset-transparent.png",
  "arctic-frost":      "Logos/arcticfrost-transparent.png",
  "plum-velvet":       "Logos/plumvelvet-transparent.png",
  "honey-cream":       "Logos/honeycream-transparent.png",
  "dusty-rose":        "Logos/dustyrose-transparent.png",
  "midnight-indigo":   "Logos/midnightindigo-transparent.png",
  "deep-twilight":     "Logos/deeptwilight-transparent.png",

  // ── Pink family ──
  blush:               "Logos/blush-transparent.png",
  "pastel-blush":      "Logos/pastelblush-transparent.png",
  strawberry:          "Logos/strawberry-transparent.png",
  "rose-gold":         "Logos/rosegold-transparent.png",
  coral:               "Logos/coral-transparent.png",

  // ── Mint / Teal family ──
  mint:                "Logos/mint-transparent.png",
  "pastel-mint":       "Logos/pastelmint-transparent.png",
  teal:                "Logos/teal-transparent.png",
  forest:              "Logos/forest-transparent.png",
  "soft-sage":         "Logos/softsage-transparent.png",

  // ── Multi-pastel ──
  "multi-pastel":      "Logos/multipastel-transparent.png",

  // ── Lavender / Purple family ──
  lavender:            "Logos/lavender-transparent.png",
  "pastel-lavender":   "Logos/pastellavender-transparent.png",
  "pastel-lilac":      "Logos/pastellilac-transparent.png",
  berry:               "Logos/berry-transparent.png",
  indigo:              "Logos/indigo-transparent.png",

  // ── Neutral ──
  slate:               "Logos/slate-transparent.png",
  midnight:            "Logos/midnight-transparent.png",
  "neutral-sand":      "Logos/neutralsand-transparent.png",
  "neutral-slate":     "Logos/neutralslate-transparent.png",

  // ── Dark ──
  "dark-mode":         "Logos/darkmode-transparent.png",
  "dark-clinical":     "Logos/darkclinical-transparent.png",
  "dark-academia":     "Logos/darkacademia-transparent.png",
};

export function themeLogoObjectKeyForTheme(themeId?: string | null): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const resolvedThemeId = AVAILABLE_THEME_IDS.has(canonicalThemeId) ? canonicalThemeId : NURSENEST_DEFAULT_THEME;
  // Explicit map first. For any theme not listed, compute the standard Logos/ key.
  return (
    THEME_LOGO_FILENAME_BY_THEME_ID[resolvedThemeId] ??
    `Logos/${resolvedThemeId.replace(/-/g, "")}-transparent.png`
  );
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
 * Primary canonical local transparent PNG for the theme.
 * These are the "newly added transparent logo files" at /public/logos/{themeId}-brandlogo.png.
 * 34 of 56 themes have valid RGBA PNG here; the other 22 fall through via onerror.
 */
export function getThemeLogoPngPathForThemeId(themeId?: string | null): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const resolvedThemeId = AVAILABLE_THEME_IDS.has(canonicalThemeId)
    ? canonicalThemeId
    : NURSENEST_DEFAULT_THEME;
  return `/logos/${resolvedThemeId}-brandlogo.png`;
}

/**
 * Canonical local SVG fallback assets (all 56 themes have this file).
 */
export function getThemeLogoPathForThemeId(themeId?: string | null): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const resolvedThemeId = AVAILABLE_THEME_IDS.has(canonicalThemeId)
    ? canonicalThemeId
    : NURSENEST_DEFAULT_THEME;
  return `/logos/themes/nursenest-logo-${resolvedThemeId}.svg`;
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
  const semantic = getThemeSurfaceContrastTokens(canonicalThemeId);
  const surface = semantic?.navBackground;
  const navForeground = semantic?.navForeground;
  if (!surface) return "dark-header";
  const luminance = relativeLuminanceFromHex(surface);
  // Deterministic rule: darker/saturated header surfaces use dark-header mark assets.
  // If nav foreground is white-ish, we keep dark-header mode to preserve contrast.
  if (navForeground) {
    const fgLuminance = relativeLuminanceFromHex(navForeground);
    if (fgLuminance > 0.8) return "dark-header";
  }
  return luminance < 0.5 ? "dark-header" : "light-header";
}
