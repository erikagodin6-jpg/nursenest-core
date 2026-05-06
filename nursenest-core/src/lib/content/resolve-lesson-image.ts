/**
 * Production-safe lesson image resolver.
 *
 * MATCHING PRIORITY (strictly in order):
 *   1. Manual override map    (lesson-image-overrides.ts)   → source: "override"
 *   2. Lesson image map slug  (lesson-image-map.ts slugs[]) → source: "map_slug"
 *   3. Inventory exact slug   (inventory basename === lesson.slug) → source: "exact_slug"
 *   4. Inventory topic slug   (inventory basename === lesson.topicSlug) → source: "topic_slug"
 *   5. Lesson image map keyword (topic/topicSlug contains keyword) → source: "map_keyword"
 *   6. Lesson image map body system fallback (unique system match) → source: "map_body_system"
 *   7. null                   (no image shown — safe default)
 *
 * EDITORIAL WORKFLOW:
 *   1. Upload image to DigitalOcean Spaces named after the lesson slug:
 *        e.g. `abdominal-aortic-dissection.png`
 *   2. Run `node scripts/sync-lesson-image-inventory.mjs` to rebuild inventory.
 *   3. The image appears automatically on the matching lesson page.
 *
 * For exceptions where filename ≠ slug, add an entry to lesson-image-overrides.ts.
 * For keyword/topic/body-system mappings, add an entry to lesson-image-map.ts.
 */

import { LESSON_IMAGE_OVERRIDES } from "@/lib/content/lesson-image-overrides";
import { resolveImageFromLessonMap } from "@/lib/lessons/lesson-image-map";
import { getInventoryKeys } from "@/lib/education-images/inventory";
import { publicCdnUrlForObjectKey } from "@/lib/education-images/cdn-url";
import { hasRenderableLessonImageUrl } from "@/lib/lessons/has-renderable-lesson-image";

export type LessonImageSource =
  | "override"          // came from LESSON_IMAGE_OVERRIDES
  | "map_slug"          // exact slug match in lesson-image-map.ts
  | "exact_slug"        // exact inventory basename match on lesson.slug
  | "topic_slug"        // exact inventory basename match on lesson.topicSlug
  | "map_keyword"       // keyword match in lesson-image-map.ts (topic/topicSlug text)
  | "map_body_system"   // body system fallback in lesson-image-map.ts
  | "none";             // no safe match found

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

function guardResolution(
  res: LessonImageResolution,
  altFallback: string,
): LessonImageResolution {
  if (res.url && hasRenderableLessonImageUrl(res.url)) return res;
  const alt = res.alt?.trim() ? res.alt : altFallback;
  return { url: null, objectKey: null, alt, source: "none" };
}

export type LessonImageQuery = {
  /** Canonical lesson slug (URL-safe, hyphenated, lowercase). */
  slug: string;
  /** Used for alt text and keyword matching against lesson-image-map. */
  title?: string | null;
  /**
   * Optional topic slug for secondary fallbacks (inventory lookup + map keyword).
   * Only tried when `slug` yields no match.
   */
  topicSlug?: string | null;
  /**
   * Optional lesson topic label (plain text) for keyword matching in lesson-image-map.
   * Only used for map keyword/body-system steps — never used for inventory lookup.
   */
  topic?: string | null;
  /**
   * Optional body system for last-resort fallback via lesson-image-map.
   * Only used when no slug, inventory, or keyword match is found.
   */
  bodySystem?: string | null;
};

/** Preferred Spaces image prefixes, searched in order. Root prefix ("") catches root-level objects. */
const IMAGE_PREFIXES = ["uploads/images/", "uploads/lesson-images/", ""] as const;

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
 * Resolve a lesson image URL using safe, deterministic matching.
 * Returns `{ url: null, source: "none" }` when no safe match exists.
 */
export function resolveLessonImage(query: LessonImageQuery): LessonImageResolution {
  const slug = normalizeToBasename(query.slug);
  const alt =
    (query.title?.trim() || slug.replace(/-/g, " ")) + " — clinical illustration";

  if (!slug) {
    return guardResolution({ url: null, objectKey: null, alt, source: "none" }, alt);
  }

  // 1. Manual override — always wins.
  const overrideKey = LESSON_IMAGE_OVERRIDES[slug] ?? LESSON_IMAGE_OVERRIDES[query.slug.trim()];
  if (overrideKey) {
    return guardResolution(
      {
        url: publicCdnUrlForObjectKey(overrideKey),
        objectKey: overrideKey,
        alt,
        source: "override",
      },
      alt,
    );
  }

  // 2. Lesson image map — exact slug match.
  const mapSlugMatch = resolveImageFromLessonMap({
    slug,
    topicSlug: query.topicSlug,
    // topic/bodySystem intentionally omitted: only slug match at this step
  });
  if (mapSlugMatch?.source === "map_slug") {
    return guardResolution(
      {
        url: publicCdnUrlForObjectKey(mapSlugMatch.objectKey),
        objectKey: mapSlugMatch.objectKey,
        alt,
        source: "map_slug",
      },
      alt,
    );
  }

  const inventoryKeys = getInventoryKeys();

  // 3. Inventory: exact slug match.
  const slugKey = findKeyForBasename(slug, inventoryKeys);
  if (slugKey) {
    return guardResolution(
      {
        url: publicCdnUrlForObjectKey(slugKey),
        objectKey: slugKey,
        alt,
        source: "exact_slug",
      },
      alt,
    );
  }

  // 4. Inventory: topic-slug fallback.
  if (query.topicSlug) {
    const topicBasename = normalizeToBasename(query.topicSlug);
    if (topicBasename && topicBasename !== slug) {
      const topicKey = findKeyForBasename(topicBasename, inventoryKeys);
      if (topicKey) {
        return guardResolution(
          {
            url: publicCdnUrlForObjectKey(topicKey),
            objectKey: topicKey,
            alt,
            source: "topic_slug",
          },
          alt,
        );
      }
    }
  }

  // 5 & 6. Lesson image map — keyword + body system fallback (fuzzy steps).
  const mapFuzzyMatch = resolveImageFromLessonMap({
    slug,
    topic: query.topic,
    topicSlug: query.topicSlug,
    bodySystem: query.bodySystem,
  });
  if (mapFuzzyMatch && mapFuzzyMatch.source !== "map_slug") {
    return guardResolution(
      {
        url: publicCdnUrlForObjectKey(mapFuzzyMatch.objectKey),
        objectKey: mapFuzzyMatch.objectKey,
        alt,
        source: mapFuzzyMatch.source,
      },
      alt,
    );
  }

  return guardResolution({ url: null, objectKey: null, alt, source: "none" }, alt);
}

/**
 * Resolve and return a diagnostic string for the match result.
 * Useful in audit scripts and development logging.
 */
export function describeLessonImageResolution(result: LessonImageResolution): string {
  if (result.source === "none") return "no image";
  return `${result.source} → ${result.objectKey ?? "?"}`;
}
