/**
 * Theme → logo URL resolution: `@/lib/branding/theme-logo-map` + `theme-brand-logo-cdn.ts`, or (when catalog
 * enables tinting) a single blue-brand stem for mask + `var(--theme-primary)`.
 * Optional proxy order: `marketing-resolve-image-url.ts`. Server-safe (no React hooks).
 */
import {
  getPrimaryBrandMarkObjectKey,
  getSpacesBlueBrandLogoObjectKey,
  headerUsesThemeTintedBrandMark,
  LOGO_LEGACY_FALLBACK_URL,
  nursenestImagesSpaceObjectUrl,
} from "@/config/marketing-cdn.catalog";
import { FALLBACK_LOGO_PATH, PRIMARY_LOGO_URL } from "@/lib/branding/logo-config";
import {
  getThemeLogoObjectKeyFromNormalizedId,
  getThemeLogoPublicPath,
  getThemeLogoUrl,
} from "@/lib/branding/theme-brand-logo-cdn";
import {
  marketingImageUsesProxy,
  marketingProxyFallbackEnabled,
  marketingProxyPathForKey,
} from "@/lib/marketing-resolve-image-url";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";
import { normalizeThemeIdForLogo } from "@/lib/theme/theme-logo-resolve";

/** @deprecated Use `FALLBACK_LOGO_PATH` from `@/lib/branding/logo-config`. */
export const CANONICAL_BRAND_LOGO_LOCAL_PATH = FALLBACK_LOGO_PATH;

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
  const id = normalizeThemeIdForLogo(themeId);
  return getThemeLogoObjectKeyFromNormalizedId(id);
}

/** Public CDN URL for the active theme’s pre-colored logo raster (alias of {@link getThemeLogoUrl}). */
export function getThemeLogoPublicUrl(themeId: string): string {
  return getThemeLogoUrl(themeId);
}

export { getThemeLogo, getThemeLogoUrl } from "@/lib/branding/theme-brand-logo-cdn";

/**
 * Ordered URLs for `<img src>`: theme-specific asset, then lavender fallback, with optional proxy variants.
 */
export function getThemeLogoLoadChain(themeId?: string | null): string[] {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const defId = NURSENEST_DEFAULT_THEME;
  const pub = getThemeLogoUrl(id);
  const pubFb = getThemeLogoUrl(defId);
  const proxy = marketingProxyPathForKey(getThemeLogoObjectKeyFromNormalizedId(id));
  const proxyFb = marketingProxyPathForKey(getThemeLogoObjectKeyFromNormalizedId(defId));
  const sameOrigin = getThemeLogoPublicPath(id);
  const sameOriginFb = getThemeLogoPublicPath(defId);

  // Proxy first when bucket is private; then CDN; then same-origin `/public/branding/themes/...`.
  return uniqueStrings([proxy, pub, sameOrigin, proxyFb, pubFb, sameOriginFb]);
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
 * Mask-tinted mark: canonical `spacesBlueBrandLogoObjectKey` first, then stem from
 * `primaryBrandMarkObjectKey` with extension probing (.svg … .jpg).
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
 * Header mark load order: per-theme assets first (proxy → CDN → default theme), then legacy GIF/SVG,
 * then optional mask-tinted blue stems if enabled, then `PRIMARY_LOGO_URL` (generic blue) last only if needed.
 */
export function getHeaderBrandLogoLoadChain(themeId?: string | null): string[] {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const themeRasterChain = getThemeLogoLoadChain(id);
  const legacyAndLocal = uniqueStrings([LOGO_LEGACY_FALLBACK_URL, FALLBACK_LOGO_PATH]);
  if (headerUsesThemeTintedBrandMark()) {
    const blue = getBlueBrandMarkLoadChain();
    return uniqueStrings([...themeRasterChain, ...legacyAndLocal, ...blue, PRIMARY_LOGO_URL]);
  }
  return uniqueStrings([...themeRasterChain, ...legacyAndLocal, PRIMARY_LOGO_URL]);
}

