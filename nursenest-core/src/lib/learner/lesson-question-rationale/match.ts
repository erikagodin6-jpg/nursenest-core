/**
 * Ranking and gating for **lesson ↔ question** rationale links.
 */
import { EXAM_COMPLETE_MED_SAFETY_SLUGS } from "@/lib/lessons/scoped-lessons/exam-complete-med-safety-specs";
import { CASE_STUDY_CASEBOOK_SLUGS } from "@/lib/lessons/scoped-lessons/case-study-casebook-specs";
import { tryExplicitTieredTopicLinks } from "@/lib/learner/lesson-question-rationale/explicit-tiered-rationale-topics";
import { LESSON_RATIONALE_MAPPING_ENTRIES } from "@/lib/learner/lesson-question-rationale/registry";
import { TIER_RATIONALE_REGISTRY_EXTRA_SLUGS } from "@/lib/learner/lesson-question-rationale/tier-rationale-registry-expansion";
import { gatesAllowEntry } from "@/lib/learner/lesson-question-rationale/tier-rationale-gates";
import type {
  LessonConceptDomain,
  PathwayRationaleContext,
  QuestionRationaleSignals,
  RankedLessonSlug,
  RankRelatedLessonSlugsOptions,
} from "@/lib/learner/lesson-question-rationale/types";

/** Slugs that may appear in links even if not yet duplicated in registry rows (safety net). */
const SLUG_ALLOWLIST = new Set<string>([
  ...LESSON_RATIONALE_MAPPING_ENTRIES.map((e) => e.lessonSlug),
  ...EXAM_COMPLETE_MED_SAFETY_SLUGS,
  ...CASE_STUDY_CASEBOOK_SLUGS,
  ...TIER_RATIONALE_REGISTRY_EXTRA_SLUGS,
]);

export function haystackFromQuestionSignals(signals: QuestionRationaleSignals): string {
  const stem = typeof signals.stem === "string" ? signals.stem.trim().slice(0, 520) : "";
  const parts = [
    ...signals.tags.map((t) => String(t)),
    signals.topic ?? "",
    signals.subtopic ?? "",
    signals.bodySystem ?? "",
    stem,
  ];
  return parts.join(" ").toLowerCase();
}

function isAllowedEmitSlug(slug: string): boolean {
  return SLUG_ALLOWLIST.has(slug);
}

/**
 * Score and rank lesson slugs from **question metadata** + optional **pathway context**.
 *
 * **Ranking model**
 * 1. For each registry entry, if `haystackPattern` matches the haystack, start from `baseWeight`.
 * 2. Add `topicKeyBonus` when `topicCode` matches or contains a listed key.
 * 3. Add capped tag hints (substring match on each question tag).
 * 4. Keep the **best score per `lessonSlug`** (multiple entries can target the same lesson).
 * 5. Sort by score descending; apply **diversity**: at most one link per `LessonConceptDomain` unless
 *    a later candidate in that domain clears `diversityStrongThreshold` (default 92).
 * 6. Return up to `maxLinks` rows with `score >= minScore`.
 */
export function rankRelatedLessonSlugsForQuestion(
  signals: QuestionRationaleSignals,
  pathwayCtx: PathwayRationaleContext | null,
  options?: RankRelatedLessonSlugsOptions,
): RankedLessonSlug[] {
  const maxLinks = options?.maxLinks ?? 5;
  const minScore = options?.minScore ?? 72;
  const diversityStrong = options?.diversityStrongThreshold ?? 92;

  const hay = haystackFromQuestionSignals(signals);
  if (hay.trim().length < 3) return [];

  const topicCode = (signals.topicCode ?? "").trim().toLowerCase();
  const bySlug = new Map<string, RankedLessonSlug>();

  for (const hit of tryExplicitTieredTopicLinks(signals, pathwayCtx)) {
    const prev = bySlug.get(hit.lessonSlug);
    if (!prev || hit.score > prev.score) {
      bySlug.set(hit.lessonSlug, hit);
    }
  }

  for (const entry of LESSON_RATIONALE_MAPPING_ENTRIES) {
    if (!gatesAllowEntry(entry, pathwayCtx)) continue;
    if (!entry.haystackPattern.test(hay)) continue;

    let score = entry.baseWeight;

    if (entry.topicKeyBonus && topicCode) {
      const { keys, bonus } = entry.topicKeyBonus;
      if (keys.some((k) => topicCode === k || topicCode.includes(k))) {
        score += bonus;
      }
    }

    if (entry.tagHints && signals.tags.length > 0) {
      const { hints, bonusEach, maxBonus } = entry.tagHints;
      let add = 0;
      const lowered = signals.tags.map((t) => String(t).toLowerCase());
      for (const h of hints) {
        if (lowered.some((t) => t.includes(h))) add += bonusEach;
      }
      score += Math.min(add, maxBonus);
    }

    if (!isAllowedEmitSlug(entry.lessonSlug)) continue;

    const next: RankedLessonSlug = {
      lessonSlug: entry.lessonSlug,
      kind: entry.linkKind,
      domain: entry.domain,
      score,
      matchedEntryId: entry.id,
    };

    const prev = bySlug.get(entry.lessonSlug);
    if (!prev || next.score > prev.score) {
      bySlug.set(entry.lessonSlug, next);
    }
  }

  const sorted = [...bySlug.values()].sort((a, b) => b.score - a.score).filter((r) => r.score >= minScore);

  const out: RankedLessonSlug[] = [];
  const usedDomains = new Map<LessonConceptDomain, number>();
  for (const row of sorted) {
    const n = usedDomains.get(row.domain) ?? 0;
    if (n >= 1 && row.score < diversityStrong) continue;
    if (n >= 2) continue;
    out.push(row);
    usedDomains.set(row.domain, n + 1);
    if (out.length >= maxLinks) break;
  }

  return out;
}
