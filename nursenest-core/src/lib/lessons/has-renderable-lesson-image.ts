import type { PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";

/** Substrings that indicate authored placeholders or stock placeholder hosts — never render a frame. */
const BLOCKED_URL_SUBSTRINGS = [
  "placeholder",
  "placehold.co",
  "via.placeholder",
  "dummyimage",
  "coming-soon",
  "coming_soon",
  "image-coming",
  "no-image",
  "noimage",
  "picsum.photos",
] as const;

/**
 * Returns true only when the URL is non-empty, non-placeholder, and safe to request over HTTPS
 * (or a same-origin public path under `/` with a normal image extension).
 */
export function hasRenderableLessonImageUrl(raw: string | null | undefined): boolean {
  const u = typeof raw === "string" ? raw.trim() : "";
  if (!u) return false;
  const lower = u.toLowerCase();
  if (lower === "null" || lower === "undefined" || lower === "none" || lower === "n/a" || lower === "#") {
    return false;
  }
  if (lower.startsWith("data:")) return false;

  if (u.startsWith("/")) {
    return /\.(avif|webp|png|jpe?g|gif|svg)(\?|$)/i.test(u);
  }

  if (!/^https:\/\//i.test(u)) return false;

  for (const frag of BLOCKED_URL_SUBSTRINGS) {
    if (lower.includes(frag)) return false;
  }
  return true;
}

/** True when a catalog/DB figure should produce a visible image frame. */
export function hasRenderableLessonFigure(figure: PathwayLessonFigure | null | undefined): boolean {
  if (!figure) return false;
  return hasRenderableLessonImageUrl(figure.url);
}

/**
 * Accepts a raw URL string or a pathway figure. Used by lesson cards and audits.
 * Does not guarantee the remote asset exists — pair with {@link SafeLessonRemoteImage} for runtime hide on error.
 */
export function hasRenderableLessonImage(
  image: PathwayLessonFigure | string | null | undefined,
): boolean {
  if (image == null) return false;
  if (typeof image === "string") return hasRenderableLessonImageUrl(image);
  return hasRenderableLessonFigure(image);
}
