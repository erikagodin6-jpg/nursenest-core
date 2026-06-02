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

/** Prefer repo-local WebP when present — avoids stale CDN PNGs between upload cycles. */
const LOCAL_HOME_HERO_SCREENSHOT_IDS = new Set(
  Array.from({ length: 15 }, (_, index) => index + 1),
);

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
  opts?: { widthSuffixOrder?: "largestFirst" | "smallestFirst" },
): Array<{ key: string; url: string }> {
  if (!isHttpImageUrl(publicPngUrl)) return [];

  try {
    const u = new URL(publicPngUrl);
    const path = decodeURIComponent(u.pathname.replace(/^\/+/, ""));

    if (!/^screenshot\d+\.png$/i.test(path)) {
      return [];
    }

    const suffixes =
      opts?.widthSuffixOrder === "smallestFirst"
        ? [...HOME_HERO_SCREENSHOT_WEBP_WIDTH_SUFFIXES].reverse()
        : [...HOME_HERO_SCREENSHOT_WEBP_WIDTH_SUFFIXES];

    return suffixes.map((suffix) => {
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

function localHomeHeroScreenshotOptimizedVariants(
  objectKey: string,
  opts?: { widthSuffixOrder?: "largestFirst" | "smallestFirst" },
): Array<{ key: string; url: string }> {
  const match = /^screenshot(\d+)\.png$/i.exec(objectKey);
  if (!match) return [];
  const id = Number(match[1]);
  if (!LOCAL_HOME_HERO_SCREENSHOT_IDS.has(id)) return [];

  const suffixes =
    opts?.widthSuffixOrder === "smallestFirst"
      ? [...HOME_HERO_SCREENSHOT_WEBP_WIDTH_SUFFIXES].reverse()
      : [...HOME_HERO_SCREENSHOT_WEBP_WIDTH_SUFFIXES];

  return suffixes.map((suffix) => {
    const key = `marketing/homepage-screenshots/screenshot${id}${suffix}`;
    return {
      key,
      url: `/${key}`,
    };
  });
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
  /**
   * Narrow below-the-fold frames (e.g. homepage screenshot strip ~672px): try smaller WebP first
   * so the browser stops at `-480w`/`-768w` when sufficient, reducing transfer vs always probing `-1200w`.
   */
  optimizedWidthOrder?: "largestFirst" | "smallestFirst";
}): string[] {
  const objectKey = params.objectKey.trim();
  const publicCdnUrl = params.publicCdnUrl.trim();

  if (!objectKey || !publicCdnUrl || isForbiddenBrowserImageScheme(publicCdnUrl)) {
    return [MARKETING_HERO_LOCAL_FALLBACK];
  }

  const localVariants = localHomeHeroScreenshotOptimizedVariants(objectKey, {
    widthSuffixOrder: params.optimizedWidthOrder === "smallestFirst" ? "smallestFirst" : "largestFirst",
  });
  const match = /^screenshot(\d+)\.png$/i.exec(objectKey);
  const localBaseWebp =
    match && LOCAL_HOME_HERO_SCREENSHOT_IDS.has(Number(match[1]))
      ? [{ key: `marketing/homepage-screenshots/screenshot${match[1]}.webp`, url: `/marketing/homepage-screenshots/screenshot${match[1]}.webp` }]
      : [];
  const cdnVariants =
    localVariants.length > 0
      ? []
      : homeHeroScreenshotOptimizedVariants(publicCdnUrl, {
          widthSuffixOrder: params.optimizedWidthOrder === "smallestFirst" ? "smallestFirst" : "largestFirst",
        });
  const optimized = [...localVariants, ...localBaseWebp, ...cdnVariants];
  const hasLocalHomeHero = localVariants.length > 0 || localBaseWebp.length > 0;
  const proxyPng = marketingProxyPathForKey(objectKey);

  const out: string[] = [];

  if (marketingImageUsesProxy()) {
    if (!hasLocalHomeHero) {
      out.push(proxyPng);
      out.push(publicCdnUrl);
    }
    pushOptimizedTiers(out, optimized, true);
    out.push(MARKETING_HERO_LOCAL_FALLBACK);
    return uniqueStrings(out);
  }

  if (marketingProxyFallbackEnabled()) {
    pushOptimizedTiers(out, optimized, false);
    if (!hasLocalHomeHero) {
      out.push(publicCdnUrl);
      out.push(proxyPng);
    }
    out.push(MARKETING_HERO_LOCAL_FALLBACK);
    return uniqueStrings(out);
  }

  pushOptimizedTiers(out, optimized, false);
  if (!hasLocalHomeHero) {
    out.push(publicCdnUrl);
  }
  out.push(MARKETING_HERO_LOCAL_FALLBACK);

  return uniqueStrings(out);
}
