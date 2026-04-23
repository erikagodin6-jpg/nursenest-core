import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadWeakTopicPracticePlan } from "@/lib/learner/topic-performance";
import type {
  LinearDeliveryMode,
  LinearRationaleVisibility,
  PracticeTestConfigJson,
  PracticeTestSelectionMode,
} from "@/lib/practice-tests/types";
import { fetchCatPracticePool } from "@/lib/practice-tests/cat-pool";
import {
  filterPoolRemovingRecentQuestions,
  recentPracticeQuestionIdsForPathway,
} from "@/lib/practice-tests/recent-practice-question-ids";
import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";

/** Linear pool selection — CAT uses {@link createCatPracticeTestPayload} instead. */
export type LinearPoolSelectionMode = Exclude<PracticeTestSelectionMode, "cat">;

export const PRACTICE_TEST_MIN_Q = 5;
export const PRACTICE_TEST_MAX_Q = 100;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export type PickQuestionsInput = {
  questionCount: number;
  topicNames: string[];
  difficultyMin: number | null;
  difficultyMax: number | null;
  selectionMode: LinearPoolSelectionMode;
  pathwayId: string | null;
  /** When set, shuffles the eligible pool deterministically (stable across retries for the same session). */
  sessionPickSalt?: string;
};

export type LinearPracticeSessionPickDebug = {
  poolSize: number;
  poolAfterRecentSize: number;
  recentSessionsScanned: number;
  recentIdCount: number;
  recentExclusionApplied: boolean;
  recentExclusionSkip?: string;
};

export async function pickPracticeQuestionIds(
  userId: string,
  entitlement: AccessScope,
  input: PickQuestionsInput,
): Promise<
  | { ok: true; ids: string[]; linearSessionCreateDebug: LinearPracticeSessionPickDebug }
  | { ok: false; message: string }
> {
  const n = Math.min(PRACTICE_TEST_MAX_Q, Math.max(PRACTICE_TEST_MIN_Q, Math.floor(input.questionCount)));

  if (input.selectionMode === "targeted" && input.topicNames.length === 0) {
    return { ok: false, message: "Targeted mode requires at least one topic." };
  }

  if (input.selectionMode === "weak") {
    const plan = await loadWeakTopicPracticePlan(userId, entitlement, 16);
    if (plan.priorityByCanonical.size === 0) {
      return {
        ok: false,
        message:
          "No weak areas yet. Answer graded questions, finish a mock, or complete a practice test. Then try weak mode again.",
      };
    }
  }

  // Linear practice now reuses the same pathway-safe, rationale-complete CAT pool gates.
  const pool = await fetchCatPracticePool(userId, entitlement, input);
  if (pool.length < n) {
    return {
      ok: false,
      message: `Only ${pool.length} exam-eligible question(s) match your filters. Relax topics or difficulty, or reduce count.`,
    };
  }

  const pathwayIdForRecent = input.pathwayId?.trim() ? input.pathwayId.trim() : null;
  const recentPack = await recentPracticeQuestionIdsForPathway({
    userId,
    pathwayId: pathwayIdForRecent,
  });
  const recentFiltered = filterPoolRemovingRecentQuestions(pool, recentPack.ids, n);

  const poolIds = recentFiltered.pool.map((p) => p.id);
  const salt = input.sessionPickSalt?.trim();
  const ids = (salt && salt.length >= 8
    ? shuffleSeeded(poolIds, `${salt}:linear-pool`)
    : shuffle(poolIds)
  ).slice(0, n);
  return {
    ok: true,
    ids,
    linearSessionCreateDebug: {
      poolSize: pool.length,
      poolAfterRecentSize: recentFiltered.pool.length,
      recentSessionsScanned: recentPack.sessionsScanned,
      recentIdCount: recentPack.ids.size,
      recentExclusionApplied: recentFiltered.applied,
      recentExclusionSkip: recentFiltered.skipReason,
    },
  };
}

export function configFromInput(
  input: PickQuestionsInput,
  timedMode: boolean,
  timeLimitSec: number | null,
  extras?: { linearDeliveryMode?: LinearDeliveryMode; linearRationaleVisibility?: LinearRationaleVisibility },
): PracticeTestConfigJson {
  return {
    questionCount: input.questionCount,
    topicNames: input.topicNames,
    difficultyMin: input.difficultyMin,
    difficultyMax: input.difficultyMax,
    selectionMode: input.selectionMode,
    pathwayId: input.pathwayId,
    timedMode,
    timeLimitSec,
    ...(extras?.linearDeliveryMode ? { linearDeliveryMode: extras.linearDeliveryMode } : {}),
    ...(extras?.linearRationaleVisibility ? { linearRationaleVisibility: extras.linearRationaleVisibility } : {}),
  };
}
