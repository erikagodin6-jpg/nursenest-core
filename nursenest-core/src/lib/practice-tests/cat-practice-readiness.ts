import {
  buildCatCategoryDiversityDiagnostics,
  validatePracticeCatPool,
} from "@/lib/exams/cat-engine";
import {
  pathwayAllowsCatAdaptiveStart,
  subscriptionCoversPathwayBase,
} from "@/lib/exam-pathways/pathway-entitlements-policy";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { readinessConfigForPathwayId } from "@/lib/exam-pathways/pathway-readiness-config";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  catReadinessMinCompletePoolRows,
  fetchCatPracticePoolReadiness,
} from "@/lib/practice-tests/cat-pool";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";
import type { PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";

export type CatPracticeReadinessStaffDiagnostics = {
  publishedCount: number | null;
  practiceReadyCount: number;
  catReadyCount: number;
  validationFailureReason: string | null;
  categoryDiversityCounts: Record<string, number>;
};

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
      staffDiagnostics?: CatPracticeReadinessStaffDiagnostics;
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
      staffDiagnostics?: CatPracticeReadinessStaffDiagnostics;
    };

export function buildCatPracticeReadinessStaffDiagnostics(input: {
  publishedCount?: number | null;
  practiceReadyCount: number;
  catReadyCount: number;
  validation: ReturnType<typeof validatePracticeCatPool> | null;
  categoryDiversityCounts?: Record<string, number>;
}): CatPracticeReadinessStaffDiagnostics {
  return {
    publishedCount: input.publishedCount ?? null,
    practiceReadyCount: input.practiceReadyCount,
    catReadyCount: input.catReadyCount,
    validationFailureReason:
      input.validation && !input.validation.ok ? input.validation.error : null,
    categoryDiversityCounts:
      input.categoryDiversityCounts ??
      input.validation?.diagnostics?.finalCategoryKeys ??
      {},
  };
}

function catReadinessDiagnosticsFromMeta(
  buildMeta: Awaited<
    ReturnType<typeof fetchCatPracticePoolReadiness>
  >["buildMeta"],
) {
  return {
    eligibleCatQuestions:
      buildMeta.eligibleCatQuestions ?? buildMeta.finalCompleteRowCount,
    completePracticeQuestions:
      buildMeta.completePracticeQuestions ?? buildMeta.strictCompleteRowCount,
    excludedBecauseMissingCatMetadata:
      buildMeta.excludedBecauseMissingCatMetadata ?? 0,
    excludedBecauseIncomplete: buildMeta.excludedBecauseIncomplete ?? 0,
    excludedBecauseWrongPathwayOrExam:
      buildMeta.excludedBecauseWrongPathwayOrExam ?? 0,
  };
}

export function catReadinessUnavailableMessage(
  diagnostics: {
    eligibleCatQuestions: number;
    completePracticeQuestions: number;
    publishedQuestions?: number;
  },
  minPool: number,
): string {
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
  options: {
    includeStaffDiagnostics?: boolean;
    publishedCount?: number | null;
  } = {},
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
      message:
        "That exam pathway is not recognized. Refresh the page or pick another track.",
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

  const { pool, buildMeta } = await fetchCatPracticePoolReadiness(
    userId,
    entitlement,
    poolInput,
  );
  const diagnostics = catReadinessDiagnosticsFromMeta(buildMeta);
  const v = pool.length >= minPool ? validatePracticeCatPool(pool) : null;
  const staffDiagnostics = options.includeStaffDiagnostics
    ? buildCatPracticeReadinessStaffDiagnostics({
        publishedCount: options.publishedCount,
        practiceReadyCount: diagnostics.completePracticeQuestions,
        catReadyCount: diagnostics.eligibleCatQuestions,
        validation: v,
        categoryDiversityCounts:
          buildCatCategoryDiversityDiagnostics(pool).finalCategoryKeys,
      })
    : undefined;
  if (pool.length < minPool) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid,
      message: catReadinessUnavailableMessage(diagnostics, minPool),
      availableQuestions: diagnostics.eligibleCatQuestions,
      requiredQuestions: minPool,
      ...diagnostics,
      ...(staffDiagnostics ? { staffDiagnostics } : {}),
    };
  }

  if (v != null && !v.ok) {
    return {
      ok: false,
      code: PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid,
      message: catReadinessUnavailableMessage(diagnostics, minPool),
      availableQuestions: diagnostics.eligibleCatQuestions,
      requiredQuestions: minPool,
      ...diagnostics,
      ...(staffDiagnostics ? { staffDiagnostics } : {}),
    };
  }

  return {
    ok: true,
    availableQuestions: diagnostics.eligibleCatQuestions,
    requiredQuestions: minPool,
    ...diagnostics,
    ...(staffDiagnostics ? { staffDiagnostics } : {}),
  };
}
