export type CoachingTelemetryEvent =
  | "coaching_report_generated"
  | "remediation_cta_clicked"
  | "recommendation_rotated"
  | "readiness_reliability_assessed"
  | "semantic_integrity_violation"
  | "learner_state_updated"
  | "study_plan_block_completed"
  | "timing_insight_viewed"
  | "competency_stabilization_signal"
  | "remediation_fatigue_detected"
  | "recommendation_fatigue_detected"
  | "ai_tutor_envelope_built"
  | "remediation_drift_detected"
  | "competency_volatility_spike"
  | "cognition_context_resolved"
  | "dashboard_sequence_rendered"
  | "study_plan_generated"
  | "remediation_path_opened"
  | "timing_risk_detected"
  | "measurement_reasoning_path_opened"
  | "ai_tutoring_context_generated";

export function recordCoachingTelemetry(
  event: CoachingTelemetryEvent,
  props: Record<string, string | number | boolean | null>,
): void {
  try {
    if (typeof window === "undefined") return;
    const w = window as Window & {
      posthog?: { capture: (e: string, p: Record<string, unknown>) => void };
    };
    w.posthog?.capture(`rn_coaching_${event}`, props);
  } catch {
    /* analytics optional */
  }

  if (process.env.NODE_ENV === "development" && event === "semantic_integrity_violation") {
    console.warn("[rn-coaching]", event, props);
  }
}

export function recordTimingInsightEngagement(insightId: string): void {
  recordCoachingTelemetry("timing_insight_viewed", { insight_id: insightId });
}

export function recordRemediationAcceptance(exposureKey: string, href: string): void {
  recordCoachingTelemetry("remediation_cta_clicked", { exposure_key: exposureKey, href });
}

export function recordStudyPlanCompletion(blockKind: string): void {
  recordCoachingTelemetry("study_plan_block_completed", { block_kind: blockKind });
}
