import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildGlobalExamContext, examContextAnalyticsProps } from "@/lib/exam-context";
import { skipLearnerBusinessAnalyticsForAccessScope } from "@/lib/observability/admin-learner-qa-analytics";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { CAT_RESULTS_COACH_FALLBACK_HEADLINE } from "@/lib/practice-tests/cat-results-coach";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

/**
 * PostHog capture enriched with entitlement context. **Do not await** in API routes so responses stay fast;
 * best-effort delivery (same pattern as fire-and-forget logging).
 */
export function captureLearnerProductEvent(
  userId: string,
  entitlement: AccessScope,
  event: string,
  props: Record<string, string | number | boolean | undefined> = {},
): void {
  if (skipLearnerBusinessAnalyticsForAccessScope(entitlement)) return;
  void captureServerEvent(analyticsDistinctId(userId), event, {
    actor: "authenticated",
    ...props,
    country: entitlement.country ?? undefined,
    tier: entitlement.tier ?? undefined,
  });
}

function readinessFromResults(results: unknown): string | undefined {
  if (!results || typeof results !== "object") return undefined;
  const r = results as PracticeTestResultsJson;
  const label = r.readinessLabel;
  return typeof label === "string" && label.trim().length > 0 ? label.trim() : undefined;
}

export function capturePracticeTestCompletedAnalytics(
  userId: string,
  entitlement: AccessScope,
  cfg: PracticeTestConfigJson,
  results: unknown,
): void {
  try {
    const res = results as PracticeTestResultsJson;
    const sel = cfg?.selectionMode ?? "unknown";
    const cat = sel === "cat";
    const examSim = cfg?.catPresentationMode === "exam_simulation";
    const readiness = readinessFromResults(results);

    const catFeedback = cfg?.selectionMode === "cat" ? (cfg.catExamFeedbackMode ?? "test") : undefined;
    const coach = res?.catCoach;
    const patternCodes =
      Array.isArray(coach?.errorPatterns) && cat
        ? coach.errorPatterns
            .map((p) => (p && typeof p === "object" && "code" in p ? String((p as { code?: string }).code ?? "") : ""))
            .filter(Boolean)
            .join(",")
        : undefined;

    const examCtx = buildGlobalExamContext(cfg?.pathwayId ?? null, "en");

    captureLearnerProductEvent(userId, entitlement, PH.learnerPracticeTestSessionCompleted, {
      selection_mode: String(sel),
      cat_mode: cat,
      exam_simulation: examSim,
      cat_exam_feedback_mode: catFeedback,
      pathway_id: cfg?.pathwayId ?? undefined,
      ...examContextAnalyticsProps(examCtx),
      score_total: typeof res?.scoreTotal === "number" ? res.scoreTotal : undefined,
      score_correct: typeof res?.scoreCorrect === "number" ? res.scoreCorrect : undefined,
      accuracy_pct: typeof res?.accuracyPct === "number" ? res.accuracyPct : undefined,
      readiness_label: readiness,
      pass_outlook_pct:
        coach != null && typeof coach.passOutlookPercent === "number" ? coach.passOutlookPercent : undefined,
      cat_coach_present: coach != null,
      cat_confidence_level:
        coach?.confidenceLevel === "low" || coach?.confidenceLevel === "medium" || coach?.confidenceLevel === "high"
          ? coach.confidenceLevel
          : undefined,
      coach_reliability_level:
        coach?.reliabilityLevel === "low" || coach?.reliabilityLevel === "medium" || coach?.reliabilityLevel === "high"
          ? coach.reliabilityLevel
          : undefined,
      cat_pattern_codes: patternCodes || undefined,
    });

    if (readiness) {
      captureLearnerProductEvent(userId, entitlement, PH.learnerReadinessScoreReached, {
        readiness_label: readiness,
        selection_mode: String(sel),
        exam_simulation: examSim,
        cat_exam_feedback_mode: catFeedback,
        pathway_id: cfg?.pathwayId ?? undefined,
        ...examContextAnalyticsProps(examCtx),
      });
    }
  } catch {
    /* Analytics must never block completion or server responses. */
  }
}

export function captureCatCoachGenerationAnalytics(
  userId: string,
  entitlement: AccessScope,
  cfg: PracticeTestConfigJson,
  results: unknown,
): void {
  try {
    const res = results as PracticeTestResultsJson;
    const coach = res?.catCoach;
    const examCtx = buildGlobalExamContext(cfg?.pathwayId ?? null, "en");
    const success =
      coach != null &&
      coach.readinessHeadline !== CAT_RESULTS_COACH_FALLBACK_HEADLINE &&
      typeof coach.generatedAt === "string" &&
      coach.generatedAt.length > 4;

    captureLearnerProductEvent(userId, entitlement, PH.learnerCatCoachGenerated, {
      selection_mode: String(cfg?.selectionMode ?? "unknown"),
      cat_exam_feedback_mode: cfg?.selectionMode === "cat" ? (cfg.catExamFeedbackMode ?? "test") : undefined,
      pathway_id: cfg?.pathwayId ?? undefined,
      success,
      coach_reliability_level:
        coach?.reliabilityLevel === "low" || coach?.reliabilityLevel === "medium" || coach?.reliabilityLevel === "high"
          ? coach.reliabilityLevel
          : undefined,
      cat_confidence_level:
        coach?.confidenceLevel === "low" || coach?.confidenceLevel === "medium" || coach?.confidenceLevel === "high"
          ? coach.confidenceLevel
          : undefined,
      ...examContextAnalyticsProps(examCtx),
    });
  } catch {
    /* Analytics must never block completion or server responses. */
  }
}
