/**
 * Theme → logo URL resolution (server- and client-safe; no React hooks).
 *
 * **Canonical load order (`getThemeLogoLoadChain` → `getHeaderBrandLogoLoadChain`):**
 * 1. `/logos/{themeId}-brandlogo.png`                       — new RGBA-transparent PNGs (same-origin)
 * 2. `/branding/theme-logos/{themeId}brandlogo_transparent.png` — older committed PNGs (also transparent)
 * 3. CDN / Spaces URL                                        — network-dependent, may be stale
 * 4. `/logos/{themeId}-brandlogo.svg`                        — wordmark SVG (40/56 themes)
 * 5. `/logos/themes/nursenest-logo-{themeId}.svg`            — universal SVG safety net (all 56 themes)
 *
 * `theme-logo-map.ts` is the single source of truth for theme → asset key mapping.
 * This file builds ordered chains; `use-theme-logo.ts` wraps them as a React hook.
 *
 * Re-exports `getThemeLogo` / `getThemeLogoUrl` from `@/lib/branding/theme-brand-logo-cdn`.
 */
import { getPrimaryBrandMarkObjectKey, getSpacesBlueBrandLogoObjectKey, nursenestImagesSpaceObjectUrl } from "@/config/marketing-cdn.catalog";
import {
  COMMITTED_THEME_LOGO_PUBLIC_PREFIX,
  PRIMARY_LOGO_CDN_URL,
  PRIMARY_LOGO_URL,
} from "@/lib/branding/logo-config";
import {
  getThemeLogoPathForThemeId,
  getThemeLogoPngPathForThemeId,
  getThemeLogoSvgPathForThemeId,
  headerLogoModeForTheme,
  type HeaderLogoMode,
  resolveLogoForTheme,
  themeLogoObjectKeyForTheme,
} from "@/lib/branding/theme-logo-map";
import { getThemeLogoUrl } from "@/lib/branding/theme-brand-logo-cdn";
import {
  marketingImageUsesProxy,
  marketingProxyFallbackEnabled,
  marketingProxyPathForKey,
} from "@/lib/marketing-resolve-image-url";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";

/** @deprecated Compatibility alias; use `getThemeLogoPathForThemeId` directly. */
export const CANONICAL_BRAND_LOGO_LOCAL_PATH = getThemeLogoPathForThemeId(NURSENEST_DEFAULT_THEME);

