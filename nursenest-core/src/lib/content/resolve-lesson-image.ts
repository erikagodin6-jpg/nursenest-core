/**
 * Production-safe lesson image resolver.
 *
 * MATCHING PRIORITY (strictly in order, no fuzzy fallback):
 *   1. Manual override map  (lesson-image-overrides.ts)
 *   2. Exact slug match     (inventory key basename === lesson.slug)
 *   3. Exact topicSlug match (optional, for topic-level illustrations)
 *   4. null                 (no image shown — safe default)
 *
 * This resolver deliberately avoids keyword scoring, body-system fallback,
 * or any other heuristic that could attach the wrong image to a lesson.
 * If confidence cannot be established, no image is rendered.
 *
 * EDITORIAL WORKFLOW:
 *   1. Upload image to DigitalOcean Spaces named after the lesson slug:
 *        e.g. `abdominal-aortic-dissection.png`
 *   2. Run `node scripts/sync-lesson-image-inventory.mjs` to rebuild inventory.
 *   3. The image appears automatically on the matching lesson page.
 *
 * For exceptions where filename ≠ slug, add an entry to lesson-image-overrides.ts.
 */

import { LESSON_IMAGE_OVERRIDES } from "@/lib/content/lesson-image-overrides";
import { getInventoryKeys } from "@/lib/education-images/inventory";
import { publicCdnUrlForObjectKey } from "@/lib/education-images/cdn-url";

export type LessonImageSource =
  | "override"     // came from LESSON_IMAGE_OVERRIDES
  | "exact_slug"   // exact basename match on lesson.slug
  | "topic_slug"   // exact basename match on lesson.topicSlug (topic-level illustration)
  | "none";        // no safe match found

export type LessonImageResolution = {
  /** Public CDN URL, or null when no safe match exists. */
  url: string | null;
  /** Spaces object key, or null. */
  objectKey: string | null;
  /** Human-readable alt text derived from lesson title or slug. */
  alt: string;
  /** How the image was resolved — useful for audit logging and UI labeling. */
  source: LessonImageSource;
};

export type LessonImageQuery = {
  /** Canonical lesson slug (URL-safe, hyphenated, lowercase). */
  slug: string;
  /** Used only to derive alt text. Never used for image matching. */
  title?: string | null;
  /**
   * Optional topic slug for a secondary topic-level illustration fallback.
   * Only tried when `slug` yields no match.
   * When a topic image is used, `source` will be `"topic_slug"` so the UI
   * can label it accordingly (e.g. "Topic illustration" vs "Lesson illustration").
   */
  topicSlug?: string | null;
};

/** Preferred Spaces image prefixes, searched in order. */
const IMAGE_PREFIXES = ["uploads/images/", "uploads/lesson-images/"] as const;

/** Extensions tried in preference order (webp first for smallest file size). */
const PREFERRED_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"] as const;

/**
 * Locate the best object key for a given lowercase basename.
 * Returns null if no matching key exists in the inventory.
 */
function findKeyForBasename(
  basename: string,
  inventoryKeys: readonly string[],
): string | null {
  for (const prefix of IMAGE_PREFIXES) {
    for (const ext of PREFERRED_EXTENSIONS) {
      const candidate = `${prefix}${basename}${ext}`;
      if (inventoryKeys.includes(candidate)) return candidate;
    }
  }
  return null;
}

/**
 * Normalize a slug to a safe lowercase hyphenated basename for inventory lookup.
 * Mirrors the editorial convention: slugs are already lowercase and hyphenated.
 */
function normalizeToBasename(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Resolve a lesson image URL using safe, deterministic matching only.
 * Returns `{ url: null, source: "none" }` when no safe match exists.
 */
export function resolveLessonImage(query: LessonImageQuery): LessonImageResolution {
  const slug = normalizeToBasename(query.slug);
  const alt =
    (query.title?.trim() || slug.replace(/-/g, " ")) + " — clinical illustration";

  if (!slug) {
    return { url: null, objectKey: null, alt, source: "none" };
  }

  // 1. Manual override — always wins.
  const overrideKey = LESSON_IMAGE_OVERRIDES[slug] ?? LESSON_IMAGE_OVERRIDES[query.slug.trim()];
  if (overrideKey) {
    return {
      url: publicCdnUrlForObjectKey(overrideKey),
      objectKey: overrideKey,
      alt,
      source: "override",
    };
  }

  const inventoryKeys = getInventoryKeys();

  // 2. Exact slug match.
  const slugKey = findKeyForBasename(slug, inventoryKeys);
  if (slugKey) {
    return {
      url: publicCdnUrlForObjectKey(slugKey),
      objectKey: slugKey,
      alt,
      source: "exact_slug",
    };
  }

  // 3. Topic-slug fallback (only when caller supplies it and it differs from slug).
  if (query.topicSlug) {
    const topicBasename = normalizeToBasename(query.topicSlug);
    if (topicBasename && topicBasename !== slug) {
      const topicKey = findKeyForBasename(topicBasename, inventoryKeys);
      if (topicKey) {
        return {
          url: publicCdnUrlForObjectKey(topicKey),
          objectKey: topicKey,
          alt,
          source: "topic_slug",
        };
      }
    }
  }

  return { url: null, objectKey: null, alt, source: "none" };
}

/**
 * Resolve and return a diagnostic string for the match result.
 * Useful in audit scripts and development logging.
 */
export function describeLessonImageResolution(result: LessonImageResolution): string {
  if (result.source === "none") return "no image";
  return `${result.source} → ${result.objectKey ?? "?"}`;
}
