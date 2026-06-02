import { randomUUID } from "node:crypto";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  loadMissedQuestionSignals,
  loadSavedRationaleQuestionIdsForPoolFilter,
} from "@/lib/learner/study-question-signals";
import { loadWeakTopicPracticePlan } from "@/lib/learner/topic-performance";
import type {
  LinearDeliveryMode,
  LinearRationaleVisibility,
  PracticeTestConfigJson,
  PracticeTestSelectionMode,
} from "@/lib/practice-tests/types";
import { fetchCatPracticePoolCached } from "@/lib/practice-tests/cat-pool";
import {
  filterPoolRemovingRecentQuestions,
  questionLastExposureStartedAtMsForPathway,
  recentPracticeQuestionIdsForPathway,
} from "@/lib/practice-tests/recent-practice-question-ids";
import {
  linearSessionPickOrder,
  PRACTICE_TEST_MAX_Q,
  PRACTICE_TEST_MIN_Q,
} from "@/lib/practice-tests/linear-session-pick-order";
import { balanceCognitiveLoadSequence } from "@/lib/questions/adaptive-question-selection";
import { buildPrioritizedLinearPickBand } from "@/lib/study/learner-study-prioritizer";
import {
  practiceRecentSessionLookback,
  STUDY_DIVERSITY_PRACTICE_RECENT_MIN_REMAINING_DEFAULT,
} from "@/lib/study/study-diversity-config";
import { logStudyDiversity } from "@/lib/study/study-diversity-log";
import { logCoreApiStudyDiagnostic } from "@/lib/observability/core-api-diagnostics";

/** Linear pool selection — CAT uses {@link createCatPracticeTestPayload} instead. */
export type LinearPoolSelectionMode = Exclude<PracticeTestSelectionMode, "cat">;

export { linearSessionPickOrder, PRACTICE_TEST_MAX_Q, PRACTICE_TEST_MIN_Q };

