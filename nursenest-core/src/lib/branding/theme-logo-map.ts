/**
 * Single source of truth for theme → logo mapping.
 *
 * Each theme has TWO canonical Spaces assets:
 *   full — leaf icon + "NurseNest" wordmark  (header / footer / auth)
 *   leaf — leaf icon only, tight-cropped      (404 / error / compact UI)
 *
 * All keys point into the nursenest-images bucket. Filenames follow the uploaded
 * transparent rasters in `Logos/` (mixed naming: `*logo_transparent.png`, `*-leaf-transparent.png`, etc.).
 *
 * DO NOT add per-theme logo paths anywhere else — always delegate to
 * themeLogoObjectKeyForTheme(id, variant).
 */
import { nursenestImagesSpaceObjectUrl } from "@/config/marketing-cdn.catalog";
import { relativeLuminanceFromHex } from "@/lib/color/hex-luminance";
import { marketingImageUsesProxy, marketingProxyFallbackEnabled, marketingProxyPathForKey } from "@/lib/marketing-resolve-image-url";
import { getThemeSurfaceContrastTokens } from "@/lib/theme/theme-palette-tokens";
import { NURSENEST_DEFAULT_THEME, THEME_OPTIONS, type ThemeOption } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";

const AVAILABLE_THEME_IDS = new Set(THEME_OPTIONS.map((theme) => theme.id));
export type ThemeId = ThemeOption["id"];

/** Which logo asset to load: full wordmark or leaf-only icon. */
export type ThemeLogoVariant = "full" | "leaf";

type ThemeLogoEntry = {
  /** Spaces key: full leaf + wordmark (transparent). */
  full: string;
  /** Spaces key: leaf icon only, tight-cropped (transparent). */
  leaf: string;
};

/**
 * Canonical Spaces object keys for every theme's two logo variants.
 *
 * full / leaf → see `THEME_LOGO_ENTRIES` (leaf may reuse the full raster when only one asset exists).
 *
 * This is the ONLY place theme→logo keys are defined.
 * All 40 required themes have explicit entries.
 * Any unlisted theme falls through to a computed key using the same pattern.
 */
