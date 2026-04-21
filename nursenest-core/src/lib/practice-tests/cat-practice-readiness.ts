import { validatePracticeCatPool } from "@/lib/exams/cat-engine";
import {
  pathwayAllowsCatAdaptiveStart,
  subscriptionCoversPathwayBase,
} from "@/lib/exam-pathways/pathway-entitlements-policy";
import { readinessConfigForPathwayId } from "@/lib/exam-pathways/pathway-readiness-config";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { CAT_MIN_COMPLETE_POOL, fetchCatPracticePool } from "@/lib/practice-tests/cat-pool";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import type { PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";

export type CatPracticeReadinessResult =
  | { ok: true; availableQuestions: number; requiredQuestions: number }
  | { ok: false; code: string; message: string; availableQuestions?: number; requiredQuestions?: number };

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

  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
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

  const readinessConfig = await readinessConfigForPathwayId(trimmed);
  const poolInput: PickQuestionsInput = {
    questionCount: readinessConfig?.maxQuestions ?? 75,
    topicNames: [],
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "random",
    pathwayId: trimmed,
  };

  const pool = await fetchCatPracticePool(userId, entitlement, poolInput);
  if (pool.length < CAT_MIN_COMPLETE_POOL) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid,
      message: `Adaptive exam not available yet for this pathway. We currently have ${pool.length} complete questions; at least ${CAT_MIN_COMPLETE_POOL} are required.`,
      availableQuestions: pool.length,
      requiredQuestions: CAT_MIN_COMPLETE_POOL,
    };
  }

  const v = validatePracticeCatPool(pool);
  if (!v.ok) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid,
      message: "Adaptive exam not available yet for this pathway. Keep practicing complete lessons and questions, then try again.",
      availableQuestions: pool.length,
      requiredQuestions: CAT_MIN_COMPLETE_POOL,
    };
  }

  return { ok: true, availableQuestions: pool.length, requiredQuestions: CAT_MIN_COMPLETE_POOL };
}
