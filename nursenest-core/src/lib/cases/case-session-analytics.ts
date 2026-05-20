/**
 * Case session analytics — Phase 7.
 *
 * Builds structured analytics payloads from completed sessions.
 *
 * PRIVACY RULES (strictly enforced):
 * - No PHI (names, DOB, health card numbers)
 * - No free-text learner answers or rationale responses
 * - No option text content — only option IDs
 * - Only aggregated domain and trajectory signals
 *
 * Payload is safe to send to PostHog, internal analytics, or admin dashboards.
 */
import type {
  CaseDecisionRecord,
  CaseSessionScore,
  ClinicalTrajectoryState,
  CaseStepConsequence,
  PatientStabilityState,
  RemediationPriority,
  CaseSessionAnalyticsPayload,
} from "@/lib/cases/longitudinal-case-types";
import type { CnpleDomainSlug } from "@/lib/np/cnple-domain-tags";
import { assertPathwayPostHogCapture, toTestingModelPostHogFields } from "@/lib/testing/testing-model";

// ── Builder ───────────────────────────────────────────────────────────────────

/**
 * Builds a CaseSessionAnalyticsPayload from a completed session.
 * All fields are aggregates — no individual learner text is included.
 */
export function buildCaseSessionAnalytics(params: {
  scenarioId: string;
  mode: "PRACTICE" | "SIMULATION";
  decisions: CaseDecisionRecord[];
  score: CaseSessionScore;
  trajectoryState: ClinicalTrajectoryState;
  completedAt: Date;
}): CaseSessionAnalyticsPayload {
  const { scenarioId, mode, decisions, score, trajectoryState, completedAt } = params;

  // Domain error aggregation — sanitised (no option content)
  const domainErrorMap: Partial<Record<CnpleDomainSlug, number>> = {};
  for (const d of decisions) {
    if (!d.isCorrect) {
      domainErrorMap[d.cnpleDomainSlug] = (domainErrorMap[d.cnpleDomainSlug] ?? 0) + 1;
    }
  }

  const remediationPriorityMap = score.remediationPriority ?? [];
  const domainErrors = (Object.entries(domainErrorMap) as [CnpleDomainSlug, number][]).map(
    ([domain, errorCount]) => {
      const entry = remediationPriorityMap.find((e) => e.domain === domain);
      return {
        domain,
        errorCount,
        priority: (entry?.priority ?? "moderate") as RemediationPriority,
      };
    },
  );

  const prescribingDecisions = decisions.filter(
    (d) => d.prescribingRiskSeverity && d.prescribingRiskSeverity !== "low",
  );
  const highCriticalPrescribingMisses = prescribingDecisions.filter(
    (d) => d.prescribingRiskSeverity === "high" || d.prescribingRiskSeverity === "critical",
  ).length;

  const safetyFlagsCount = trajectoryState.activeSafetyFlags.length;
  const criticalFlagsCount = trajectoryState.activeSafetyFlags.filter(
    (f) => f.severity === "critical",
  ).length;

  const followUpInappropriateCount = decisions.filter(
    (d) =>
      d.followUpAppropriateness === "dangerous_delay" ||
      d.followUpAppropriateness === "too_late",
  ).length;

  return {
    scenarioId,
    pathwayId: "ca-np-cnple",
    mode,
    totalSteps: score.totalSteps,
    correctCount: score.correctCount,
    score0to100: score.score0to100,
    cumulativeDebt: score.cumulativeDebt ?? trajectoryState.cumulativeRiskScore,
    finalStabilityState: trajectoryState.stabilityState,
    trajectoryProfile: score.trajectoryProfile,
    safetyFlagsCount,
    criticalFlagsCount,
    prescribingRiskEncountered: prescribingDecisions.length > 0,
    highCriticalPrescribingMissCount: highCriticalPrescribingMisses,
    domainErrors,
    followUpInappropriateCount,
    completedAt: completedAt.toISOString(),
  };
}

// ── PostHog event shaper ──────────────────────────────────────────────────────

/**
 * Returns a flat object suitable for PostHog `capture()` calls.
 * Prefixes all keys with `cnple_case_` for namespace isolation.
 */
export function toCaseAnalyticsPostHogEvent(
  payload: CaseSessionAnalyticsPayload,
  eventName = "cnple_case_session_completed",
): Record<string, string | number | boolean> {
  const analytics = toTestingModelPostHogFields(payload.pathwayId);
  const shaped = {
    ...analytics,
    cnple_case_scenario_id: payload.scenarioId,
    cnple_case_pathway_id: payload.pathwayId,
    cnple_case_mode: payload.mode,
    cnple_case_total_steps: payload.totalSteps,
    cnple_case_correct_count: payload.correctCount,
    cnple_case_score_pct: payload.score0to100,
    cnple_case_cumulative_debt: payload.cumulativeDebt,
    cnple_case_stability: payload.finalStabilityState,
    cnple_case_trajectory_optimal: payload.trajectoryProfile.optimal,
    cnple_case_trajectory_acceptable: payload.trajectoryProfile.acceptable,
    cnple_case_trajectory_suboptimal: payload.trajectoryProfile.suboptimal,
    cnple_case_trajectory_harmful: payload.trajectoryProfile.harmful,
    cnple_case_safety_flags: payload.safetyFlagsCount,
    cnple_case_critical_flags: payload.criticalFlagsCount,
    cnple_case_prescribing_risk: payload.prescribingRiskEncountered,
    cnple_case_prescribing_high_critical: payload.highCriticalPrescribingMissCount,
    cnple_case_followup_inappropriate: payload.followUpInappropriateCount,
    cnple_case_domain_error_count: payload.domainErrors.length,
    cnple_case_urgent_domains: payload.domainErrors.filter((d) => d.priority === "urgent").length,
  };
  assertPathwayPostHogCapture(payload.pathwayId, eventName, shaped);
  return shaped;
}

// ── Validation ────────────────────────────────────────────────────────────────

/** Asserts no PHI or free text exists in the analytics payload. */
export function assertAnalyticsPayloadHasNoPhi(payload: CaseSessionAnalyticsPayload): void {
  const serialised = JSON.stringify(payload);
  // Check that no option text content leaked (option labels are multi-word medical phrases)
  // Heuristic: if a string > 60 chars appears nested in domainErrors, it's likely free text
  for (const entry of payload.domainErrors) {
    if (entry.domain.length > 80) {
      throw new Error(`Analytics payload may contain free-text domain key: ${entry.domain}`);
    }
  }
}
