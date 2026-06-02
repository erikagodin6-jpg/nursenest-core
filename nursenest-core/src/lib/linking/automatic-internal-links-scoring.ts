/**
 * Pure scoring helpers for automatic internal linking (tests + server loader).
 */

import type { MatchStrength } from "@/lib/linking/internal-link-types";
import { mapExamStringToSeoTier } from "@/lib/seo/seo-taxonomy-align";

export function normalizedExamKey(exam: string | null | undefined): string {
  return (exam ?? "").trim().toLowerCase();
}

/** Same marketing exam track — blocks RN vs PN / allied cross-linking for blog rows. */
export function blogExamsAllowPairing(
  postExam: string | null | undefined,
  candidateExam: string | null | undefined,
): boolean {
  const a = normalizedExamKey(postExam);
  const b = normalizedExamKey(candidateExam);
  if (a && b) return a === b;
  if (!a && !b) return true;
  return false;
}

/** SEO tier alignment (RN / RPN / NP / allied / new-grad) — never mix unrelated tiers. */
export function blogSeoTiersAllowPairing(
  postExam: string | null | undefined,
  candidateExam: string | null | undefined,
): boolean {
  return mapExamStringToSeoTier(postExam) === mapExamStringToSeoTier(candidateExam);
}

export function tagOverlapCount(a: readonly string[], b: readonly string[]): number {
  const set = new Set(a.map((t) => t.trim().toLowerCase()).filter(Boolean));
  if (set.size === 0) return 0;
  let n = 0;
  for (const raw of b) {
    const t = raw.trim().toLowerCase();
    if (t && set.has(t)) n += 1;
  }
  return n;
}

export function scoreBlogRelatedness(input: {
  postTags: readonly string[];
  candidateTags: readonly string[];
  categoryMatch: boolean;
  taxonomyLeafMatch: boolean;
}): { rank: number; strength: MatchStrength } {
  const overlap = tagOverlapCount(input.postTags, input.candidateTags);
  let rank = 80;
  if (input.taxonomyLeafMatch) rank -= 35;
  else if (input.categoryMatch) rank -= 18;
  if (overlap >= 3) rank -= 28;
  else if (overlap === 2) rank -= 18;
  else if (overlap === 1) rank -= 8;

  let strength: MatchStrength = "weak";
  if (rank <= 25) strength = "strong";
  else if (rank <= 45) strength = "moderate";

  return { rank, strength };
}

export function scoreLessonSiblingRelatedness(input: {
  sameTopicSlug: boolean;
  sameBodySystem: boolean;
  titleTokenOverlap: number;
}): { rank: number; strength: MatchStrength } {
  let rank = 70;
  if (input.sameTopicSlug) rank -= 40;
  if (input.sameBodySystem) rank -= 12;
  rank -= Math.min(15, input.titleTokenOverlap * 3);

  let strength: MatchStrength = "weak";
  if (rank <= 25) strength = "strong";
  else if (rank <= 45) strength = "moderate";
  return { rank, strength };
}

export function tokenOverlapTitle(a: string, b: string): number {
  const stop = new Set(["the", "and", "for", "with", "from", "your", "how", "what", "when", "into", "this", "that"]);
  const words = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stop.has(w));
  const aw = words(a);
  const bw = new Set(words(b));
  if (aw.length === 0 || bw.size === 0) return 0;
  let n = 0;
  for (const w of aw) {
    if (bw.has(w)) n += 1;
  }
  return n;
}
