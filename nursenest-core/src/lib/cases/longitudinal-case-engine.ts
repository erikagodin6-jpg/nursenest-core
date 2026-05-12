/**
 * Longitudinal case session engine (v1.1).
 *
 * Integrates:
 * - Clinical trajectory state (cumulative debt, stability, safety flags)
 * - Prescribing safety classification
 * - Follow-up appropriateness scoring
 * - Confidence-weighted domain remediation
 * - Structured analytics payload
 *
 * All exports remain backwards-compatible with v1.0 callers.
 */
import type {
  PatientCase,
  CaseStep,
  CaseDecisionRecord,
  CaseSessionScore,
  CaseStepPayload,
  CaseStepAdvanceResult,
  CaseStepConsequence,
  ClinicalTrajectoryState,
  FollowUpAppropriateness,
} from "@/lib/cases/longitudinal-case-types";
import type { CnpleDomainSlug } from "@/lib/np/cnple-domain-tags";
import { computeTrajectoryState, trajectoryDebt } from "@/lib/cases/clinical-trajectory-engine";
import {
  classifyPrescribingRiskSeverity,
  buildPrescribingRiskProfile,
  applyPrescribingPenaltyToReadiness,
} from "@/lib/cnple/prescribing-safety-engine";
import {
  assessFollowUpAppropriateness,
  followUpPenaltyDebt,
  inferClinicalUrgency,
} from "@/lib/cases/follow-up-intelligence";
import {
  buildRemediationPriorityMap,
  deriveWeakAndStrongDomains,
  buildTargetedRecommendations,
} from "@/lib/cases/domain-remediation-engine";
import {
  buildCaseSessionAnalytics,
} from "@/lib/cases/case-session-analytics";
import { computeEvolvedStepState } from "@/lib/cases/longitudinal-state-mutation";

// ── Step payload builder ───────────────────────────────────────────────────────

/**
 * Serialises a CaseStep into the public payload sent to the client.
 * Includes current trajectory state (computed from prior decisions).
 * Withholds answer, rationale, and consequences in both modes.
 */
export function buildStepPayload(
  sessionId: string,
  patientCase: PatientCase,
  stepIndex: number,
  mode: "PRACTICE" | "SIMULATION",
  priorDecisions: CaseDecisionRecord[] = [],
): CaseStepPayload {
  const step = patientCase.steps[stepIndex];
  if (!step) throw new Error(`Step ${stepIndex} not found in case ${patientCase.id}`);

  const { rationale: _r, whyWrongByOptionId: _w, consequencesByOptionId: _c, correctOptionId: _o, ...questionPublic } = step.question;

  const trajectoryState = priorDecisions.length > 0
    ? computeTrajectoryState(priorDecisions)
    : undefined;

  const evolvedState = priorDecisions.length > 0
    ? computeEvolvedStepState(patientCase, priorDecisions, stepIndex)
    : undefined;

  return {
    sessionId,
    scenarioId: patientCase.id,
    stepIndex,
    totalSteps: patientCase.steps.length,
    mode,
    step: { ...step, question: questionPublic },
    isLastStep: stepIndex === patientCase.steps.length - 1,
    trajectoryState,
    evolvedState,
  };
}

// ── Advance step processor ────────────────────────────────────────────────────

/**
 * Processes a learner's choice for a step.
 * Enriches the decision with trajectory severity, prescribing risk,
 * and follow-up appropriateness before computing the result.
 */
export function processStepAdvance(
  sessionId: string,
  patientCase: PatientCase,
  stepIndex: number,
  chosenOptionId: string,
  mode: "PRACTICE" | "SIMULATION",
  existingDecisions: CaseDecisionRecord[],
  dwellMs?: number,
): CaseStepAdvanceResult {
  const step = patientCase.steps[stepIndex];
  if (!step) throw new Error(`Step ${stepIndex} out of bounds for case ${patientCase.id}`);

  const { question } = step;
  const isCorrect = chosenOptionId === question.correctOptionId;
  const consequence = question.consequencesByOptionId[chosenOptionId];
  const trajectory: CaseStepConsequence["trajectory"] = consequence?.trajectory ?? "suboptimal";
  const consequenceText = consequence?.outcome ?? "";

  // Classify prescribing risk from question family + trajectory
  const prescribingRiskSeverity = classifyPrescribingRiskSeverity(question.family, trajectory) ?? undefined;

  // Assess follow-up appropriateness
  const urgency = inferClinicalUrgency(step.clinicalUpdate.direction, step.cnpleDomain);
  const followUpAppropriateness: FollowUpAppropriateness =
    assessFollowUpAppropriateness(step.followUpInterval, urgency);

  // Build enriched decision record
  const newDecision: CaseDecisionRecord = {
    stepIndex,
    chosenOptionId,
    isCorrect,
    cnpleDomainSlug: step.cnpleDomain,
    trajectory,
    dwellMs,
    trajectorySeverity: trajectoryDebt(trajectory),
    prescribingRiskSeverity,
    followUpAppropriateness,
  };
  const allDecisions = [...existingDecisions, newDecision];

  const isLastStep = stepIndex === patientCase.steps.length - 1;
  const nextStepIndex = stepIndex + 1;

  // Compute trajectory state after this decision
  const trajectoryState = computeTrajectoryState(allDecisions);

  const score = isLastStep ? computeScore(patientCase, allDecisions, trajectoryState) : null;

  return {
    sessionId,
    isCorrect,
    trajectory,
    consequence: consequenceText,
    rationale: mode === "PRACTICE" ? question.rationale : null,
    whyWrong: mode === "PRACTICE" && !isCorrect ? (question.whyWrongByOptionId[chosenOptionId] ?? null) : null,
    correctOptionId: mode === "PRACTICE" ? question.correctOptionId : null,
    nextStep:
      !isLastStep
        ? buildStepPayload(sessionId, patientCase, nextStepIndex, mode, allDecisions)
        : null,
    completed: isLastStep,
    score,
    trajectoryState,
    followUpAppropriateness,
  };
}

