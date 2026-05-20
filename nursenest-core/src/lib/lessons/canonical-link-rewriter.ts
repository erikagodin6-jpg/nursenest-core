/**
 * Canonical Link Rewriter
 *
 * At render time, rewrites deprecated lesson slugs in lesson body text
 * and relatedLessonRefs to their canonical equivalents.
 *
 * This prevents:
 *  - Dead links in lesson content after a merge
 *  - SEO signals being spread across deprecated + canonical URLs
 *  - Learner navigation to 301-redirect pages
 *
 * Used in the lesson normalization pipeline: applied after overlay,
 * before returning the lesson to the route handler.
 *
 * The slug→redirect map is derived from lesson records that have
 * `redirectToSlug` set. At build time this is derived from the catalog;
 * at request time it falls back to an in-process cache populated once.
 */

import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

// ── Slug redirect map ─────────────────────────────────────────────────────

export type SlugRedirectMap = ReadonlyMap<string, string>;

let _cachedMap: SlugRedirectMap | null = null;

/**
 * Build a slug→redirectToSlug map from all lesson records.
 * Call once at startup or on demand; result is memoized.
 */
export function buildSlugRedirectMap(
  lessons: ReadonlyArray<Pick<PathwayLessonRecord, "slug" | "redirectToSlug">>
): SlugRedirectMap {
  const map = new Map<string, string>();
  for (const l of lessons) {
    if (l.slug && l.redirectToSlug && l.slug !== l.redirectToSlug) {
      map.set(l.slug, l.redirectToSlug);
    }
  }
  return map;
}

/**
 * Provide a pre-built redirect map (used for testing or SSR pre-population).
 */
export function setGlobalSlugRedirectMap(map: SlugRedirectMap): void {
  _cachedMap = map;
}

export function getGlobalSlugRedirectMap(): SlugRedirectMap | null {
  return _cachedMap;
}

// ── Body text rewriter ────────────────────────────────────────────────────

/**
 * Rewrite deprecated lesson slug references in a markdown/prose body string.
 *
 * Matches these patterns:
 *  - `/lessons/deprecated-slug`
 *  - `/lessons/deprecated-slug/` (trailing slash)
 *  - `"slug": "deprecated-slug"` (JSON-like reference in body)
 *  - `[link text](/...lessons/deprecated-slug)`  (markdown link)
 *
 * Does NOT rewrite:
 *  - Slugs that are not deprecated (not in the redirect map)
 *  - Slugs where the redirect would be circular
 */
export function rewriteDeprecatedSlugsInBody(
  body: string,
  redirectMap: SlugRedirectMap
): string {
  if (!body || redirectMap.size === 0) return body;

  let result = body;

  for (const [deprecated, canonical] of redirectMap.entries()) {
    if (!deprecated || !canonical || deprecated === canonical) continue;

    // Escape for use in regex
    const escaped = deprecated.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Pattern 1: URL path segment  /lessons/deprecated-slug (word boundary or / or end)
    result = result.replace(
      new RegExp(`(/lessons/)${escaped}(?=[/"'\\s)\\]>]|$)`, "g"),
      `$1${canonical}`
    );

    // Pattern 2: JSON-like slug reference  "slug": "deprecated-slug"
    result = result.replace(
      new RegExp(`("slug":\\s*")${escaped}(")`,"g"),
      `$1${canonical}$2`
    );
  }

  return result;
}

/**
 * Rewrite deprecated slugs in a lesson's sections and relatedLessonRefs.
 * Returns a new lesson record (does not mutate).
 */
export function rewriteDeprecatedSlugsInLesson(
  lesson: PathwayLessonRecord,
  redirectMap: SlugRedirectMap
): PathwayLessonRecord {
  if (redirectMap.size === 0) return lesson;

  const sections = lesson.sections?.map((section) => {
    const newBody = rewriteDeprecatedSlugsInBody(section.body, redirectMap);
    if (newBody === section.body) return section;
    return { ...section, body: newBody };
  });

  const relatedLessonRefs = lesson.relatedLessonRefs?.map((ref) => {
    const canonical = ref.slug ? redirectMap.get(ref.slug) : undefined;
    if (!canonical) return ref;
    return { ...ref, slug: canonical };
  });

  const hasChanges =
    sections !== lesson.sections || relatedLessonRefs !== lesson.relatedLessonRefs;

  return hasChanges
    ? { ...lesson, sections: sections ?? lesson.sections, relatedLessonRefs }
    : lesson;
}

// ── Build-time audit ──────────────────────────────────────────────────────

export type DeprecatedSlugReference = {
  sourceLessonSlug: string;
  sourcePathwayId: string;
  sectionId: string;
  deprecatedSlug: string;
  canonicalSlug: string;
};

/**
 * Scan all lessons and return references to deprecated slugs.
 * Used by `audit-lesson-canonical-links.mjs` for CI validation.
 */
export function findDeprecatedSlugReferences(
  lessons: ReadonlyArray<
    Pick<PathwayLessonRecord, "slug" | "sections" | "relatedLessonRefs"> & {
      pathwayId?: string;
    }
  >,
  redirectMap: SlugRedirectMap
): DeprecatedSlugReference[] {
  const results: DeprecatedSlugReference[] = [];

  for (const lesson of lessons) {
    const sourcePathwayId = (lesson as Record<string, unknown>).pathwayId as string ?? "unknown";

    for (const section of lesson.sections ?? []) {
      for (const [deprecated, canonical] of redirectMap.entries()) {
        const escaped = deprecated.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = new RegExp(`/lessons/${escaped}(?=[/"'\\s)\\]>]|$)`);
        if (pattern.test(section.body)) {
          results.push({
            sourceLessonSlug: lesson.slug,
            sourcePathwayId,
            sectionId: section.id,
            deprecatedSlug: deprecated,
            canonicalSlug: canonical,
          });
        }
      }
    }

    for (const ref of lesson.relatedLessonRefs ?? []) {
      if (ref.slug && redirectMap.has(ref.slug)) {
        results.push({
          sourceLessonSlug: lesson.slug,
          sourcePathwayId,
          sectionId: "relatedLessonRefs",
          deprecatedSlug: ref.slug,
          canonicalSlug: redirectMap.get(ref.slug)!,
        });
      }
    }
  }

  return results;
}