const THEME_LOGO_ENTRIES: Readonly<Record<string, ThemeLogoEntry>> = {
  // ── Clinical / Default ──
  /** Default “Clinical Blue” theme — shares the uploaded clinical-light transparent mark until a dedicated `ocean` raster exists on Spaces. */
  ocean:               { full: "Logos/clinicallight-transparent.png",    leaf: "Logos/clinicallight-transparent.png" },
  "clinical-light":    { full: "Logos/clinicallight-transparent.png",    leaf: "Logos/clinicallight-transparent.png" },

  // ── Named production themes ──
  "blueberry-sherbet": { full: "Logos/blueberry_sherbet_logo.png",       leaf: "Logos/blueberry_sherbet_logo.png" },
  "strawberry-cream":  { full: "Logos/strawberry-cream-leaf_transparent.png", leaf: "Logos/strawberry-cream-leaf_transparent.png" },
  "ocean-mist":        { full: "Logos/oceanmist-transparent.png",        leaf: "Logos/leaf-only/ocean-mist-leaf_transparent.png" },
  "lavender-dream":    { full: "Logos/lavenderdreamlogo_transparent.png", leaf: "Logos/lavenderdreamlogo_transparent.png" },
  "mint-breeze":       { full: "Logos/mintbreeze-transparent.png",       leaf: "Logos/leaf-only/mint-breeze-leaf_transparent.png" },
  "rose-quartz":       { full: "Logos/rosequartz-transparent.png",       leaf: "Logos/leaf-only/rose-quartz-leaf_transparent.png" },
  "golden-hour":       { full: "Logos/goldenhourlogo_transparent.png",   leaf: "Logos/goldenhourlogo_transparent.png" },
  "sage-garden":       { full: "Logos/sagegardenlogo-transparent.png",   leaf: "Logos/sagegardenlogo-transparent.png" },
  "coral-sunset":      { full: "Logos/coralsunsetlogo_transparent.png",  leaf: "Logos/coralsunsetlogo_transparent.png" },
  "arctic-frost":      { full: "Logos/arcticfrost-transparent.png",      leaf: "Logos/arcticfrost-transparent_transparent(2)_leaf.png" },
  "plum-velvet":       { full: "Logos/plumvelvet-transparent.png",       leaf: "Logos/leaf-only/plum-velvet-leaf_transparent.png" },
  "honey-cream":       { full: "Logos/honeycreamlogo_transparent.png",   leaf: "Logos/honeycreamlogo_transparent.png" },
  "dusty-rose":        { full: "Logos/dustyroselogo_transparent.png",    leaf: "Logos/dustyroselogo_transparent.png" },
  "midnight-indigo":   { full: "Logos/midnightindigo-transparent.png",   leaf: "Logos/leaf-only/midnight-indigo-leaf_transparent.png" },
  "deep-twilight":     { full: "Logos/deeptwilightlogo_transparent.png", leaf: "Logos/deeptwilightlogo_transparent.png" },

  // ── Pink family ──
  blush:               { full: "Logos/blush-transparent.png",            leaf: "Logos/leaf-only/blush-leaf_transparent.png" },
  "pastel-blush":      { full: "Logos/pastelblush-transparent.png",      leaf: "Logos/leaf-only/pastel-blush-leaf_transparent.png" },
  strawberry:          { full: "Logos/strawberry-transparent.png",       leaf: "Logos/leaf-only/strawberry-leaf_transparent.png" },
  "rose-gold":         { full: "Logos/rosegold-transparent.png",         leaf: "Logos/leaf-only/rose-gold-leaf_transparent.png" },
  coral:               { full: "Logos/corallogo_transparent.png",        leaf: "Logos/corallogo_transparent.png" },

  // ── Mint / Teal family ──
  mint:                { full: "Logos/mint-transparent.png",             leaf: "Logos/leaf-only/mint-leaf_transparent.png" },
  "pastel-mint":       { full: "Logos/pastelmint-transparent.png",       leaf: "Logos/leaf-only/pastel-mint-leaf_transparent.png" },
  teal:                { full: "Logos/teal-leaf_transparent.png",        leaf: "Logos/teal-leaf_transparent.png" },
  forest:              { full: "Logos/forestlogo_transparent.png",       leaf: "Logos/forestlogo_transparent.png" },
  "soft-sage":         { full: "Logos/softsage-transparent.png",         leaf: "Logos/leaf-only/soft-sage-leaf_transparent.png" },

  // ── Multi-pastel ──
  "multi-pastel":      { full: "Logos/multipastel-transparent.png",      leaf: "Logos/leaf-only/multi-pastel-leaf_transparent.png" },

  // ── Lavender / Purple family ──
  lavender:            { full: "Logos/lavender-transparent.png",         leaf: "Logos/leaf-only/lavender-leaf_transparent.png" },
  "pastel-lavender":   { full: "Logos/pastellavender-transparent.png",   leaf: "Logos/leaf-only/pastel-lavender-leaf_transparent.png" },
  "pastel-lilac":      { full: "Logos/pastellilac-transparent.png",      leaf: "Logos/leaf-only/pastel-lilac-leaf_transparent.png" },
  berry:               { full: "Logos/berrylogo_transparent.png",        leaf: "Logos/berrylogo-transparent.png" },
  indigo:              { full: "Logos/indigo-transparent.png",           leaf: "Logos/leaf-only/indigo-leaf_transparent.png" },

  // ── Neutral ──
  slate:               { full: "Logos/slate-leaf_transparent.png",         leaf: "Logos/slate-leaf_transparent.png" },
  midnight:            { full: "Logos/midnight-transparent.png",         leaf: "Logos/leaf-only/midnight-leaf_transparent.png" },
  "neutral-sand":      { full: "Logos/sandlogo.-transparentpng.png",     leaf: "Logos/sandlogo.-transparentpng.png" },
  "neutral-slate":     { full: "Logos/neutralslate-transparent.png",     leaf: "Logos/leaf-only/neutral-slate-leaf_transparent.png" },

  // ── Dark ──
  "dark-mode":         { full: "Logos/darkmode-transparent.png",         leaf: "Logos/leaf-only/dark-mode-leaf_transparent.png" },
  "dark-clinical":     { full: "Logos/darkcllinicallogo_transparent.png", leaf: "Logos/darkcllinicallogo_transparent.png" },
  "dark-academia":     { full: "Logos/darkacademia-transparent.png",     leaf: "Logos/leaf-only/dark-academia-leaf_transparent.png" },

  // ── Pink family (named) ──
  "petal-pop":         { full: "Logos/petal-pop-leaf-transparent.png",   leaf: "Logos/petal-pop-leaf-transparent.png" },
  "cotton-candy":      { full: "Logos/cottoncandy-transparent.png",      leaf: "Logos/leaf-only/cotton-candy-leaf_transparent.png" },
  "pink-skies":        { full: "Logos/pink-skies-leaf-transparent.png", leaf: "Logos/pink-skies-leaf-transparent.png" },
  "berry-bonbon":      { full: "Logos/berry-bonbon-logo-transparent.png", leaf: "Logos/berry-bonbon-logo-transparent.png" },
  // Mint / Teal family (named)
  "evergreen-steel":   { full: "Logos/evergreen-steel-logo-transparent.png", leaf: "Logos/evergreen-steel-logo-transparent.png" },
  // Multi-pastel (named)
  "pastel-party":      { full: "Logos/pastel-party-leaf-transparent.png", leaf: "Logos/pastel-party-leaf-transparent.png" },
  "rainbow-sherbet":   { full: "Logos/rainbow-sherbet-leaf-transparent.png", leaf: "Logos/rainbow-sherbet-leaf-transparent.png" },
  // Lavender / Purple family (named)
  "sunny-lilac":       { full: "Logos/sunny-lilac-leaf-transparent.png", leaf: "Logos/sunny-lilac-leaf-transparent.png" },
  "sky-kiss":          { full: "Logos/skykiss-transparent.png",          leaf: "Logos/leaf-only/sky-kiss-leaf_transparent.png" },
  "bluebird":          { full: "Logos/bluebird-leaf-transparent.png",    leaf: "Logos/bluebird-leaf-transparent.png" },
  "violet-night":      { full: "Logos/violet-night-leaf-transparent.png", leaf: "Logos/violet-night-leaf-transparent.png" },
  "plum-mist":         { full: "Logos/plum-mist-leaf-transparent.png",   leaf: "Logos/plum-mist-leaf-transparent.png" },
  // Neutral (named)
  "graphite-blue":     { full: "Logos/graphite-blue-leaf-transparent.png", leaf: "Logos/graphite-blue-leaf-transparent.png" },
  "north-sea":         { full: "Logos/north-sea-leaf-transparent.png",     leaf: "Logos/north-sea-leaf-transparent.png" },
  // Dark (named)
  "midnight-ink":      { full: "Logos/midnight-ink-leaf-transparent.png", leaf: "Logos/midnight-ink-leaf-transparent.png" },
  "storm-slate":       { full: "Logos/storm-slate-leaf-transparent.png", leaf: "Logos/storm-slate-leaf-transparent.png" },
};

