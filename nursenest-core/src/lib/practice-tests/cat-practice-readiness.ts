import { validatePracticeCatPool } from "@/lib/exams/cat-engine";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  pathwayAllowsCatAdaptiveStart,
  subscriptionCoversPathwayBase,
} from "@/lib/exam-pathways/pathway-entitlements";
import { readinessConfigForPathwayId } from "@/lib/exam-pathways/pathway-readiness-config";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { fetchCatPracticePool } from "@/lib/practice-tests/cat-pool";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import type { PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";

export type CatPracticeReadinessResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

/**
 * Server-only preflight for pathway CAT practice (same gates as {@link createCatPracticeTestPayload} pool phase).
 * Used by the start UI and GET `/api/practice-tests/cat-readiness` — never trust the client for entitlements.
 */
export async function assessCatPracticeReadinessForPathway(
  userId: string,
  entitlement: AccessScope,
  pathwayId: string,
): Promise<CatPracticeReadinessResult> {
  const trimmed = pathwayId.trim();
  if (trimmed.length < 2) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found,
      message: "Choose an exam pathway from the list.",
    };
  }

  const pathway = getExamPathwayById(trimmed);
  if (!pathway) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_found,
      message: "That exam pathway is not recognized. Refresh the page or pick another track.",
    };
  }

  if (!pathwayAllowsCatAdaptiveStart(pathway)) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_track_not_ready,
      message:
        "Adaptive (CAT) practice is not open for this track yet. Use lessons and the question bank on the pathway hub, join the waitlist if available, or select another active track your subscription includes.",
    };
  }

  if (!subscriptionCoversPathwayBase(entitlement, pathway)) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled,
      message:
        "Your plan does not include this pathway. Pick a track that matches your subscription and region, or review options under Account → Billing.",
    };
  }

  const readinessConfig = readinessConfigForPathwayId(trimmed);
  const poolInput: PickQuestionsInput = {
    questionCount: readinessConfig?.maxQuestions ?? 75,
    topicNames: [],
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "random",
    pathwayId: trimmed,
  };

  const pool = await fetchCatPracticePool(userId, entitlement, poolInput);
  const v = validatePracticeCatPool(pool);
  if (!v.ok) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid,
      message: "Your readiness exam pool is still calibrating for this pathway. Keep practicing questions and lessons, then try again.",
    };
  }

  return { ok: true };
}
