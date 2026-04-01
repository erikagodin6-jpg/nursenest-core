/**
 * Shared homepage / marketing screenshot URL resolution: optimized WebP variants → legacy PNG → proxy → local SVG.
 * Keeps the hero carousel and lower screenshot carousel on the same fallback order.
 */
import {
  isForbiddenBrowserImageScheme,
  marketingImageUsesProxy,
  marketingProxyFallbackEnabled,
  marketingProxyPathForKey,
} from "@/lib/marketing-resolve-image-url";

export const MARKETING_HERO_LOCAL_FALLBACK = "/marketing/hero-fallback.svg" as const;

/** Width suffixes for CDN hero screenshots (bucket root `screenshot{N}.png` → `screenshot{N}-1200w.webp`, etc.). */
export const HOME_HERO_SCREENSHOT_WEBP_WIDTH_SUFFIXES = ["-1200w.webp", "-768w.webp", "-480w.webp"] as const;

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

/** Bucket object key from a public HTTPS CDN URL (e.g. `screenshots/foo.webp`). */
export function objectKeyFromPublicCdnUrl(cdnUrl: string): string {
  try {
    const u = new URL(cdnUrl);
    return u.pathname.replace(/^\//, "");
  } catch {
    return "";
  }
}

/**
 * For homepage hero CDN URLs whose path ends with `screenshot{N}.png`, returns ordered optimized keys + absolute URLs
 * (`…-1200w.webp`, then 768w, 480w). Empty if the path does not match.
 */
export function homeHeroScreenshotOptimizedVariants(publicPngUrl: string): Array<{ key: string; url: string }> {
  try {
    const u = new URL(publicPngUrl);
    if (u.protocol !== "https:" && u.protocol !== "http:") return [];
    const path = u.pathname.replace(/^\//, "");
    if (!/screenshot\d+\.png$/i.test(path)) return [];
    return HOME_HERO_SCREENSHOT_WEBP_WIDTH_SUFFIXES.map((suffix) => {
      const key = path.replace(/\.png$/i, suffix);
      return { key, url: `${u.origin}/${key}` };
    });
  } catch {
    return [];
  }
}

function pushOptimizedTiers(out: string[], variants: Array<{ key: string; url: string }>, proxyFirst: boolean): void {
  for (const { key, url } of variants) {
    const proxyPath = marketingProxyPathForKey(key);
    if (proxyFirst) {
      out.push(proxyPath, url);
    } else {
      out.push(url);
    }
  }
}

/**
 * Ordered candidates for `<img src>`: optimized WebP (CDN root `screenshot{N}-*w.webp`) → legacy PNG → same-origin proxy when configured → local SVG.
 * Never loops: advance index on `onError` until the last entry (always `MARKETING_HERO_LOCAL_FALLBACK` when inputs are valid).
 */
export function getMarketingHeroImageUrlChain(params: {
  objectKey: string;
  publicCdnUrl: string;
}): string[] {
  const { objectKey, publicCdnUrl } = params;
  const local = MARKETING_HERO_LOCAL_FALLBACK;
  if (!objectKey || isForbiddenBrowserImageScheme(publicCdnUrl)) {
    return [local];
  }
  const optimized = homeHeroScreenshotOptimizedVariants(publicCdnUrl);
  const proxyPng = marketingProxyPathForKey(objectKey);

  if (marketingImageUsesProxy()) {
    const out: string[] = [];
    pushOptimizedTiers(out, optimized, true);
    out.push(proxyPng, publicCdnUrl, local);
    return uniqueStrings(out);
  }
  if (marketingProxyFallbackEnabled()) {
    const out: string[] = [];
    pushOptimizedTiers(out, optimized, false);
    out.push(publicCdnUrl, proxyPng, local);
    return uniqueStrings(out);
  }
  const out: string[] = [];
  pushOptimizedTiers(out, optimized, false);
  out.push(publicCdnUrl, local);
  return uniqueStrings(out);
}
