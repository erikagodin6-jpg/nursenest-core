/**
 * **Canonical lesson slug migrations** (pathway-scoped).
 *
 * When a lesson `slug` in `catalog.json` / `pathway_lessons` is renamed, add a row here so:
 * - Old marketing URLs `/[country]/[role]/[exam]/lessons/[oldSlug]` 308 → canonical slug
 * - `getPathwayLesson` miss + registry hit triggers {@link loadPathwayLessonWithLegacySlugRedirect}
 *
 * **Audit (2026-04):** No renames are registered yet — git history for `catalog.json` shows bulk appends, not slug renames.
 * Keep this list authoritative when editorial re-slugs content.
 *
 * **Rules:** `fromSlug` ≠ `toSlug`; avoid cycles; one row per rename (chains are resolved in code).
 */
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { EXAM_PATHWAYS } from "../exam-pathways/exam-product-registry";

export type PathwayLessonSlugRedirect = {
  pathwayId: string;
  fromSlug: string;
  toSlug: string;
};

/** Add entries when a published lesson slug changes; empty means no legacy URLs to honor. */
export const PATHWAY_LESSON_SLUG_REDIRECTS: readonly PathwayLessonSlugRedirect[] = [];

const MAX_CHAIN = 12;

/**
 * Returns the final slug after following `fromSlug → toSlug` edges for this pathway, or `null` if none.
 */
export function resolvePathwayLessonSlugRedirectChain(pathwayId: string, slug: string): string | null {
  const map = new Map<string, string>();
  for (const r of PATHWAY_LESSON_SLUG_REDIRECTS) {
    if (r.pathwayId === pathwayId && r.fromSlug !== r.toSlug) {
      map.set(r.fromSlug, r.toSlug);
    }
  }
  if (map.size === 0) return null;
  let current = slug;
  const seen = new Set<string>();
  let steps = 0;
  while (map.has(current) && steps < MAX_CHAIN) {
    if (seen.has(current)) return null;
    seen.add(current);
    current = map.get(current)!;
    steps += 1;
  }
  return seen.size > 0 ? current : null;
}

/** For `next.config.ts` — static 308s at the edge (same paths the App Router uses). */
export function buildPathwayLessonSlugRedirectsForNextConfig(): Array<{
  source: string;
  destination: string;
  permanent: true;
}> {
  const byId = new Map(EXAM_PATHWAYS.map((p) => [p.id, p] as const));
  const out: Array<{ source: string; destination: string; permanent: true }> = [];
  for (const r of PATHWAY_LESSON_SLUG_REDIRECTS) {
    if (r.fromSlug === r.toSlug) continue;
    const p = byId.get(r.pathwayId);
    if (!p) continue;
    out.push({
      source: buildExamPathwayPath(p, `lessons/${encodeURIComponent(r.fromSlug)}`),
      destination: buildExamPathwayPath(p, `lessons/${encodeURIComponent(r.toSlug)}`),
      permanent: true,
    });
  }
  return out;
}
