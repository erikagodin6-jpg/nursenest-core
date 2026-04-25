/**
 * Auto-generated marketing assets — hardened for production rendering.
 */

export const MARKETING_CDN_BASE =
  "https://nursenest-images.tor1.cdn.digitaloceanspaces.com";

/* =========================
   TYPES
   ========================= */

export type MarketingScreenshotBundle = {
  srcSet: string;
  thumbSrcSet: string;
  fallback: string;
  thumbFallback: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

/* =========================
   SAFETY HELPERS
   ========================= */

function assertValidUrl(url: string, label: string): string {
  if (!url || !url.startsWith("http")) {
    throw new Error(`[marketing-assets] invalid URL for ${label}`);
  }
  return url;
}

function sanitizeBundle(
  key: string,
  bundle: MarketingScreenshotBundle,
): MarketingScreenshotBundle {
  return {
    ...bundle,
    fallback: assertValidUrl(bundle.fallback, `${key}.fallback`),
    thumbFallback: assertValidUrl(bundle.thumbFallback, `${key}.thumbFallback`),
    sizes:
      bundle.sizes ??
      "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
  };
}

/* =========================
   HERO
   ========================= */

const HERO_DASHBOARD_CANONICAL =
  `${MARKETING_CDN_BASE}/screenshot1.png`;

export const HERO_DASHBOARD_SCREENSHOT = HERO_DASHBOARD_CANONICAL;
export const HERO_DASHBOARD_SCREENSHOT_SRCSET = `${HERO_DASHBOARD_CANONICAL} 1200w`;

/* =========================
   SCREENSHOTS
   ========================= */

const RAW_SCREENSHOTS: Record<string, MarketingScreenshotBundle> = {
  screenshot2: {
    srcSet:
      `${MARKETING_CDN_BASE}/screenshots/screenshot2_1773379293573-480w.webp 480w, ` +
      `${MARKETING_CDN_BASE}/screenshots/screenshot2_1773379293573-768w.webp 768w, ` +
      `${MARKETING_CDN_BASE}/screenshots/screenshot2_1773379293573-1200w.webp 1200w`,
    thumbSrcSet:
      `${MARKETING_CDN_BASE}/screenshots/screenshot2_1773379293573-thumb-160w.webp 160w, ` +
      `${MARKETING_CDN_BASE}/screenshots/screenshot2_1773379293573-thumb-240w.webp 240w`,
    fallback: `${MARKETING_CDN_BASE}/screenshots/screenshot2_1773379293573-1200w.webp`,
    thumbFallback: `${MARKETING_CDN_BASE}/screenshots/screenshot2_1773379293573-thumb-160w.webp`,
    width: 2730,
    height: 1588,
    priority: true,
  },

  screenshot9: {
    srcSet:
      `${MARKETING_CDN_BASE}/screenshots/screenshot9_1773379293573-480w.webp 480w, ` +
      `${MARKETING_CDN_BASE}/screenshots/screenshot9_1773379293573-768w.webp 768w, ` +
      `${MARKETING_CDN_BASE}/screenshots/screenshot9_1773379293573-1200w.webp 1200w`,
    thumbSrcSet:
      `${MARKETING_CDN_BASE}/screenshots/screenshot9_1773379293573-thumb-160w.webp 160w, ` +
      `${MARKETING_CDN_BASE}/screenshots/screenshot9_1773379293573-thumb-240w.webp 240w`,
    fallback: `${MARKETING_CDN_BASE}/screenshots/screenshot9_1773379293573-1200w.webp`,
    thumbFallback: `${MARKETING_CDN_BASE}/screenshots/screenshot9_1773379293573-thumb-160w.webp`,
    width: 2282,
    height: 1186,
  },
};

/* =========================
   SANITIZED EXPORT
   ========================= */

export const MARKETING_SCREENSHOT_SOURCES: Record<
  string,
  MarketingScreenshotBundle
> = Object.fromEntries(
  Object.entries(RAW_SCREENSHOTS).map(([key, bundle]) => [
    key,
    sanitizeBundle(key, bundle),
  ]),
);

/* =========================
   OPTIONAL META
   ========================= */

export const MARKETING_ASSETS_TODOS: readonly string[] = [
  "Ensure all homepage hero images use priority=true",
  "Add sizes attribute to all <img> or next/image usage",
] as const;

export const MARKETING_ASSETS_UNMATCHED_KEYS: readonly string[] = [];