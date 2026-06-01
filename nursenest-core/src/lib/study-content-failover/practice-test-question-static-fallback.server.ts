/**
 * Static question bank fallback for practice test question fetch.
 *
 * When GET /api/practice-tests/[id]/question cannot serve a question after retries
 * (because the question is not in cache and the DB is unavailable), this module
 * returns a representative question from the static content bundles.
 *
 * The returned question is marked with a fallback flag so the client can display
 * it in a degraded mode (no peer stats, no adaptive tracking).
 *
 * Fallback chain for question fetch:
 *   Primary:  DB ExamQuestion by id + access scope
 *   Secondary: Static bundle question matched by topic/pathway
 *   (There is no tertiary — if secondary fails too, return 503)
 */
import "server-only";

import { NCLEX_PN_GAP_QUESTIONS } from "@/content/questions/nclex-pn-gap-closure-questions";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type StaticFallbackQuestion = {
  id: string;
  stem: string;
  questionType: "MCQ" | "SATA";
  options: readonly string[];
  correct: readonly number[];
  topic: string;
  domain: string;
  rationale: string;
  _isFallback: true;
};

function toFallbackShape(q: (typeof NCLEX_PN_GAP_QUESTIONS)[number]): StaticFallbackQuestion {
  return {
    id: q.id,
    stem: q.stem,
    questionType: q.questionType,
    options: q.options,
    correct: q.correct,
    topic: q.topic,
    domain: q.domain,
    rationale: q.rationale,
    _isFallback: true as const,
  };
}

/**
 * Returns a fallback question from static bundles, preferring topic alignment.
 * Returns null if no static content is available.
 */
export function getFallbackQuestion(args: {
  topic?: string | null;
  pathwayId?: string | null;
  practiceTestId: string;
}): StaticFallbackQuestion | null {
  const { topic, practiceTestId } = args;

  safeServerLog("practice_test_question", "static_fallback_activated", {
    practiceTestId: practiceTestId.slice(0, 16),
    topic: topic ?? null,
  });

  const pool = [...NCLEX_PN_GAP_QUESTIONS];
  if (pool.length === 0) return null;

  // Best-effort topic match
  if (topic && topic.trim().length > 2) {
    const needle = topic.trim().toLowerCase();
    const matched = pool.filter(
      (q) =>
        q.topic.toLowerCase().includes(needle) ||
        q.domain.toLowerCase().includes(needle) ||
        q.weakAreaTag.toLowerCase().includes(needle),
    );
    if (matched.length > 0) {
      const pick = matched[Math.floor(Date.now() / 60_000) % matched.length];
      if (pick) return toFallbackShape(pick);
    }
  }

  // Random by time-bucket (changes every minute to give variety across retries)
  const idx = Math.floor(Date.now() / 60_000) % pool.length;
  const picked = pool[idx];
  return picked ? toFallbackShape(picked) : null;
}
