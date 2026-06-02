/**
 * Production-safe lesson image resolver.
 *
 * MATCHING PRIORITY (strictly in order):
 *   1. Manual override map    (lesson-image-overrides.ts)   → source: "override"
 *   2. Clinical illustration registry (small public assets) → source: "clinical_illustration"
 *   3. Lesson image map slug  (lesson-image-map.ts slugs[]) → source: "map_slug"
 *   4. Inventory exact slug   (inventory basename === lesson.slug) → source: "exact_slug"
 *   5. Inventory semantic     (title / stripped slug / fuzzy basename) → source: "exact_slug" | "topic_slug"
 *   6. Inventory topic slug   (inventory basename === lesson.topicSlug) → source: "topic_slug"
 *   7. Lesson image map keyword (topic/topicSlug contains keyword) → source: "map_keyword"
 *   8. Lesson image map body system fallback (unique system match) → source: "map_body_system"
 *   9. null                   (no image shown — safe default)
 *
 * EDITORIAL WORKFLOW:
 *   1. Upload image to DigitalOcean Spaces named after the lesson slug:
 *        e.g. `pulmonary-embolism.webp` or `uploads/images/pulmonary-embolism.webp`
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
import { resolveCardiovascularClinicalIllustration } from "@/content/clinical-illustrations/cardiovascular";
import {
  collectLessonImageBasenameCandidates,
  findInventoryObjectKeyForBasename,
  normalizeLessonImageBasename,
  resolveInventoryLessonImageKey,
  stripPathwayLessonSlugPrefix,
} from "@/lib/content/lesson-image-inventory-match";

export type LessonImageSource =
  | "override" // came from LESSON_IMAGE_OVERRIDES
  | "clinical_illustration" // local premium clinical illustration registry
  | "map_slug" // exact slug match in lesson-image-map.ts
  | "exact_slug" // inventory basename match on lesson.slug / title / fuzzy
  | "topic_slug" // exact inventory basename match on lesson.topicSlug
  | "map_keyword" // keyword match in lesson-image-map.ts (topic/topicSlug text)
  | "map_body_system" // body system fallback in lesson-image-map.ts
  | "none"; // no safe match found

export type LessonImageResolution = {
  /** Public CDN URL, or null when no safe match exists. */
  url: string | null;
  /** Spaces object key, or null. */
  objectKey: string | null;
  /** Human-readable alt text derived from lesson title or slug. */
  alt: string;
  /** How the image was resolved — useful for audit logging and UI labeling. */
  source: LessonImageSource;
  /** Optional registry caption for curated local illustrations. */
  caption?: string | null;
};

function guardResolution(
  res: LessonImageResolution,
  altFallback: string,
): LessonImageResolution {
  if (res.url && hasRenderableLessonImageUrl(res.url)) return res;
  const alt = res.alt?.trim() ? res.alt : altFallback;
  return { url: null, objectKey: null, alt, source: "none", caption: null };
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

/** Re-export for callers that need basename normalization only. */
export { normalizeLessonImageBasename };

function normalizeToBasename(raw: string): string {
  return raw.trim().toLowerCase();
}

function normalizeInventoryObjectKey(raw: string): string {
  return raw.trim().replace(/^\/+/, "");
}

function inventoryContainsObjectKey(
  objectKey: string | null | undefined,
  inventoryKeys: readonly string[],
): objectKey is string {
  if (!objectKey) return false;
  const normalizedObjectKey = normalizeInventoryObjectKey(objectKey);
  return inventoryKeys.some((key) => normalizeInventoryObjectKey(key) === normalizedObjectKey);
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

  const inventoryKeys = getInventoryKeys();

  // 1. Manual override — always wins.
  const overrideKey = LESSON_IMAGE_OVERRIDES[slug] ?? LESSON_IMAGE_OVERRIDES[query.slug.trim()];
  if (inventoryContainsObjectKey(overrideKey, inventoryKeys)) {
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

  const strippedSlug = stripPathwayLessonSlugPrefix(slug);
  if (strippedSlug && strippedSlug !== slug) {
    const strippedOverrideKey = LESSON_IMAGE_OVERRIDES[strippedSlug];
    if (inventoryContainsObjectKey(strippedOverrideKey, inventoryKeys)) {
      return guardResolution(
        {
          url: publicCdnUrlForObjectKey(strippedOverrideKey),
          objectKey: strippedOverrideKey,
          alt,
          source: "override",
        },
        alt,
      );
    }
  }

  const clinicalIllustration = resolveCardiovascularClinicalIllustration({
    slug,
    topic: query.topic,
    topicSlug: query.topicSlug,
    bodySystem: query.bodySystem,
  });
  if (clinicalIllustration) {
    return guardResolution(
      {
        url: clinicalIllustration.publicPath,
        objectKey: clinicalIllustration.publicPath,
        alt: clinicalIllustration.alt,
        source: "clinical_illustration",
        caption: clinicalIllustration.caption,
      },
      alt,
    );
  }

  const mapSlugMatch = resolveImageFromLessonMap({
    slug,
    topicSlug: query.topicSlug,
  });
  if (
    mapSlugMatch?.source === "map_slug" &&
    inventoryContainsObjectKey(mapSlugMatch.objectKey, inventoryKeys)
  ) {
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

  const slugKey = findInventoryObjectKeyForBasename(slug, inventoryKeys);
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

  const semanticInventory = resolveInventoryLessonImageKey(
    {
      slug: query.slug,
      title: query.title,
      topicSlug: query.topicSlug,
    },
    inventoryKeys,
  );
  if (semanticInventory) {
    const topicBasename = query.topicSlug
      ? normalizeToBasename(query.topicSlug)
      : null;
    const source: LessonImageSource =
      topicBasename &&
      semanticInventory.matchedBasename === topicBasename &&
      semanticInventory.matchedBasename !== slug
        ? "topic_slug"
        : "exact_slug";
    return guardResolution(
      {
        url: publicCdnUrlForObjectKey(semanticInventory.objectKey),
        objectKey: semanticInventory.objectKey,
        alt,
        source,
      },
      alt,
    );
  }

  if (query.topicSlug) {
    const topicBasename = normalizeToBasename(query.topicSlug);
    if (topicBasename && topicBasename !== slug) {
      const topicKey = findInventoryObjectKeyForBasename(topicBasename, inventoryKeys);
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
      const topicCandidates = collectLessonImageBasenameCandidates({
        slug: topicBasename,
        title: query.title,
        topicSlug: topicBasename,
      });
      for (const basename of topicCandidates) {
        const key = findInventoryObjectKeyForBasename(basename, inventoryKeys);
        if (key) {
          return guardResolution(
            {
              url: publicCdnUrlForObjectKey(key),
              objectKey: key,
              alt,
              source: "topic_slug",
            },
            alt,
          );
        }
      }
    }
  }

  const mapFuzzyMatch = resolveImageFromLessonMap({
    slug,
    topic: query.topic,
    topicSlug: query.topicSlug,
    bodySystem: query.bodySystem,
  });
  if (
    mapFuzzyMatch &&
    mapFuzzyMatch.source !== "map_slug" &&
    inventoryContainsObjectKey(mapFuzzyMatch.objectKey, inventoryKeys)
  ) {
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
