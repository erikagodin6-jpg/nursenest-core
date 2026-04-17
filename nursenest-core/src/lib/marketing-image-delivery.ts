/**
 * Shared `sizes`, quality, and CDN bundle URL selection for marketing hero / screenshot imagery.
 * Keeps display width ≤ 1200px and pairs with `next/image` so the optimizer serves WebP/AVIF.
 */

/** Max logical width for marketing hero & carousel sources (matches CDN `-1200w` variants). */
export const MARKETING_HERO_MAX_DISPLAY_WIDTH = 1200;

/** JPEG/WebP quality passed to `next/image` — balances ~150KB-class payloads at 1200w for UI screenshots (LCP / above-fold). */
export const MARKETING_PHOTO_QUALITY = 72;

/** Slightly higher quality for the homepage hero product panel — crisper UI text on retina displays. */
export const MARKETING_PHOTO_QUALITY_HERO = 78;

/** Homepage screenshot strip below the hero — sharp UI text; section is below the fold so transfer cost is acceptable. */
export const MARKETING_PHOTO_QUALITY_HOME_SCREENSHOT_SECTION = 86;

/** Slightly lower quality for below-fold marketing stills; keeps layout identical, trims transfer on `/_next/image`. */
export const MARKETING_PHOTO_QUALITY_BELOW_FOLD = 68;

/** Homepage hero column (primary product still). Mobile: full-bleed column (`100vw`); md+: half of the marketing grid. */
export const MARKETING_HERO_LCP_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, min(720px, 50vw)";

/** Screenshot section under homepage hero — container is `max-w-2xl` / 42rem (672px). */
export const MARKETING_HOME_SCREENSHOT_SECTION_SIZES =
  "(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) min(672px, 100vw - 3rem), 672px";

/** Intrinsic 16:10 dimensions at max marketing width — pairs with `next/image` `fill` for aspect-ratio hints. */
export const MARKETING_HERO_INTRINSIC_WIDTH = 1200;
export const MARKETING_HERO_INTRINSIC_HEIGHT = 750;

/** Autoplay / compact carousel frame (“Platform in Action” style). */
export const MARKETING_CAROUSEL_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 90vw, min(520px, 45vw)";

/** Stacked screenshot column (full width of content well). */
export const MARKETING_STACK_SHOT_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 92vw, min(720px, 90vw)";

/** Two-up grid in conversion blocks (~half row each). */
export const MARKETING_SCREENSHOT_PAIR_SIZES =
  "(max-width: 1024px) 100vw, min(600px, 50vw)";

/** Three-up “inside the product” grid. */
export const MARKETING_SCREENSHOT_TRIPLE_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, min(400px, 33vw)";

/** Hero media panel secondary tiles (half-row on sm+). */
export const MARKETING_HERO_SECONDARY_SIZES = "(max-width: 640px) 100vw, min(520px, 50vw)";

/** Prefer the largest CDN variant up to `MARKETING_HERO_MAX_DISPLAY_WIDTH` (usually `-1200w.webp`). */
export function marketingScreenshotBundleDisplaySrc(bundle: {
  srcSet: string;
  fallback: string;
}): string {
  const candidates: { url: string; w: number }[] = [];
  for (const part of bundle.srcSet.split(",")) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length < 2) continue;
    const url = tokens[0];
    const desc = tokens[tokens.length - 1];
    const m = /^(\d+)w$/.exec(desc ?? "");
    if (!url || !m) continue;
    const w = Number(m[1]);
    if (w <= MARKETING_HERO_MAX_DISPLAY_WIDTH) candidates.push({ url, w });
  }
  if (candidates.length === 0) return bundle.fallback;
  candidates.sort((a, b) => b.w - a.w);
  return candidates[0].url;
}

export function marketingImageShouldUnoptimize(src: string): boolean {
  try {
    const path = src.startsWith("http") ? new URL(src).pathname : src;
    return path.toLowerCase().endsWith(".svg");
  } catch {
    return src.toLowerCase().endsWith(".svg");
  }
}
