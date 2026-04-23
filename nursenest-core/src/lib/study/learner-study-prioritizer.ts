import type { CatPoolRow } from "@/lib/exams/cat-engine";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { hashSeedToUint32 } from "@/lib/practice-tests/session-seeded-random";
import {
  STUDY_LINEAR_PRIORITIZE_CANDIDATE_MULTIPLIER,
  STUDY_LINEAR_PRIORITIZE_MIN_SPARE,
} from "@/lib/study/study-diversity-config";

export type LinearStudyPrioritizerMode = "random" | "targeted" | "weak" | "missed";

/** Shape-compatible with {@link MissedQuestionSignal} from study-question-signals (pure module). */
export type MissedSignalLite = { missCount: number; lastMissedAtMs: number };

export type LinearStudyPrioritizerInput = {
  rows: CatPoolRow[];
  mode: LinearStudyPrioritizerMode;
  questionCount: number;
  sessionPickSalt: string;
  weakPriorityByCanonical: Map<string, number>;
  missedSignals: Map<string, MissedSignalLite>;
  /** Most recent session start (ms) that included each question id for this pathway. */
  lastExposureStartedAtMs: Map<string, number>;
  recentSessionQuestionIds: Set<string>;
  nowMs: number;
};

function tieSalt(salt: string, id: string): number {
  return hashSeedToUint32(`${salt}\0${id}`) >>> 0;
}

function compareIds(salt: string, a: string, b: string): number {
  const va = tieSalt(salt, a);
  const vb = tieSalt(salt, b);
  if (va === vb) return a.localeCompare(b);
  return va < vb ? -1 : 1;
}

/**
 * Builds a bounded candidate band (length ≥ questionCount when the pool allows) so
 * {@link linearSessionPickOrder} can apply per-session shuffle without destroying mode intent.
 */
export function buildPrioritizedLinearPickBand(input: LinearStudyPrioritizerInput): string[] {
  const n = Math.min(100, Math.max(5, Math.floor(input.questionCount)));
  const salt =
    input.sessionPickSalt.trim().length >= 8 ? input.sessionPickSalt.trim() : "nn-linear-salt";
  const bandSize = Math.min(
    input.rows.length,
    Math.max(n * STUDY_LINEAR_PRIORITIZE_CANDIDATE_MULTIPLIER, n + STUDY_LINEAR_PRIORITIZE_MIN_SPARE),
  );

  const scored = input.rows.map((r) => {
    const id = r.id;
    const topicCanon = normalizeTopicKey(r.topic ?? "");
    const weakP = topicCanon ? (input.weakPriorityByCanonical.get(topicCanon) ?? 0) : 0;
    const missed = input.missedSignals.get(id);
    const inRecentSessions = input.recentSessionQuestionIds.has(id);
    const last = input.lastExposureStartedAtMs.get(id);
    const daysSince = last ? (input.nowMs - last) / 86_400_000 : 1_000;

    let score = 0;
    if (input.mode === "missed") {
      if (missed) {
        score =
          missed.missCount * 1_000_000 +
          missed.lastMissedAtMs / 1000 +
          (tieSalt(`${salt}:missed`, id) % 1000);
      } else {
        score = tieSalt(`${salt}:missed-fill`, id) % 5000;
      }
    } else if (input.mode === "weak") {
      score =
        weakP * 1_000_000 +
        Math.min(50_000, daysSince * 100) +
        (tieSalt(`${salt}:weak`, id) % 500);
    } else if (input.mode === "targeted") {
      const fresh = inRecentSessions ? -500_000 : 500_000;
      score = fresh + Math.min(80_000, daysSince * 200) + weakP * 20_000 + (tieSalt(`${salt}:tgt`, id) % 800);
    } else {
      const fresh = inRecentSessions ? -800_000 : 800_000;
      score = fresh + Math.min(120_000, daysSince * 300) + weakP * 25_000 + (tieSalt(`${salt}:rnd`, id) % 2000);
    }
    return { id, score };
  });

  scored.sort((a, b) => b.score - a.score || compareIds(salt, a.id, b.id));
  return scored.slice(0, bandSize).map((x) => x.id);
}