// ── Scoring ───────────────────────────────────────────────────────────────────

/**
 * Compute a full CaseSessionScore with enriched analytics.
 * Accepts an optional pre-computed trajectoryState to avoid recomputing.
 */
export function computeScore(
  patientCase: PatientCase,
  decisions: CaseDecisionRecord[],
  trajectoryState?: ClinicalTrajectoryState,
): CaseSessionScore {
  const totalSteps = patientCase.steps.length;
  const correctCount = decisions.filter((d) => d.isCorrect).length;

  // Trajectory breakdown
  const trajectoryProfile: Record<CaseStepConsequence["trajectory"], number> = {
    optimal: 0, acceptable: 0, suboptimal: 0, harmful: 0,
  };
  for (const d of decisions) {
    trajectoryProfile[d.trajectory] = (trajectoryProfile[d.trajectory] ?? 0) + 1;
  }

  // Base score from correctness
  let score0to100 = totalSteps > 0 ? Math.round((correctCount / totalSteps) * 100) : 0;

  // Prescribing risk penalty
  const prescribingProfile = buildPrescribingRiskProfile(decisions);
  score0to100 = applyPrescribingPenaltyToReadiness(score0to100, prescribingProfile);

  // Follow-up timing penalty
  const followUpDebt = decisions.reduce((sum, d) => {
    return sum + (d.followUpAppropriateness ? followUpPenaltyDebt(d.followUpAppropriateness) : 0);
  }, 0);
  score0to100 = Math.max(0, Math.round(score0to100 - followUpDebt / 10));

  // Confidence-weighted domain remediation
  const remediationPriority = buildRemediationPriorityMap(decisions);
  const { weakDomains, strongDomains } = deriveWeakAndStrongDomains(decisions, remediationPriority);

  // Targeted recommendations
  const recommendations = buildTargetedRecommendations(
    score0to100,
    remediationPriority,
    trajectoryProfile.harmful,
  );

  // Trajectory state (compute if not passed in)
  const finalTrajectoryState = trajectoryState ?? computeTrajectoryState(decisions);
  const cumulativeDebt = finalTrajectoryState.cumulativeRiskScore;

  // Analytics payload (no PHI)
  const analyticsPayload = buildCaseSessionAnalytics({
    scenarioId: patientCase.id,
    mode: "PRACTICE", // mode not available here; overridden by caller if needed
    decisions,
    score: {
      totalSteps,
      correctCount,
      score0to100,
      trajectoryProfile,
      weakDomains,
      strongDomains,
      recommendations,
      remediationPriority,
      cumulativeDebt,
    },
    trajectoryState: finalTrajectoryState,
    completedAt: new Date(),
  });

  return {
    totalSteps,
    correctCount,
    score0to100,
    trajectoryProfile,
    weakDomains,
    strongDomains,
    recommendations,
    finalTrajectoryState,
    remediationPriority,
    cumulativeDebt,
    analyticsPayload,
  };
}

// ── Decision serialisation ─────────────────────────────────────────────────────

/** Parse decisions JSON blob from the database. */
export function parseDecisionsJson(raw: unknown): CaseDecisionRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (d): d is CaseDecisionRecord =>
      typeof d === "object" &&
      d !== null &&
      typeof (d as CaseDecisionRecord).stepIndex === "number" &&
      typeof (d as CaseDecisionRecord).chosenOptionId === "string",
  );
}

/** Validate that a chosen option ID exists in the step's options. */
export function isValidOptionId(step: CaseStep, optionId: string): boolean {
  return step.question.options.some((o) => o.id === optionId);
}

// ── Readiness classification ──────────────────────────────────────────────────

export type CaseReadinessLevel = "not_ready" | "developing" | "approaching" | "ready";

export function classifyReadiness(score0to100: number): CaseReadinessLevel {
  if (score0to100 >= 80) return "ready";
  if (score0to100 >= 65) return "approaching";
  if (score0to100 >= 45) return "developing";
  return "not_ready";
}

// ── Remediation links ─────────────────────────────────────────────────────────

export type CaseDomainRemediationLinks = {
  domain: CnpleDomainSlug;
  lessonHref: string;
  flashcardsHref: string;
};

const DOMAIN_REMEDIATION_BASE = "/canada/np/cnple";

export function buildDomainRemediationLinks(domain: CnpleDomainSlug): CaseDomainRemediationLinks {
  return {
    domain,
    lessonHref: `${DOMAIN_REMEDIATION_BASE}/lessons?domain=${encodeURIComponent(domain)}`,
    flashcardsHref: `${DOMAIN_REMEDIATION_BASE}/flashcards?domain=${encodeURIComponent(domain)}`,
  };
}