export type PickQuestionsInput = {
  questionCount: number;
  topicNames: string[];
  difficultyMin: number | null;
  difficultyMax: number | null;
  selectionMode: LinearPoolSelectionMode;
  pathwayId: string | null;
  /** When set, shuffles the eligible pool deterministically (stable across retries for the same session). */
  sessionPickSalt?: string;
  /** CAT / shared pool: widen filters when the narrow slice is too small (practice hub default). */
  selectionStrictness?: "soft" | "strict";
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
  | {
      ok: true;
      ids: string[];
      linearSessionCreateDebug: LinearPracticeSessionPickDebug;
    }
  | { ok: false; message: string }
> {
  const n = Math.min(
    PRACTICE_TEST_MAX_Q,
    Math.max(PRACTICE_TEST_MIN_Q, Math.floor(input.questionCount)),
  );

  if (input.selectionMode === "starred") {
    const starredIds = await loadSavedRationaleQuestionIdsForPoolFilter(
      userId,
      200,
    );
    if (starredIds.length === 0) {
      return {
        ok: false,
        message:
          "No starred questions yet. Star items in the question bank or during review, then try a saved-questions practice exam.",
      };
    }
  }

  if (input.selectionMode === "targeted" && input.topicNames.length === 0) {
    return { ok: false, message: "Targeted mode requires at least one topic." };
  }

  const missedSignals = await loadMissedQuestionSignals(userId);
  if (input.selectionMode === "missed" && missedSignals.size === 0) {
    return {
      ok: false,
      message:
        "No missed questions found yet. Complete a graded practice session with incorrect answers, then try missed mode again.",
    };
  }

  const weakPlanForPrioritize =
    input.selectionMode === "missed"
      ? {
          dbTopicNames: [] as string[],
          priorityByCanonical: new Map<string, number>(),
        }
      : await loadWeakTopicPracticePlan(userId, entitlement, 16);
  if (
    input.selectionMode === "weak" &&
    weakPlanForPrioritize.priorityByCanonical.size === 0
  ) {
    return {
      ok: false,
      message:
        "No weak areas yet. Answer graded questions, finish a mock, or complete a practice test. Then try weak mode again.",
    };
  }

  // Linear practice now reuses the same pathway-safe, rationale-complete CAT pool gates.
  const { pool } = await fetchCatPracticePoolCached(userId, entitlement, input);
  if (pool.length < n) {
    return {
      ok: false,
      message: `Only ${pool.length} exam-eligible question(s) match your filters. Relax topics or difficulty, or reduce count.`,
    };
  }

  const pathwayIdForRecent = input.pathwayId?.trim()
    ? input.pathwayId.trim()
    : null;
  const recentPack = await recentPracticeQuestionIdsForPathway({
    userId,
    pathwayId: pathwayIdForRecent,
    sessionLookback: practiceRecentSessionLookback(input.selectionMode),
  });
  const minRemain = Math.min(
    Math.max(STUDY_DIVERSITY_PRACTICE_RECENT_MIN_REMAINING_DEFAULT, n),
    pool.length,
  );
  const recentFiltered = filterPoolRemovingRecentQuestions(
    pool,
    recentPack.ids,
    minRemain,
  );

  const saltTrim = input.sessionPickSalt?.trim();
  const pickSalt = saltTrim && saltTrim.length >= 8 ? saltTrim : randomUUID();

  const lastExposureMs = pathwayIdForRecent
    ? await questionLastExposureStartedAtMsForPathway({
        userId,
        pathwayId: pathwayIdForRecent,
        sessionLookback: practiceRecentSessionLookback(input.selectionMode),
      })
    : new Map<string, number>();

  const bandIds = buildPrioritizedLinearPickBand({
    rows: recentFiltered.pool,
    mode: input.selectionMode,
    questionCount: n,
    sessionPickSalt: pickSalt,
    weakPriorityByCanonical: weakPlanForPrioritize.priorityByCanonical,
    missedSignals,
    lastExposureStartedAtMs: lastExposureMs,
    recentSessionQuestionIds: recentPack.ids,
    nowMs: Date.now(),
  });

  const shuffledIds = linearSessionPickOrder(bandIds, n, input.sessionPickSalt);
  const rowById = new Map(recentFiltered.pool.map((row) => [row.id, row]));
  const selectedRows = shuffledIds.flatMap((id) => {
    const row = rowById.get(id);
    return row ? [row] : [];
  });
  const balancedRows = balanceCognitiveLoadSequence(selectedRows);
  const balancedIds = balancedRows.map((row) => row.id);
  const ids =
    balancedIds.length === shuffledIds.length ? balancedIds : shuffledIds;
  logStudyDiversity("linear_pick", {
    poolSize: pool.length,
    poolAfterRecent: recentFiltered.pool.length,
    recentApplied: recentFiltered.applied ? 1 : 0,
    selectionMode: input.selectionMode,
    questionCount: n,
    hasSalt: saltTrim && saltTrim.length >= 8 ? 1 : 0,
    prioritizedBand: bandIds.length,
    cognitiveLoadBalanced: 1,
  });
  logCoreApiStudyDiagnostic({
    endpoint: "pickPracticeQuestionIds",
    pathwayId: pathwayIdForRecent,
    tier: String(entitlement.tier ?? ""),
    selectionMode: input.selectionMode,
    rowsFound: pool.length,
    rowsReturned: ids.length,
    poolAfterRecent: recentFiltered.pool.length,
  });
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
  extras?: {
    linearDeliveryMode?: LinearDeliveryMode;
    linearRationaleVisibility?: LinearRationaleVisibility;
    linearAllowReviewNavigation?: boolean;
  },
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
    ...(extras?.linearDeliveryMode
      ? { linearDeliveryMode: extras.linearDeliveryMode }
      : {}),
    ...(extras?.linearRationaleVisibility
      ? { linearRationaleVisibility: extras.linearRationaleVisibility }
      : {}),
    ...(extras?.linearAllowReviewNavigation === true
      ? { linearAllowReviewNavigation: true }
      : {}),
  };
}
