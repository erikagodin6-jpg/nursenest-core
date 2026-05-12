/**
 * Clinical trajectory engine.
 *
 * Computes cumulative patient stability state from a sequence of decisions.
 * Supports delayed consequence propagation — a harmful decision at step 1
 * raises risk that compounds if later steps do not resolve the issue.
 *
 * Design: pure functions over CaseDecisionRecord[]. No side effects.
 */
import type {
  CaseDecisionRecord,
  ClinicalTrajectoryState,
  PatientStabilityState,
  ActiveSafetyFlag,
  UnresolvedClinicalIssue,
  CaseStepConsequence,
} from "@/lib/cases/longitudinal-case-types";
import type { CnpleDomainSlug } from "@/lib/np/cnple-domain-tags";

// ── Debt weights per trajectory ───────────────────────────────────────────────

/** Clinical debt added per decision trajectory. Compounds across steps. */
const TRAJECTORY_DEBT: Record<CaseStepConsequence["trajectory"], number> = {
  optimal: 0,
  acceptable: 8,
  suboptimal: 22,
  harmful: 48,
};

/** Extra debt multiplier when the same domain is wrong twice in a row. */
const REPEATED_DOMAIN_MULTIPLIER = 1.4;

// ── Safety flag inference ─────────────────────────────────────────────────────

const PRESCRIBING_FAMILIES = new Set([
  "safe-prescribing-medication-management",
  "lab-diagnostic-interpretation",
]);

const ACUTE_FAMILIES = new Set([
  "acute-deterioration-urgent-referral",
]);

/**
 * Infers safety flags from a single decision.
 * Returns flags only when the decision represents a clear safety concern.
 */
export function inferSafetyFlags(decision: CaseDecisionRecord): ActiveSafetyFlag[] {
  const flags: ActiveSafetyFlag[] = [];

  if (decision.trajectory === "harmful") {
    if (decision.safetyFlagsTriggered?.length) {
      for (const code of decision.safetyFlagsTriggered) {
        flags.push({
          code,
          label: safetyFlagLabel(code),
          severity: "critical",
          stepIndex: decision.stepIndex,
          domain: decision.cnpleDomainSlug,
        });
      }
    } else {
      // Generic harmful-decision safety flag
      flags.push({
        code: `harmful_decision_step_${decision.stepIndex}`,
        label: `Harmful clinical decision at step ${decision.stepIndex + 1}`,
        severity: "critical",
        stepIndex: decision.stepIndex,
        domain: decision.cnpleDomainSlug,
      });
    }
  }

  if (decision.trajectory === "suboptimal" && decision.prescribingRiskSeverity === "high") {
    flags.push({
      code: `prescribing_risk_step_${decision.stepIndex}`,
      label: `High prescribing risk at step ${decision.stepIndex + 1}`,
      severity: "warning",
      stepIndex: decision.stepIndex,
      domain: decision.cnpleDomainSlug,
    });
  }

  return flags;
}

function safetyFlagLabel(code: string): string {
  const labels: Record<string, string> = {
    contraindication_missed: "Contraindicated medication selected",
    renal_dose_error: "Renal dose adjustment not applied",
    dangerous_interaction: "Dangerous drug interaction not recognised",
    red_flag_missed: "Red-flag clinical finding not acted upon",
    escalation_delayed: "Urgent escalation delayed beyond safe threshold",
    duplicate_therapy: "Duplicate therapy combination initiated",
    pregnancy_unsafe: "Medication unsafe in pregnancy selected",
    anticoagulation_error: "Anticoagulation management error",
    pediatric_dose_error: "Paediatric weight-based dose error",
  };
  return labels[code] ?? `Safety concern: ${code}`;
}

// ── Unresolved issue inference ────────────────────────────────────────────────

/**
 * Infers unresolved clinical issues from a harmful or suboptimal decision.
 * These carry forward and may worsen later steps if not resolved.
 */
export function inferUnresolvedIssues(decision: CaseDecisionRecord): UnresolvedClinicalIssue[] {
  if (decision.trajectory === "optimal" || decision.trajectory === "acceptable") return [];

  const domainIssueMap: Partial<Record<CnpleDomainSlug, UnresolvedClinicalIssue>> = {
    "chronic-disease-management": {
      code: "uncontrolled_chronic_disease",
      label: "Chronic disease management suboptimal — disease control may worsen",
      stepIndex: decision.stepIndex,
      canWorsenLater: true,
    },
    "pharmacotherapeutics": {
      code: "prescribing_gap",
      label: "Prescribing decision left clinical gap — medication effect may be inadequate",
      stepIndex: decision.stepIndex,
      canWorsenLater: decision.trajectory === "harmful",
    },
    "diagnostics-labs": {
      code: "diagnostic_gap",
      label: "Diagnostic gap — key investigation deferred or misinterpreted",
      stepIndex: decision.stepIndex,
      canWorsenLater: true,
    },
    "acute-urgent-care": {
      code: "escalation_delayed",
      label: "Escalation delayed — patient at continued risk without urgent intervention",
      stepIndex: decision.stepIndex,
      canWorsenLater: decision.trajectory === "harmful",
    },
    "clinical-assessment": {
      code: "assessment_incomplete",
      label: "Assessment incomplete — clinical picture may be inaccurate",
      stepIndex: decision.stepIndex,
      canWorsenLater: true,
    },
  };

  const issue = domainIssueMap[decision.cnpleDomainSlug];
  return issue ? [issue] : [];
}

