/**
 * Homepage hero carousel — direct DigitalOcean Spaces CDN (no app proxy).
 *
 * Legacy PNG (required for OG + fallback): `…/screenshot{N}.png` for N = 1 … 15.
 *
 * Optimized sources (optional; preferred by `getMarketingHeroImageUrlChain` in order):
 *   `…/screenshot{N}-1200w.webp`, `…/screenshot{N}-768w.webp`, `…/screenshot{N}-480w.webp`
 * Same bucket path prefix as PNG (typically CDN root). If WebP objects are missing, the UI falls back to PNG.
 *
 * Slide copy (title, caption, alt) is loaded via `buildHomepageHeroSlides(t)` and marketing i18n keys.
 * This module keeps only non-localized metadata (URLs, object keys).
 */
export const HOME_HERO_CDN_BASE_URL = "https://nursenest-images.tor1.cdn.digitaloceanspaces.com" as const;

export const HOME_HERO_SCREENSHOT_COUNT = 15 as const;

/** Object key at bucket root: `screenshot1.png` … `screenshot15.png`. */
export function homeHeroScreenshotObjectKey(index1To15: number): string {
  if (!Number.isInteger(index1To15) || index1To15 < 1 || index1To15 > HOME_HERO_SCREENSHOT_COUNT) {
    throw new Error(`homeHeroScreenshotObjectKey: expected 1–${HOME_HERO_SCREENSHOT_COUNT}, got ${index1To15}`);
  }
  return `screenshot${index1To15}.png`;
}

/** Direct CDN URL for `screenshot{N}.png` (always HTTPS; never `/api/marketing-assets`). */
export function homeHeroScreenshotPublicUrl(index1To15: number): string {
  const key = homeHeroScreenshotObjectKey(index1To15);
  return `${HOME_HERO_CDN_BASE_URL.replace(/\/$/, "")}/${key}`;
}

export type HomeHeroSlide = {
  index: number;
  objectKey: string;
  /** Canonical `https://…cdn.digitaloceanspaces.com/screenshot{N}.png` */
  publicUrl: string;
  title: string;
  caption: string;
  alt: string;
};

/**
 * Coarse exam “tier” / track label for hero carousel analytics (screenshot index 1–15).
 * Update when marketing swaps hero screenshots so funnels stay interpretable.
 */
export function getHomeHeroSlideExamTrackKey(screenshotIndex1To15: number): string {
  const m: Partial<Record<number, string>> = {
    1: "pn",
    2: "rn",
    3: "clinical_judgment",
    7: "np",
    9: "study_modes",
    10: "rn",
  };
  return m[screenshotIndex1To15] ?? "platform";
}

/** Non-localized slide metadata only (image chain inputs). One entry per screenshot 1…15. */
export type HomeHeroSlideMetadata = {
  index: number;
  objectKey: string;
  publicUrl: string;
};

export const HOMEPAGE_HERO_SLIDE_METADATA: readonly HomeHeroSlideMetadata[] = Array.from(
  { length: HOME_HERO_SCREENSHOT_COUNT },
  (_, i) => {
    const index = i + 1;
    return {
      index,
      objectKey: homeHeroScreenshotObjectKey(index),
      publicUrl: homeHeroScreenshotPublicUrl(index),
    };
  },
);

const HOME_HERO_SLIDE_KEY_PREFIX = "components.homeHeroCarousel";

export function homeHeroSlideTitleKey(index1To15: number): string {
  return `${HOME_HERO_SLIDE_KEY_PREFIX}.slide${String(index1To15).padStart(2, "0")}.title`;
}

export function homeHeroSlideCaptionKey(index1To15: number): string {
  return `${HOME_HERO_SLIDE_KEY_PREFIX}.slide${String(index1To15).padStart(2, "0")}.caption`;
}

function buildAlt(title: string, caption: string): string {
  const t = title.trim();
  const c = caption.trim();
  return `${t}. ${c}`.slice(0, 220);
}

function slideFromMeta(t: (key: string) => string, meta: HomeHeroSlideMetadata): HomeHeroSlide {
  const title = t(homeHeroSlideTitleKey(meta.index));
  const caption = t(homeHeroSlideCaptionKey(meta.index));
  return {
    index: meta.index,
    objectKey: meta.objectKey,
    publicUrl: meta.publicUrl,
    title,
    caption,
    alt: buildAlt(title, caption),
  };
}

/**
 * Localize only the slides you need (e.g. `[0,1,2]` for the hero media panel) to avoid work and
 * string churn for all 15 screenshots on the critical path.
 */
export function buildHomepageHeroSlidesAtIndices(
  t: (key: string) => string,
  zeroBasedSlideIndices: readonly number[],
): readonly HomeHeroSlide[] {
  return zeroBasedSlideIndices.map((i) => {
    const meta = HOMEPAGE_HERO_SLIDE_METADATA[i];
    if (!meta) {
      throw new Error(
        `buildHomepageHeroSlidesAtIndices: index ${i} out of range (0–${HOMEPAGE_HERO_SLIDE_METADATA.length - 1})`,
      );
    }
    return slideFromMeta(t, meta);
  });
}

/**
 * Builds localized hero slides for `MarketingHeroCarousel`. Call from client components inside
 * `MarketingI18nProvider` and memoize on `t` / locale.
 */
export function buildHomepageHeroSlides(t: (key: string) => string): readonly HomeHeroSlide[] {
  return HOMEPAGE_HERO_SLIDE_METADATA.map((meta) => slideFromMeta(t, meta));
}

if (process.env.NODE_ENV === "development") {
  HOMEPAGE_HERO_SLIDE_METADATA.forEach((slide) => {
    const expected = homeHeroScreenshotObjectKey(slide.index);
    if (slide.objectKey !== expected) {
      throw new Error(
        `[home-hero-carousel] objectKey mismatch for slide ${slide.index}: got "${slide.objectKey}", expected "${expected}"`,
      );
    }
    if (!/^https:\/\//i.test(slide.publicUrl)) {
      throw new Error(`[home-hero-carousel] publicUrl must be HTTPS: ${slide.publicUrl}`);
    }
    if (!slide.publicUrl.startsWith(HOME_HERO_CDN_BASE_URL)) {
      throw new Error(`[home-hero-carousel] publicUrl must use HOME_HERO_CDN_BASE_URL: ${slide.publicUrl}`);
    }
  });
}

/** Open Graph / Twitter default image when no uploaded logo is set. */
export function homeHeroOgImageUrl(): string {
  return HOMEPAGE_HERO_SLIDE_METADATA[0]?.publicUrl ?? "";
}
