/**
 * Theme → logo URL resolution (server- and client-safe; no React hooks).
 *
 * **Variants:**
 *   "full" (default) — leaf + "NurseNest" wordmark  → header / footer / auth
 *   "leaf"           — leaf icon only, tight-cropped → 404 / error / compact UI
 *
 * **Canonical load order (per variant):**
 *   1. CDN Spaces `Logos/…-transparent.png`         — uploaded canonical asset (primary)
 *   2. `/logos/{themeId}-brandlogo.png`              — same-origin pre-generated PNG (safety net)
 *   3. `/branding/theme-logos/…brandlogo_transparent.png` — older committed PNG (secondary net)
 *   4. `/logos/{themeId}-brandlogo.svg`              — SVG wordmark fallback (full only)
 *   5. `/logos/themes/nursenest-logo-{themeId}.svg`  — universal SVG safety net
 *
 * `theme-logo-map.ts` is the ONLY source of truth for theme → Spaces object key mapping.
 * This file builds ordered chains; `use-theme-logo.ts` wraps them as a React hook.
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
  type ThemeLogoVariant,
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

export type { ThemeLogoVariant };

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
export function getThemeLogoObjectKey(themeId: string, variant: ThemeLogoVariant = "full"): string {
  return themeLogoObjectKeyForTheme(themeId, variant);
}

/** Public CDN URL for the active theme's pre-colored logo raster (alias of {@link getThemeLogoUrl}). */
export function getThemeLogoPublicUrl(themeId: string): string {
  return getThemeLogoUrl(themeId);
}

export { getThemeLogo, getThemeLogoUrl } from "@/lib/branding/theme-brand-logo-cdn";

/**
 * Ordered `<img src>` try-chain for a theme logo.
 *
 * variant="full" (default):
 *   same-origin SVG → universal SVG → CDN full logo → legacy PNG fallbacks
 *
 * variant="leaf":
 *   CDN leaf logo → CDN full logo (fallback) → same-origin PNG → SVGs
 *   (no committed branding PNGs — those only exist for the full wordmark)
 */
export function getThemeLogoLoadChain(
  themeId?: string | null,
  logoVariant: ThemeLogoVariant = "full",
): string[] {
  const id    = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const defId = NURSENEST_DEFAULT_THEME;

  const key    = themeLogoObjectKeyForTheme(id, logoVariant);
  const defKey = themeLogoObjectKeyForTheme(defId, logoVariant);

  const out: string[] = [];

  if (logoVariant === "leaf") {
    // Leaf: CDN leaf first → CDN full fallback → local PNG.
    pushKeyVariants(out, key);
    const fullKey = themeLogoObjectKeyForTheme(id, "full");
    pushKeyVariants(out, fullKey);
    out.push(getThemeLogoPngPathForThemeId(id));
  } else {
    // Full: existing same-origin SVGs are the fastest reliable local source for the marketing header.
    // Keep CDN + legacy PNG paths behind them as safety nets for other surfaces.
    out.push(getThemeLogoPngPathForThemeId(id));
    out.push(`${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${id}brandlogo_transparent.png`);
    pushKeyVariants(out, key);
  }

  // 2. Default-theme equivalents as belt-and-suspenders (non-default themes only).
  if (id !== defId) {
    pushKeyVariants(out, defKey);
    if (logoVariant === "full") {
      out.push(getThemeLogoPngPathForThemeId(defId));
      out.push(`${COMMITTED_THEME_LOGO_PUBLIC_PREFIX}${defId}brandlogo_transparent.png`);
    }
  }

  // 3. SVG fallbacks — all themes have these files (full wordmark SVG is the safest final net).
  const svgPath = getThemeLogoPathForThemeId(id);
  const svgFb   = id !== defId ? getThemeLogoPathForThemeId(defId) : null;

  return uniqueStrings([
    ...(logoVariant === "full" ? [getThemeLogoSvgPathForThemeId(id)] : []),
    ...(svgPath ? [svgPath] : []),
    ...out,
    ...(svgFb   ? [svgFb]  : []),
  ]);
}

const PRIMARY_BRAND_MARK_EXTENSIONS = [".svg", ".png", ".webp", ".jpg"] as const;

function stemFromObjectKey(objectKey: string): string {
  return objectKey.replace(/\.[^/.]+$/, "");
}

function pushKeyVariants(out: string[], objectKey: string) {
  const pub   = nursenestImagesSpaceObjectUrl(objectKey);
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
 * Tinted / mask-style header mark (catalog "primary" stem). Name retains "Blue" for history; assets are
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
 * variant="full" (default) → header / footer / auth: full leaf + wordmark.
 * variant="leaf"           → 404 / error / compact: leaf icon only.
 *
 * The `preferredMode` parameter is kept for API compatibility only; the uploaded
 * Logos/ assets are already the correct version for each theme regardless of surface.
 */
export function getHeaderBrandLogoLoadChain(
  themeId?: string | null,
  preferredMode?: HeaderLogoMode,
  logoVariant: ThemeLogoVariant = "full",
): string[] {
  void preferredMode;
  const id               = normalizeThemeIdForLogo(themeId ?? NURSENEST_DEFAULT_THEME);
  const themeRasterChain = getThemeLogoLoadChain(id, logoVariant);
  const themeSvg         = getThemeLogoSvgPathForThemeId(id);
  const universalSvg     = getThemeLogoPathForThemeId(id);
  // SVG fallbacks trail the raster chain; PRIMARY_LOGO_* are absolute last resort.
  return uniqueStrings([...themeRasterChain, themeSvg, universalSvg, PRIMARY_LOGO_URL, PRIMARY_LOGO_CDN_URL]);
}
