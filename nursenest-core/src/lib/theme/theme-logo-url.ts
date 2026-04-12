/**
 * Theme → logo URL resolution (server- and client-safe; no React hooks).
 *
 * **Precedence for raster wordmarks (`getThemeLogoLoadChain`):**
 * 1. Theme-specific Spaces asset URL(s), using existing CDN/proxy conventions
 * 2. Same-origin committed PNG fallback: `/branding/theme-logos/{objectKey}`
 * 3. Repeat for the default theme (`NURSENEST_DEFAULT_THEME`)
 * 4. Same-origin committed SVG fallback (`/logos/themes/...`) as the final safety net only
 *
 * **Header pipeline (`getHeaderBrandLogoLoadChain`)** uses strict NurseNest brand assets only.
 * No generic logo placeholders are included in the chain.
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
 * Ordered URLs for `<img src>`: theme-specific Spaces asset first, then default-theme fallbacks.
 */
export function getThemeLogoLoadChain(themeId?: string | null): string[] {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const defId = NURSENEST_DEFAULT_THEME;

  const key = themeLogoObjectKeyForTheme(id);
  const defKey = themeLogoObjectKeyForTheme(defId);
  const local = `${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${key}`;
  const localFb = `${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${defKey}`;
  const svgPath = getThemeLogoPathForThemeId(id);
  const svgFb = id !== defId ? getThemeLogoPathForThemeId(defId) : null;
  const out: string[] = [];

  out.push(resolveLogoForTheme(id));
  pushKeyVariants(out, key);
  out.push(local);

  if (id !== defId) {
    out.push(resolveLogoForTheme(defId));
    pushKeyVariants(out, defKey);
    out.push(localFb);
  }

  return uniqueStrings([
    ...out,
    ...(svgPath ? [svgPath] : []),
    ...(svgFb ? [svgFb] : []),
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
 */
export function getHeaderBrandLogoLoadChain(themeId?: string | null, preferredMode?: HeaderLogoMode): string[] {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const mode = preferredMode ?? headerLogoModeForTheme(id);
  const themeRasterChain = getThemeLogoLoadChain(id);
  const themeSvg = getThemeLogoSvgPathForThemeId(id);
  if (mode === "light-header") {
    return uniqueStrings([themeSvg, ...themeRasterChain, PRIMARY_LOGO_URL, PRIMARY_LOGO_CDN_URL]);
  }
  return uniqueStrings([...themeRasterChain, themeSvg, PRIMARY_LOGO_URL, PRIMARY_LOGO_CDN_URL]);
}

