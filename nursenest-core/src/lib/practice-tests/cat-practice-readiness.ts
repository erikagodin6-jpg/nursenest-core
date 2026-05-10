import { validatePracticeCatPool } from "@/lib/exams/cat-engine";
import {
  pathwayAllowsCatAdaptiveStart,
  subscriptionCoversPathwayBase,
} from "@/lib/exam-pathways/pathway-entitlements-policy";
import { readinessConfigForPathwayId } from "@/lib/exam-pathways/pathway-readiness-config";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { catReadinessMinCompletePoolRows, fetchCatPracticePoolReadiness } from "@/lib/practice-tests/cat-pool";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import type { PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";

export type CatPracticeReadinessResult =
  | {
      ok: true;
      availableQuestions: number;
      requiredQuestions: number;
      eligibleCatQuestions: number;
      completePracticeQuestions: number;
      excludedBecauseMissingCatMetadata: number;
      excludedBecauseIncomplete: number;
      excludedBecauseWrongPathwayOrExam: number;
    }
  | {
      ok: false;
      code: string;
      message: string;
      availableQuestions?: number;
      requiredQuestions?: number;
      eligibleCatQuestions?: number;
      completePracticeQuestions?: number;
      excludedBecauseMissingCatMetadata?: number;
      excludedBecauseIncomplete?: number;
      excludedBecauseWrongPathwayOrExam?: number;
    };

function catReadinessDiagnosticsFromMeta(buildMeta: Awaited<ReturnType<typeof fetchCatPracticePoolReadiness>>["buildMeta"]) {
  return {
    eligibleCatQuestions: buildMeta.eligibleCatQuestions ?? buildMeta.finalCompleteRowCount,
    completePracticeQuestions: buildMeta.completePracticeQuestions ?? buildMeta.strictCompleteRowCount,
    excludedBecauseMissingCatMetadata: buildMeta.excludedBecauseMissingCatMetadata ?? 0,
    excludedBecauseIncomplete: buildMeta.excludedBecauseIncomplete ?? 0,
    excludedBecauseWrongPathwayOrExam: buildMeta.excludedBecauseWrongPathwayOrExam ?? 0,
  };
}

export function catReadinessUnavailableMessage(diagnostics: {
  eligibleCatQuestions: number;
  completePracticeQuestions: number;
  publishedQuestions?: number;
}, minPool: number): string {
  if (
    typeof diagnostics.publishedQuestions === "number" &&
    diagnostics.publishedQuestions > diagnostics.eligibleCatQuestions
  ) {
    return `${diagnostics.publishedQuestions} published questions found, but only ${diagnostics.eligibleCatQuestions} currently meet CAT readiness requirements (${minPool} required). Practice mode may still be available while CAT calibration is completed.`;
  }

  if (diagnostics.completePracticeQuestions > 0) {
    return `CAT requires calibrated questions. Practice questions are available, but CAT-ready calibrated questions are ${diagnostics.eligibleCatQuestions} / ${minPool}.`;
  }

  return `Adaptive exam not available yet for this pathway. We currently have ${diagnostics.completePracticeQuestions} complete practice questions; at least ${minPool} CAT-ready calibrated questions are required.`;
}

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

  const minPool = catReadinessMinCompletePoolRows(trimmed);

  const readinessConfig = await readinessConfigForPathwayId(trimmed);
  const poolInput: PickQuestionsInput = {
    questionCount: readinessConfig?.maxQuestions ?? 75,
    topicNames: [],
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "random",
    pathwayId: trimmed,
  };

  const { pool, buildMeta } = await fetchCatPracticePoolReadiness(userId, entitlement, poolInput);
  const diagnostics = catReadinessDiagnosticsFromMeta(buildMeta);
  if (pool.length < minPool) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid,
      message: catReadinessUnavailableMessage(diagnostics, minPool),
      availableQuestions: diagnostics.eligibleCatQuestions,
      requiredQuestions: minPool,
      ...diagnostics,
    };
  }

  const v = validatePracticeCatPool(pool);
  if (!v.ok) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid,
      message: catReadinessUnavailableMessage(diagnostics, minPool),
      availableQuestions: diagnostics.eligibleCatQuestions,
      requiredQuestions: minPool,
      ...diagnostics,
    };
  }

  return {
    ok: true,
    availableQuestions: diagnostics.eligibleCatQuestions,
    requiredQuestions: minPool,
    ...diagnostics,
  };
}
