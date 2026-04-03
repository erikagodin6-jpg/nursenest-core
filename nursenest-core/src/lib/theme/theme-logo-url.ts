/**
 * Theme → logo URL resolution (server- and client-safe; no React hooks).
 *
 * **Precedence for raster wordmarks (`getThemeLogoLoadChain`):**
 * 1. Same-origin committed PNG: `/branding/theme-logos/{themeId}brandlogo_transparent.png`
 * 2. Public CDN URL for that Spaces object key (`getThemeLogoUrl` / `THEME_BRAND_LOGO_SPACE_KEYS`)
 * 3. Optional same-origin proxy path when `marketingImageUsesProxy` / `marketingProxyFallbackEnabled` apply
 * 4. Repeat 1–3 for the **default theme** (lavender) so a broken single-theme file still falls back to the canonical brand mark
 *
 * **Header pipeline (`getHeaderBrandLogoLoadChain`)** extends the raster chain with:
 * - Legacy remote GIF + local SVG (`LOGO_LEGACY_FALLBACK_URL`, `FALLBACK_LOGO_PATH`)
 * - If the catalog enables **tinted** header marks: `getBlueBrandMarkLoadChain()` (legacy name: mask/stem variants, often primary lavender)
 * - Final raster safety net: `PRIMARY_LOGO_URL` then `PRIMARY_LOGO_CDN_URL` (lavender transparent PNG, not a generic “blue” logo)
 *
 * Re-exports `getThemeLogo` / `getThemeLogoUrl` from `@/lib/branding/theme-brand-logo-cdn`.
 */
import {
  getPrimaryBrandMarkObjectKey,
  getSpacesBlueBrandLogoObjectKey,
  headerUsesThemeTintedBrandMark,
  LOGO_LEGACY_FALLBACK_URL,
  nursenestImagesSpaceObjectUrl,
} from "@/config/marketing-cdn.catalog";
import {
  COMMITTED_THEME_LOGO_PUBLIC_PREFIX,
  FALLBACK_LOGO_PATH,
  PRIMARY_LOGO_CDN_URL,
  PRIMARY_LOGO_URL,
} from "@/lib/branding/logo-config";
import { getThemeLogoObjectKeyFromNormalizedId, getThemeLogoUrl } from "@/lib/branding/theme-brand-logo-cdn";
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
  const key = getThemeLogoObjectKeyFromNormalizedId(id);
  const defKey = getThemeLogoObjectKeyFromNormalizedId(defId);
  const local = `${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${key}`;
  const localFb = `${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${defKey}`;
  const pub = getThemeLogoUrl(id);
  const pubFb = getThemeLogoUrl(defId);
  const proxy = marketingProxyPathForKey(key);
  const proxyFb = marketingProxyPathForKey(defKey);

  // 1–3 for active theme, then same for default (lavender). SVG/legacy/tinted stems are only in
  // `getHeaderBrandLogoLoadChain`.
  return uniqueStrings([local, pub, proxy, localFb, pubFb, proxyFb]);
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
 * typically lavender-aligned transparent rasters from `marketing-cdn.catalog`, not arbitrary theme colors.
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
export function getHeaderBrandLogoLoadChain(themeId?: string | null): string[] {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const themeRasterChain = getThemeLogoLoadChain(id);
  const legacyAndLocal = uniqueStrings([LOGO_LEGACY_FALLBACK_URL, FALLBACK_LOGO_PATH]);
  if (headerUsesThemeTintedBrandMark()) {
    const blue = getBlueBrandMarkLoadChain();
    return uniqueStrings([...themeRasterChain, ...legacyAndLocal, ...blue, PRIMARY_LOGO_URL, PRIMARY_LOGO_CDN_URL]);
  }
  return uniqueStrings([...themeRasterChain, ...legacyAndLocal, PRIMARY_LOGO_URL, PRIMARY_LOGO_CDN_URL]);
}