function uniqueStrings(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    if (!u || seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}

/** Spaces object key for the theme logo — for `/api/marketing-assets/...`. */
export function getThemeLogoObjectKey(themeId: string): string {
  return themeLogoObjectKeyForTheme(themeId);
}

/** Public CDN URL for the active theme’s pre-colored logo raster (alias of {@link getThemeLogoUrl}). */
export function getThemeLogoPublicUrl(themeId: string): string {
  return getThemeLogoUrl(themeId);
}

export { getThemeLogo, getThemeLogoUrl } from "@/lib/branding/theme-brand-logo-cdn";

/**
 * Ordered URLs for `<img src>`: new canonical transparent PNGs first, then committed branding PNGs,
 * then CDN as secondary, then SVG fallbacks.
 *
 * Priority:
 *   1. /logos/{themeId}-brandlogo.png   — newly added RGBA-transparent PNGs (same-origin, verified)
 *   2. /branding/theme-logos/{themeId}brandlogo_transparent.png — older committed PNGs (also transparent)
 *   3. CDN URL                          — network-dependent; may be stale
 *   4. /logos/themes/nursenest-logo-{themeId}.svg — universal SVG (all 56 themes)
 */
export function getThemeLogoLoadChain(themeId?: string | null): string[] {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const defId = NURSENEST_DEFAULT_THEME;

  // CDN object key (may be a short alias for some themes via THEME_LOGO_FILENAME_BY_THEME_ID).
  const key = themeLogoObjectKeyForTheme(id);
  const defKey = themeLogoObjectKeyForTheme(defId);

  // New canonical transparent PNGs (/logos/{themeId}-brandlogo.png) — 34/56 themes have valid RGBA.
  const canonicalPng    = getThemeLogoPngPathForThemeId(id);
  const canonicalPngDef = id !== defId ? getThemeLogoPngPathForThemeId(defId) : null;

  // Older committed same-origin branding PNGs (26 themes have these; also verified transparent).
  const localStandard = `${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${id}brandlogo_transparent.png`;
  const localCdnKey   = `${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${key}`;
  const localDefStd   = `${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${defId}brandlogo_transparent.png`;

  // Universal SVG fallbacks (all 56 themes have /logos/themes/nursenest-logo-{themeId}.svg).
  const svgPath = getThemeLogoPathForThemeId(id);
  const svgFb   = id !== defId ? getThemeLogoPathForThemeId(defId) : null;

  const out: string[] = [];

  // 1. Canonical new transparent PNGs — highest priority, same-origin, no CDN dependency.
  out.push(canonicalPng);

  // 2. Older committed branding PNGs (standard pattern first, then CDN-key-based path).
  out.push(localStandard);
  if (localCdnKey !== localStandard) out.push(localCdnKey);

  // 3. CDN as tertiary source (network-dependent; object may differ from local committed file).
  out.push(resolveLogoForTheme(id));
  pushKeyVariants(out, key);

  // 4. Default-theme equivalents as belt-and-suspenders for non-default themes.
  if (id !== defId) {
    if (canonicalPngDef) out.push(canonicalPngDef);
    out.push(localDefStd);
    out.push(resolveLogoForTheme(defId));
    pushKeyVariants(out, defKey);
  }

  return uniqueStrings([
    ...out,
    ...(svgPath ? [svgPath] : []),
    ...(svgFb  ? [svgFb]  : []),
  ]);
}

const PRIMARY_BRAND_MARK_EXTENSIONS = [".svg", ".png", ".webp", ".jpg"] as const;

function stemFromObjectKey(objectKey: string): string {
  return objectKey.replace(/\.[^/.]+$/, "");
}

function pushKeyVariants(out: string[], objectKey: string) {
  const pub = nursenestImagesSpaceObjectUrl(objectKey);
  const proxy = marketingProxyPathForKey(objectKey);
  if (marketingImageUsesProxy()) {
    out.push(proxy, pub);
  } else if (marketingProxyFallbackEnabled()) {
    out.push(pub, proxy);
  } else {
    out.push(pub);
  }
}

/**
 * Tinted / mask-style header mark (catalog “primary” stem). Name retains “Blue” for history; assets are
 * transparent rasters from `marketing-cdn.catalog`, not arbitrary theme colors.
 */
export function getBlueBrandMarkLoadChain(): string[] {
  const key = getPrimaryBrandMarkObjectKey();
  if (!key) return [];
  const stem = stemFromObjectKey(key);
  const out: string[] = [];
  const canonicalBlue = getSpacesBlueBrandLogoObjectKey();
  if (canonicalBlue && canonicalBlue !== key) {
    pushKeyVariants(out, canonicalBlue);
  }
  for (const ext of PRIMARY_BRAND_MARK_EXTENSIONS) {
    pushKeyVariants(out, `${stem}${ext}`);
  }
  return uniqueStrings(out);
}

/**
 * Full `<img>` try chain for the marketing header wordmark (`SiteBrandLogoMark` / `useThemeLogo`).
 *
 * The new canonical transparent PNGs (/logos/{themeId}-brandlogo.png) are the primary source
 * for all header modes, since they are same-origin, verified RGBA-transparent, and independent
 * of CDN state.  SVG variants (wordmark and universal) follow as text-based transparent fallbacks.
 * CDN and committed branding PNGs are included via `getThemeLogoLoadChain` as secondary/tertiary.
 */
export function getHeaderBrandLogoLoadChain(themeId?: string | null, preferredMode?: HeaderLogoMode): string[] {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const mode = preferredMode ?? headerLogoModeForTheme(id);
  // Full raster + CDN + committed chain (canonical PNG is already #1 inside this chain).
  const themeRasterChain = getThemeLogoLoadChain(id);
  // SVG fallbacks: wordmark SVG for 40/56 themes, universal themes/ SVG for all 56.
  const themeSvg     = getThemeLogoSvgPathForThemeId(id); // /logos/{themeId}-brandlogo.svg
  const universalSvg = getThemeLogoPathForThemeId(id);    // /logos/themes/nursenest-logo-{themeId}.svg
  if (mode === "light-header") {
    // On light surfaces, SVG (theme-colored, good contrast) before rasters.
    return uniqueStrings([themeSvg, universalSvg, ...themeRasterChain, PRIMARY_LOGO_URL, PRIMARY_LOGO_CDN_URL]);
  }
  // Dark-header: rasters first (canonical PNG → committed PNG → CDN), then SVGs.
  return uniqueStrings([...themeRasterChain, themeSvg, universalSvg, PRIMARY_LOGO_URL, PRIMARY_LOGO_CDN_URL]);
}

