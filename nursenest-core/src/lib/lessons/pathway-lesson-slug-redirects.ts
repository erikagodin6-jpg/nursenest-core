/**
 * **Canonical lesson slug migrations** (pathway-scoped).
 *
 * When a lesson `slug` in `catalog.json` / `pathway_lessons` is renamed, add a row here so:
 * - Old marketing URLs `/[country]/[role]/[exam]/lessons/[oldSlug]` 308 → canonical slug
 * - `getPathwayLesson` miss + registry hit triggers {@link loadPathwayLessonWithLegacySlugRedirect}
 *
 * **Audit (2026-04):** RN NCLEX-RN / CA RN catalog merged shallow duplicate rows into fuller `us-rn-*` / `ca-rn-*` lessons;
 * legacy marketing URLs for removed slugs redirect here.
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
export const PATHWAY_LESSON_SLUG_REDIRECTS: readonly PathwayLessonSlugRedirect[] = [
  { pathwayId: "us-rn-nclex-rn", fromSlug: "pulmonary-embolism-nclex-rn", toSlug: "us-rn-pulmonary-embolism" },
  { pathwayId: "us-rn-nclex-rn", fromSlug: "heart-failure-nclex-rn", toSlug: "us-rn-heart-failure" },
  { pathwayId: "us-rn-nclex-rn", fromSlug: "myocardial-infarction-nclex-rn", toSlug: "us-rn-myocardial-infarction" },
  { pathwayId: "us-rn-nclex-rn", fromSlug: "insulin-hypoglycemia-hy", toSlug: "us-rn-insulin-hypoglycemia" },
  { pathwayId: "ca-rn-nclex-rn", fromSlug: "pulmonary-embolism-nclex-rn", toSlug: "ca-rn-pulmonary-embolism" },
  { pathwayId: "ca-rn-nclex-rn", fromSlug: "heart-failure-nclex-rn", toSlug: "ca-rn-heart-failure" },
  { pathwayId: "ca-rn-nclex-rn", fromSlug: "myocardial-infarction-nclex-rn", toSlug: "ca-rn-myocardial-infarction" },
  { pathwayId: "ca-rn-nclex-rn", fromSlug: "insulin-hypoglycemia-hy", toSlug: "ca-rn-insulin-hypoglycemia" },
];

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

/** For `next.config.mjs` — static 308s at the edge (same paths the App Router uses). */
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
