/**
 * Shared homepage / marketing screenshot URL resolution: proxy → CDN → local SVG.
 * Keeps the hero carousel and lower screenshot carousel on the same fallback order.
 */
import {
  isForbiddenBrowserImageScheme,
  marketingImageUsesProxy,
  marketingProxyFallbackEnabled,
  marketingProxyPathForKey,
} from "@/lib/marketing-resolve-image-url";

export const MARKETING_HERO_LOCAL_FALLBACK = "/marketing/hero-fallback.svg" as const;

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
 * Ordered candidates for `<img src>`: same-origin proxy (when enabled), direct CDN, then local SVG.
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
  const proxy = marketingProxyPathForKey(objectKey);
  if (marketingImageUsesProxy()) {
    return uniqueStrings([proxy, publicCdnUrl, local]);
  }
  if (marketingProxyFallbackEnabled()) {
    return uniqueStrings([publicCdnUrl, proxy, local]);
  }
  return uniqueStrings([publicCdnUrl, local]);
}