/**
 * Themes whose `Logos/…` keys are still placeholders (no confirmed transparent raster on Spaces).
 * Upload assets matching the keys in `THEME_LOGO_ENTRIES`, then remove the id from this list.
 */
export const THEMES_PENDING_CDN_ASSETS: readonly string[] = [
  "cotton-candy",
  "sky-kiss",
  "ocean-mist",
  "mint-breeze",
  "rose-quartz",
  "plum-velvet",
  "midnight-indigo",
] as const;

/** True when the given theme id has a pending CDN asset upload. */
export function themeLogoHasPendingAssets(themeId: string): boolean {
  return (THEMES_PENDING_CDN_ASSETS as readonly string[]).includes(themeId);
}

/**
 * Spaces object key for a theme's logo.
 *
 * @param themeId  - canonical theme id (or alias; normalised internally)
 * @param variant  - "full" (default) = wordmark; "leaf" = icon only
 */
export function themeLogoObjectKeyForTheme(
  themeId?: string | null,
  variant: ThemeLogoVariant = "full",
): string {
  const canonicalThemeId = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const resolvedThemeId = AVAILABLE_THEME_IDS.has(canonicalThemeId) ? canonicalThemeId : NURSENEST_DEFAULT_THEME;
  const entry = THEME_LOGO_ENTRIES[resolvedThemeId];
  if (entry) return entry[variant];
  // Computed fallback for any theme not yet in the explicit map.
  if (variant === "leaf") return `Logos/leaf-only/${resolvedThemeId}-leaf_transparent.png`;
  return `Logos/${resolvedThemeId.replace(/-/g, "")}-transparent.png`;
}

/**
 * Backwards-compat alias for the full-wordmark object key only.
 * @deprecated Prefer `themeLogoObjectKeyForTheme(id, "full")`.
 */
export const THEME_LOGO_FILENAME_BY_THEME_ID: Readonly<Record<string, string>> =
  Object.fromEntries(Object.entries(THEME_LOGO_ENTRIES).map(([k, v]) => [k, v.full]));

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