// ── Stability state derivation ────────────────────────────────────────────────

/**
 * Derives patient stability state from cumulative risk score and safety flags.
 * Thresholds are calibrated so a single harmful decision tips toward deteriorating.
 */
export function deriveStabilityState(
  cumulativeRisk: number,
  safetyFlags: ActiveSafetyFlag[],
): PatientStabilityState {
  const hasCriticalFlag = safetyFlags.some((f) => f.severity === "critical");

  if (hasCriticalFlag || cumulativeRisk >= 80) return "critical";
  if (cumulativeRisk >= 50) return "deteriorating";
  if (cumulativeRisk >= 20) return "stable";
  return "improving";
}

// ── Cumulative trajectory state builder ──────────────────────────────────────

/**
 * Computes the full ClinicalTrajectoryState from all decisions so far.
 *
 * Delayed consequence propagation: unresolved issues from earlier steps
 * add a compounding multiplier to later harmful/suboptimal decisions in
 * the same or related domain.
 */
export function computeTrajectoryState(decisions: CaseDecisionRecord[]): ClinicalTrajectoryState {
  let cumulativeRiskScore = 0;
  const allSafetyFlags: ActiveSafetyFlag[] = [];
  const allUnresolvedIssues: UnresolvedClinicalIssue[] = [];

  // Track last-seen domain to detect repeated errors
  const lastDomainDecision: Partial<Record<CnpleDomainSlug, CaseStepConsequence["trajectory"]>> = {};

  for (const decision of decisions) {
    // Base debt for this decision
    let debt = TRAJECTORY_DEBT[decision.trajectory];

    // Compounding: if the same domain had a prior suboptimal/harmful decision
    // and this one is also suboptimal/harmful, apply multiplier
    const prevTrajectory = lastDomainDecision[decision.cnpleDomainSlug];
    if (
      prevTrajectory &&
      (prevTrajectory === "suboptimal" || prevTrajectory === "harmful") &&
      (decision.trajectory === "suboptimal" || decision.trajectory === "harmful")
    ) {
      debt = Math.round(debt * REPEATED_DOMAIN_MULTIPLIER);
    }

    // Delayed consequence: prior unresolved issues in this domain amplify new debt
    const priorUnresolved = allUnresolvedIssues.filter(
      (i) => i.canWorsenLater && RELATED_DOMAINS.get(i.code)?.has(decision.cnpleDomainSlug),
    );
    if (priorUnresolved.length > 0 && decision.trajectory !== "optimal") {
      debt = Math.min(48, debt + priorUnresolved.length * 5);
    }

    cumulativeRiskScore = Math.min(100, cumulativeRiskScore + debt);

    // Resolve issues when the decision is optimal (implies patient issue corrected)
    if (decision.trajectory === "optimal") {
      const resolvedDomains = RESOLUTION_DOMAINS_FOR[decision.cnpleDomainSlug] ?? new Set([decision.cnpleDomainSlug]);
      const stillUnresolved = allUnresolvedIssues.filter(
        (i) => !resolvedDomains.has(i.code),
      );
      allUnresolvedIssues.length = 0;
      allUnresolvedIssues.push(...stillUnresolved);
    } else {
      allUnresolvedIssues.push(...inferUnresolvedIssues(decision));
    }

    allSafetyFlags.push(...inferSafetyFlags(decision));
    lastDomainDecision[decision.cnpleDomainSlug] = decision.trajectory;
  }

  const stabilityState = deriveStabilityState(cumulativeRiskScore, allSafetyFlags);

  return {
    stabilityState,
    cumulativeRiskScore,
    unresolvedClinicalIssues: allUnresolvedIssues,
    activeSafetyFlags: allSafetyFlags,
  };
}

// ── Domain relationship maps ──────────────────────────────────────────────────

/**
 * Maps unresolved issue codes to domains they affect when propagating forward.
 * Used for delayed consequence amplification.
 */
const RELATED_DOMAINS = new Map<string, Set<CnpleDomainSlug>>([
  ["uncontrolled_chronic_disease", new Set(["chronic-disease-management", "diagnostics-labs", "pharmacotherapeutics"])],
  ["prescribing_gap", new Set(["pharmacotherapeutics", "chronic-disease-management", "diagnostics-labs"])],
  ["diagnostic_gap", new Set(["diagnostics-labs", "diagnosis-differential", "acute-urgent-care"])],
  ["escalation_delayed", new Set(["acute-urgent-care", "clinical-assessment"])],
  ["assessment_incomplete", new Set(["clinical-assessment", "diagnosis-differential"])],
]);

/**
 * When a decision is optimal in a given domain, which issue codes does it resolve?
 */
const RESOLUTION_DOMAINS_FOR: Partial<Record<CnpleDomainSlug, Set<string>>> = {
  "chronic-disease-management": new Set(["uncontrolled_chronic_disease", "prescribing_gap"]),
  "pharmacotherapeutics": new Set(["prescribing_gap"]),
  "diagnostics-labs": new Set(["diagnostic_gap"]),
  "acute-urgent-care": new Set(["escalation_delayed"]),
  "clinical-assessment": new Set(["assessment_incomplete"]),
};

// ── Per-step debt accessor ────────────────────────────────────────────────────

/** Returns the debt units contributed by a single trajectory. */
export function trajectoryDebt(trajectory: CaseStepConsequence["trajectory"]): number {
  return TRAJECTORY_DEBT[trajectory];
}
