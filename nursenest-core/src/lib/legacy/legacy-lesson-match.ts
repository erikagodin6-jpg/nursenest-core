/**
 * Conservative matching for Replit / monolith legacy lesson rows → current `PathwayLesson` rows.
 * Slug match remains primary; title similarity is secondary and intentionally strict to avoid wrong merges.
 */

/** Normalize titles for token overlap (shared idea with NP legacy merge, pathway-scoped only). */
export function normalizeLessonTitleForMatch(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(s: string): Set<string> {
  const n = normalizeLessonTitleForMatch(s);
  const parts = n.split(" ").filter((w) => w.length > 1);
  return new Set(parts);
}

/**
 * Jaccard similarity on word tokens (0–1). Short titles need almost exact overlap.
 */
export function legacyLessonTitleSimilarity(a: string, b: string): number {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) {
    if (B.has(t)) inter += 1;
  }
  const union = A.size + B.size - inter;
  return union > 0 ? inter / union : 0;
}

/** Minimum score to consider a title-based match (secondary to slug). */
export const LEGACY_TITLE_MATCH_MIN_SCORE = 0.86;

/** Require this gap between best and second-best to avoid ambiguous merges. */
export const LEGACY_TITLE_MATCH_AMBIGUITY_MARGIN = 0.04;

export type TitleMatchPick<T extends { title: string }> =
  | { match: "none" }
  | { match: "ambiguous" }
  | { match: "one"; row: T; score: number };

/**
 * Picks at most one candidate when a single row clearly wins by title similarity.
 */
export function pickSingleTitleMatch<T extends { title: string }>(
  legacyTitle: string,
  candidates: T[],
  minScore = LEGACY_TITLE_MATCH_MIN_SCORE,
  margin = LEGACY_TITLE_MATCH_AMBIGUITY_MARGIN,
): TitleMatchPick<T> {
  const lt = legacyTitle?.trim() ?? "";
  if (lt.length < 4) return { match: "none" };

  let best: { row: T; score: number } | null = null;
  let second = 0;

  for (const c of candidates) {
    const score = legacyLessonTitleSimilarity(lt, c.title);
    if (score < minScore) continue;
    if (!best || score > best.score) {
      second = best?.score ?? 0;
      best = { row: c, score };
    } else if (score > second) {
      second = score;
    }
  }

  if (!best) return { match: "none" };
  if (second >= minScore && best.score - second < margin) return { match: "ambiguous" };
  return { match: "one", row: best.row, score: best.score };
}
