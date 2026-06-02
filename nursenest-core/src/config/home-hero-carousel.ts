/**
 * Homepage hero carousel — direct DigitalOcean Spaces CDN (no app proxy).
 *
 * Legacy PNG (required for OG + fallback): `…/screenshot{N}.png` for N = 1 … 15.
 *
 * Optimized sources (optional; preferred by `getMarketingHeroImageUrlChain` in order):
 *   `…/screenshot{N}-1200w.webp`, `…/screenshot{N}-768w.webp`, `…/screenshot{N}-480w.webp`
 * Same bucket path prefix as PNG (typically CDN root). If WebP objects are missing, the UI falls back to PNG.
 *
 * Slide copy (label, title, caption, alt) is loaded via `buildHomepageHeroSlides(t)` and marketing i18n keys.
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
  /** Small context line above the headline (e.g. “From the Question Bank”). */
  label: string;
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
    3: "prioritization_delegation",
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

/**
 * 0-based indices into {@link HOMEPAGE_HERO_SLIDE_METADATA} for the homepage product screenshot carousel
 * (same set previously shown beside the hero headline).
 */
/** Showcase module variety: rationale, flashcards, CAT session, CAT results, ECG workstation. */
export const HOME_HERO_PRIMARY_CAROUSEL_INDICES = [0, 1, 5, 6, 14] as const;

const HOME_HERO_SLIDE_KEY_PREFIX = "components.homeHeroCarousel";

const HOME_HERO_SLIDE_COPY_FALLBACKS: Record<number, { label: string; title: string; caption: string }> = {
  1: { label: "Question Bank", title: "Practice with exam-style questions", caption: "Build confidence with rationales and focused review." },
  2: { label: "RN Prep", title: "Study by pathway and topic", caption: "Keep NCLEX-RN practice tied to the skills you are reviewing." },
  3: { label: "Prioritization & Delegation", title: "Practice bedside decisions", caption: "Work through who to see first, what to escalate, and which tasks are safe to delegate." },
  4: { label: "Lessons", title: "Review the concept before you test", caption: "Use concise lessons to close gaps before another question set." },
  5: { label: "Progress", title: "Track what needs attention", caption: "Follow your study activity across questions, lessons, and review." },
  6: { label: "Flashcards", title: "Reinforce high-yield facts", caption: "Turn weak points into short review sessions." },
  7: { label: "NP Prep", title: "Keep advanced practice review organized", caption: "Move between study modes without losing your pathway context." },
  8: { label: "Rationales", title: "Learn why each answer works", caption: "Review explanations that connect safety, priority, and scope." },
  9: { label: "Study Modes", title: "Choose the right practice mode", caption: "Mix quick sessions, focused review, and longer exam-style work." },
  10: { label: "Dashboard", title: "Return to what matters next", caption: "Pick up with the lessons and practice areas still needing work." },
  11: { label: "Readiness", title: "Keep your prep moving", caption: "Use visible progress signals to plan the next study session." },
  12: { label: "Review", title: "Strengthen weaker topics", caption: "Use focused practice to revisit concepts before test day." },
  13: { label: "Mobile Study", title: "Study from any device", caption: "Open quick practice and review whenever you have a few minutes." },
  14: { label: "Exam Prep", title: "Stay inside your exam lane", caption: "Keep RN, PN, NP, and allied prep surfaces clearly scoped." },
  15: { label: "NurseNest", title: "Practice, review, and keep going", caption: "A lightweight preview of the study tools available inside." },
};

function looksLikeUnsafeSlideCopy(value: string, key: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed === key) return true;
  if (/^(KICKER|LEAD|TITLE|BODY|LINK|LABEL|HEADING|CTA|BUTTON)$/u.test(trimmed)) return true;
  if (/^(kicker|lead|title|body|link|label|heading|cta|button)$/iu.test(trimmed)) return true;
  if (/^(pages|components|home|nav|footer)\.[a-z0-9_.-]+$/iu.test(trimmed)) return true;
  return false;
}

function safeSlideCopy(
  t: (key: string) => string,
  key: string,
  fallback: string,
): string {
  let raw = "";
  try {
    raw = t(key);
  } catch {
    raw = "";
  }
  if (!looksLikeUnsafeSlideCopy(raw, key)) return raw.trim();
  if (process.env.NODE_ENV === "development") {
    console.error("[home-hero-carousel] missing or placeholder slide copy", {
      key,
      resolved: raw.slice(0, 120),
    });
  }
  return fallback;
}

export function homeHeroSlideTitleKey(index1To15: number): string {
  return `${HOME_HERO_SLIDE_KEY_PREFIX}.slide${String(index1To15).padStart(2, "0")}.title`;
}

export function homeHeroSlideCaptionKey(index1To15: number): string {
  return `${HOME_HERO_SLIDE_KEY_PREFIX}.slide${String(index1To15).padStart(2, "0")}.caption`;
}

export function homeHeroSlideLabelKey(index1To15: number): string {
  return `${HOME_HERO_SLIDE_KEY_PREFIX}.slide${String(index1To15).padStart(2, "0")}.label`;
}

function buildAlt(label: string, title: string, caption: string): string {
  const l = label.trim();
  const t = title.trim();
  const c = caption.trim();
  const head = l ? `${l}. ${t}` : t;
  return `${head}. ${c}`.slice(0, 220);
}

function slideFromMeta(t: (key: string) => string, meta: HomeHeroSlideMetadata): HomeHeroSlide {
  const labelKey = homeHeroSlideLabelKey(meta.index);
  const fallback = HOME_HERO_SLIDE_COPY_FALLBACKS[meta.index] ?? HOME_HERO_SLIDE_COPY_FALLBACKS[15]!;
  const label = safeSlideCopy(t, labelKey, fallback.label);
  const title = safeSlideCopy(t, homeHeroSlideTitleKey(meta.index), fallback.title);
  const caption = safeSlideCopy(t, homeHeroSlideCaptionKey(meta.index), fallback.caption);
  return {
    index: meta.index,
    objectKey: meta.objectKey,
    publicUrl: meta.publicUrl,
    label,
    title,
    caption,
    alt: buildAlt(label, title, caption),
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

/** Same validation as `buildSafeMarketingHeroSlides` in the client carousel (kept pure for server preload). */
export function filterRenderableHomeHeroSlides(
  slides: readonly HomeHeroSlide[] | null | undefined,
): HomeHeroSlide[] {
  if (!Array.isArray(slides)) return [];
  return slides.filter(
    (s) =>
      Boolean(s) &&
      typeof s.publicUrl === "string" &&
      s.publicUrl.trim().length > 0 &&
      typeof s.objectKey === "string" &&
      s.objectKey.trim().length > 0,
  );
}

/**
 * Build the primary homepage screenshot carousel slides from a message map (e.g. layout overlay shards).
 * Avoids rebuilding slide strings on the client during initial hydration.
 */
export function buildHomeHeroPrimarySlidesFromMessages(messages: Record<string, string>): HomeHeroSlide[] {
  const t = (key: string) => (typeof messages[key] === "string" ? messages[key]! : "");
  const built = buildHomepageHeroSlidesAtIndices(t, HOME_HERO_PRIMARY_CAROUSEL_INDICES);
  return filterRenderableHomeHeroSlides(built);
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
