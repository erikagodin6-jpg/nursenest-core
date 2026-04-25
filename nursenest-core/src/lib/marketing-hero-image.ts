import {
  isForbiddenBrowserImageScheme,
  marketingImageUsesProxy,
  marketingProxyFallbackEnabled,
  marketingProxyPathForKey,
} from "@/lib/marketing-resolve-image-url";

export const MARKETING_HERO_LOCAL_FALLBACK = "/marketing/hero-fallback.svg" as const;

export const HOME_HERO_SCREENSHOT_WEBP_WIDTH_SUFFIXES = [
  "-1200w.webp",
  "-768w.webp",
  "-480w.webp",
] as const;

function uniqueStrings(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of urls) {
    const value = raw.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }

  return out;
}

function isHttpImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function objectKeyFromPublicCdnUrl(cdnUrl: string): string {
  if (!isHttpImageUrl(cdnUrl)) return "";

  try {
    const u = new URL(cdnUrl);
    return decodeURIComponent(u.pathname.replace(/^\/+/, ""));
  } catch {
    return "";
  }
}

export function homeHeroScreenshotOptimizedVariants(
  publicPngUrl: string,
): Array<{ key: string; url: string }> {
  if (!isHttpImageUrl(publicPngUrl)) return [];

  try {
    const u = new URL(publicPngUrl);
    const path = decodeURIComponent(u.pathname.replace(/^\/+/, ""));

    if (!/^screenshot\d+\.png$/i.test(path)) {
      return [];
    }

    return HOME_HERO_SCREENSHOT_WEBP_WIDTH_SUFFIXES.map((suffix) => {
      const key = path.replace(/\.png$/i, suffix);
      return {
        key,
        url: `${u.origin}/${encodeURI(key)}`,
      };
    });
  } catch {
    return [];
  }
}

function pushOptimizedTiers(
  out: string[],
  variants: Array<{ key: string; url: string }>,
  proxyFirst: boolean,
): void {
  for (const { key, url } of variants) {
    const proxyPath = marketingProxyPathForKey(key);

    if (proxyFirst) {
      out.push(proxyPath);
      out.push(url);
    } else {
      out.push(url);
      out.push(proxyPath);
    }
  }
}

export function getMarketingHeroImageUrlChain(params: {
  objectKey: string;
  publicCdnUrl: string;
}): string[] {
  const objectKey = params.objectKey.trim();
  const publicCdnUrl = params.publicCdnUrl.trim();

  if (!objectKey || !publicCdnUrl || isForbiddenBrowserImageScheme(publicCdnUrl)) {
    return [MARKETING_HERO_LOCAL_FALLBACK];
  }

  const optimized = homeHeroScreenshotOptimizedVariants(publicCdnUrl);
  const proxyPng = marketingProxyPathForKey(objectKey);

  const out: string[] = [];

  if (marketingImageUsesProxy()) {
    out.push(proxyPng);
    out.push(publicCdnUrl);
    pushOptimizedTiers(out, optimized, true);
    out.push(MARKETING_HERO_LOCAL_FALLBACK);
    return uniqueStrings(out);
  }

  if (marketingProxyFallbackEnabled()) {
    out.push(publicCdnUrl);
    out.push(proxyPng);
    pushOptimizedTiers(out, optimized, false);
    out.push(MARKETING_HERO_LOCAL_FALLBACK);
    return uniqueStrings(out);
  }

  out.push(publicCdnUrl);
  pushOptimizedTiers(out, optimized, false);
  out.push(MARKETING_HERO_LOCAL_FALLBACK);

  return uniqueStrings(out);
}