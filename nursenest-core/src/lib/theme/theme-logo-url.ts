/**
 * Theme → logo URL resolution (server- and client-safe; no React hooks).
 *
 * **Canonical load order (`getThemeLogoLoadChain` → `getHeaderBrandLogoLoadChain`):**
 * 1. CDN Spaces `Logos/{themeId-nohyphens}-transparent.png` — final uploaded transparent asset (primary)
 * 2. `/logos/{themeId}-brandlogo.png`                       — same-origin pre-generated PNG (safety net)
 * 3. `/branding/theme-logos/{themeId}brandlogo_transparent.png` — older committed PNGs (secondary net)
 * 4. `/logos/{themeId}-brandlogo.svg`                        — wordmark SVG fallback
 * 5. `/logos/themes/nursenest-logo-{themeId}.svg`            — universal SVG safety net (all themes)
 *
 * `theme-logo-map.ts` is the ONLY source of truth for theme → Spaces object key mapping.
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
  type HeaderLogoMode,
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
 * Ordered URLs for `<img src>`: Spaces CDN Logos/ asset first (canonical uploaded transparent),
 * then same-origin PNGs and SVGs as safety nets.
 *
 * Priority:
 *   1. CDN `Logos/{themeId-nohyphens}-transparent.png` — final uploaded asset (primary source)
 *   2. `/logos/{themeId}-brandlogo.png`                — same-origin pre-generated PNG (CDN fallback)
 *   3. `/branding/theme-logos/{themeId}brandlogo_transparent.png` — older committed PNG (secondary net)
 *   4. `/logos/{themeId}-brandlogo.svg`                — wordmark SVG fallback
 *   5. `/logos/themes/nursenest-logo-{themeId}.svg`    — universal SVG safety net (all themes)
 */
export function getThemeLogoLoadChain(themeId?: string | null): string[] {
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const defId = NURSENEST_DEFAULT_THEME;

  const key    = themeLogoObjectKeyForTheme(id);
  const defKey = themeLogoObjectKeyForTheme(defId);

  const out: string[] = [];

  // 1. Spaces CDN Logos/ — canonical uploaded transparent asset, highest priority.
  pushKeyVariants(out, key);

  // 2. Same-origin pre-generated PNG — safety net when CDN is unavailable.
  out.push(getThemeLogoPngPathForThemeId(id));

  // 3. Older committed branding PNG — secondary same-origin safety net.
  out.push(`${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${id}brandlogo_transparent.png`);

  // 4. Default-theme CDN + local equivalents (non-default themes only).
  if (id !== defId) {
    pushKeyVariants(out, defKey);
    out.push(getThemeLogoPngPathForThemeId(defId));
    out.push(`${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${defId}brandlogo_transparent.png`);
  }

  // 5. SVG fallbacks — all themes have these files.
  const svgPath = getThemeLogoPathForThemeId(id);
  const svgFb   = id !== defId ? getThemeLogoPathForThemeId(defId) : null;

  return uniqueStrings([
    ...out,
    ...(svgPath ? [svgPath] : []),
    ...(svgFb   ? [svgFb]  : []),
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
 * The Spaces CDN `Logos/{themeId-nohyphens}-transparent.png` asset is always the primary source —
 * these are the final uploaded transparent logos and are correct for every theme regardless of
 * header surface color.  Same-origin PNGs and SVGs trail as safety nets.
 *
 * The `preferredMode` parameter is accepted for API compatibility but no longer changes
 * the ordering — the uploaded Logos/ assets are already the right version for each theme.
 */
export function getHeaderBrandLogoLoadChain(themeId?: string | null, preferredMode?: HeaderLogoMode): string[] {
  void preferredMode; // retained for API compatibility; Logos/ CDN assets are always correct
  const id = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  // CDN Logos/ is already #1 inside getThemeLogoLoadChain.
  const themeRasterChain = getThemeLogoLoadChain(id);
  // SVG fallbacks: wordmark SVG, then universal themes/ SVG.
  const themeSvg     = getThemeLogoSvgPathForThemeId(id);
  const universalSvg = getThemeLogoPathForThemeId(id);
  return uniqueStrings([...themeRasterChain, themeSvg, universalSvg, PRIMARY_LOGO_URL, PRIMARY_LOGO_CDN_URL]);
}

