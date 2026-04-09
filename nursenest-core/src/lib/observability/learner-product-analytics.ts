import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildGlobalExamContext, examContextAnalyticsProps } from "@/lib/exam-context";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { PH } from "@/lib/observability/posthog-conversion-events";
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
  const res = results as PracticeTestResultsJson;
  const sel = cfg.selectionMode ?? "unknown";
  const cat = sel === "cat";
  const examSim = cfg.catPresentationMode === "exam_simulation";
  const readiness = readinessFromResults(results);

  const catFeedback = cfg.selectionMode === "cat" ? (cfg.catExamFeedbackMode ?? "test") : undefined;
  const coach = res.catCoach;
  const patternCodes =
    coach?.errorPatterns?.length && cat
      ? coach.errorPatterns
          .map((p) => p.code)
          .filter(Boolean)
          .join(",")
      : undefined;

  const examCtx = buildGlobalExamContext(cfg.pathwayId ?? null, "en");

  captureLearnerProductEvent(userId, entitlement, PH.learnerPracticeTestSessionCompleted, {
    selection_mode: String(sel),
    cat_mode: cat,
    exam_simulation: examSim,
    cat_exam_feedback_mode: catFeedback,
    pathway_id: cfg.pathwayId ?? undefined,
    ...examContextAnalyticsProps(examCtx),
    score_total: res.scoreTotal,
    score_correct: res.scoreCorrect,
    accuracy_pct: res.accuracyPct,
    readiness_label: readiness,
    pass_outlook_pct: coach != null ? coach.passOutlookPercent : undefined,
    cat_coach_present: coach != null,
    cat_confidence_level: coach?.confidenceLevel,
    cat_pattern_codes: patternCodes,
  });

  if (readiness) {
    captureLearnerProductEvent(userId, entitlement, PH.learnerReadinessScoreReached, {
      readiness_label: readiness,
      selection_mode: String(sel),
      exam_simulation: examSim,
      cat_exam_feedback_mode: catFeedback,
      pathway_id: cfg.pathwayId ?? undefined,
      ...examContextAnalyticsProps(examCtx),
    });
  }
}
