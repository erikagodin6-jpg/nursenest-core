/**
 * Theme → logo URL resolution (server- and client-safe; no React hooks).
 *
 * Canonical API: {@link resolveThemeLogo} — same-origin `/logos/{theme}-brandlogo.svg` per registry id.
 * {@link THEME_LOGO_SPACE_KEYS} remains for Spaces-backed marketing proxies.
 */
import { getPrimaryBrandMarkObjectKey, getSpacesBlueBrandLogoObjectKey, nursenestImagesSpaceObjectUrl } from "@/config/marketing-cdn.catalog";
import {
  resolveThemeLogo,
  themeLogoSpaceKeyForRegisteredTheme,
  type ThemeLogoVariant,
} from "@/lib/branding/resolve-theme-logo";
import { getThemeLogoUrl } from "@/lib/branding/theme-brand-logo-cdn";
import {
  marketingImageUsesProxy,
  marketingProxyFallbackEnabled,
  marketingProxyPathForKey,
} from "@/lib/marketing-resolve-image-url";
import { parseRegisteredThemeId } from "@/lib/theme/theme-logo-resolve";
import { NURSENEST_DEFAULT_THEME } from "@/lib/theme/theme-registry";

export type { ThemeLogoVariant };
export { resolveThemeLogo, THEME_LOGO_SPACE_KEYS } from "@/lib/branding/resolve-theme-logo";

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
export function getThemeLogoObjectKey(themeId: string, variant: ThemeLogoVariant = "full"): string | null {
  const id = parseRegisteredThemeId(themeId);
  if (!id) return null;
  return themeLogoSpaceKeyForRegisteredTheme(id, variant);
}

/** Same-origin SVG URL for the active theme wordmark (alias of {@link getThemeLogoUrl}). */
export function getThemeLogoPublicUrl(themeId: string): string | null {
  return getThemeLogoUrl(themeId);
}

export { getThemeLogo, getThemeLogoUrl } from "@/lib/branding/theme-brand-logo-cdn";

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
 * Single resolved theme logo URL for marketing header/footer/auth (one same-origin SVG path).
 * @deprecated Prefer {@link resolveThemeLogo}; kept for rare callers expecting an array of one URL.
 */
export function getHeaderBrandLogoLoadChain(
  themeId?: string | null,
  _preferredMode?: unknown,
  logoVariant: ThemeLogoVariant = "full",
): string[] {
  void _preferredMode;
  const id = parseRegisteredThemeId(themeId ?? NURSENEST_DEFAULT_THEME);
  const u = resolveThemeLogo(id, logoVariant).url;
  return u ? [u] : [];
}
