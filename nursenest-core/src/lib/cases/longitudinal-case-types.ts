/**
 * Longitudinal clinical case types for the CNPLE premium case engine.
 *
 * These types describe the *static* case content authored for the system.
 * Runtime session state is tracked in LongitudinalCaseSession (Prisma).
 *
 * CNPLE-aligned practice: not official CNPLE content. Does not represent
 * confirmed CNPLE blueprint structure.
 */
import type { CnpleDomainSlug } from "@/lib/np/cnple-domain-tags";

// ── Case anatomy ───────────────────────────────────────────────────────────────

/** Demographic and contextual info shown persistently in the patient summary panel. */
export type PatientCase = {
  /** Stable case identifier — matches ClinicalNursingScenario.id or a static slug. */
  id: string;
  title: string;
  /**
   * Short eyebrow label for the case card (e.g. "Hypertension · Chronic Disease").
   * Derived from primaryDomain if not supplied.
   */
  tagline?: string;
  patient: {
    age: number | string;
    sex: string;
    pronouns?: string;
    /** Clinical setting: "Primary Care", "Walk-In Clinic", "Emergency", etc. */
    setting: string;
  };
  chiefComplaint: string;
  pmhx: string[];
  medications: MedicationChange[];
  allergies: Array<{ substance: string; reaction?: string; severity?: "mild" | "moderate" | "severe" }>;
  /** CNPLE study domain this case primarily covers. */
  primaryDomain: CnpleDomainSlug;
  /** Additional domains covered by this case's steps. */
  secondaryDomains: CnpleDomainSlug[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Number of stages/steps. */
  stepCount: number;
  /** Estimated minutes to complete. */
  estimatedMinutes: number;
  isPremium: boolean;
  steps: CaseStep[];
};

/** One step in the longitudinal case. Corresponds to a ClinicalNursingScenarioStage row. */
export type CaseStep = {
  /** Stable step index (0-based). */
  index: number;
  /** Short heading shown in the timeline. */
  heading: string;
  /**
   * How this step arrives — narrative context for what has changed since the
   * previous step (e.g. "2 weeks later, the patient returns with...").
   */
  updateNarrative?: string;
  /** The evolving clinical scenario text for this step. */
  scenarioText: string;
  /** How the clinical picture has changed (worsening, stable, improving, critical). */
  clinicalUpdate: ClinicalUpdate;
  /** Vitals at this step. */
  vitals: VitalReading[];
  /** New or updated lab/diagnostic results arriving at this step. */
  diagnosticArtifacts: DiagnosticArtifact[];
  /** Medication changes at this step (new prescriptions, adjustments, discontinuations). */
  medicationChanges: MedicationChange[];
  /** Follow-up interval since the last step. Null for the first step. */
  followUpInterval: FollowUpInterval | null;
  /** The clinical judgment question for this step. */
  question: CaseStepQuestion;
  /** CNPLE domain tag for performance tracking. */
  cnpleDomain: CnpleDomainSlug;
};

/** Clinical trajectory signal for the step. */
export type ClinicalUpdate = {
  direction: "improving" | "stable" | "worsening" | "critical";
  summary: string;
  /** Specific new symptoms or findings of note. */
  newFindings?: string[];
};

/** Lab result, imaging, ECG, or other diagnostic arriving at this step. */
export type DiagnosticArtifact = {
  type: "lab_panel" | "ecg" | "imaging" | "spirometry" | "biopsy" | "other";
  name: string;
  /** Key finding / interpretation. */
  finding: string;
  impression?: string;
  timestamp?: string;
  /** Ordered values for lab panels. */
  values?: Array<{
    test: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    flag?: "H" | "L" | "C";
  }>;
};

/** Single vital sign reading. */
export type VitalReading = {
  label: string;
  value: string;
  unit?: string;
  flag?: "high" | "low" | "critical";
};

/** A medication entry — used in both initial list and per-step changes. */
export type MedicationChange = {
  name: string;
  dose?: string;
  route?: string;
  frequency?: string;
  indication?: string;
  /** Change type — new prescription, dose adjustment, hold, or discontinuation. */
  flag?: "new" | "changed" | "discontinued" | "hold";
};

/** Time elapsed between visits or steps. */
export type FollowUpInterval = {
  value: number;
  unit: "hours" | "days" | "weeks" | "months";
  label: string;
};

/** Referral/escalation decision record. */
export type ReferralDecision = {
  referTo: string;
  urgency: "routine" | "urgent" | "emergent";
  rationale: string;
};

// ── Question model ─────────────────────────────────────────────────────────────

/** Clinical judgment question for one case step. */
export type CaseStepQuestion = {
  stem: string;
  /** One of the 10 CNPLE-aligned question families. */
  family:
    | "single-best-answer-clinical-judgment"
    | "case-based-diagnostic-reasoning"
    | "safe-prescribing-medication-management"
    | "lab-diagnostic-interpretation"
    | "lifespan-primary-care"
    | "acute-deterioration-urgent-referral"
    | "health-promotion-screening"
    | "professional-ethics-legal-scope"
    | "interprofessional-care-consultation"
    | "chronic-disease-management";
  options: CaseStepOption[];
  correctOptionId: string;
  rationale: string;
  /** Why each distractor is incorrect. Keyed by option id. */
  whyWrongByOptionId: Record<string, string>;
  /** Short clinical judgment focus note for the report card. */
  clinicalJudgmentFocus: string;
  /** What happens depending on which option the learner chose. Keyed by option id. */
  consequencesByOptionId: Record<string, CaseStepConsequence>;
};

export type CaseStepOption = {
  id: string;
  label: string;
};

export type CaseStepConsequence = {
  /** Patient trajectory signal for this choice. */
  trajectory: "optimal" | "acceptable" | "suboptimal" | "harmful";
  /** Narrative: what happens to the patient as a result of this choice. */
  outcome: string;
};

// ── Trajectory state ──────────────────────────────────────────────────────────

/**
 * Patient stability level derived from cumulative decisions.
 * Threaded through the session and updated after each step.
 */
export type PatientStabilityState = "improving" | "stable" | "deteriorating" | "critical";

/**
 * An active safety concern raised by a decision — e.g. a contraindicated drug
 * prescribed, a red-flag missed, or an unsafe dose chosen.
 */
export type ActiveSafetyFlag = {
  code: string;
  label: string;
  severity: "warning" | "critical";
  /** Step that raised this flag. */
  stepIndex: number;
  domain: CnpleDomainSlug;
};

/**
 * A clinical issue left unresolved by a suboptimal or harmful decision.
 * These propagate forward and may worsen later lab values or trajectories.
 */
export type UnresolvedClinicalIssue = {
  code: string;
  label: string;
  stepIndex: number;
  /** Whether this issue compounds if not addressed by the next step. */
  canWorsenLater: boolean;
};

/**
 * Cumulative trajectory state threaded through all decisions.
 * Computed by the trajectory engine — never authored statically.
 */
export type ClinicalTrajectoryState = {
  stabilityState: PatientStabilityState;
  /** 0–100. Accumulates from per-decision trajectory debt. */
  cumulativeRiskScore: number;
  unresolvedClinicalIssues: UnresolvedClinicalIssue[];
  activeSafetyFlags: ActiveSafetyFlag[];
};

// ── Follow-up intelligence ────────────────────────────────────────────────────

export type FollowUpAppropriateness =
  | "appropriate"
  | "too_early"
  | "too_late"
  | "dangerous_delay"
  | "excessive_escalation"
  | "not_applicable";

// ── Prescribing risk ──────────────────────────────────────────────────────────

export type PrescribingRiskSeverity = "low" | "moderate" | "high" | "critical";

// ── Remediation priority ──────────────────────────────────────────────────────

export type RemediationPriority = "urgent" | "high" | "moderate" | "low";

export type RemediationPriorityEntry = {
  domain: CnpleDomainSlug;
  priority: RemediationPriority;
  /** Number of errors in this domain. */
  errorCount: number;
  /** Whether this reflects a repeated unsafe pattern vs an isolated mistake. */
  isPattern: boolean;
  /** Prescribed risk severity if this domain involved prescribing. */
  prescribingRisk?: PrescribingRiskSeverity;
};

export type RemediationPriorityMap = RemediationPriorityEntry[];

// ── Session state ──────────────────────────────────────────────────────────────

/** One decision record stored in LongitudinalCaseSession.decisionsJson. */
export type CaseDecisionRecord = {
  stepIndex: number;
  chosenOptionId: string;
  isCorrect: boolean;
  cnpleDomainSlug: CnpleDomainSlug;
  trajectory: CaseStepConsequence["trajectory"];
  dwellMs?: number;
  /** Debt units contributed by this decision (0–50). New field — optional. */
  trajectorySeverity?: number;
  /** Prescribing risk severity if this step was prescribing-family. Optional. */
  prescribingRiskSeverity?: PrescribingRiskSeverity;
  /** Follow-up appropriateness for this step. Optional. */
  followUpAppropriateness?: FollowUpAppropriateness;
  /** Safety flag codes raised by this decision. Optional. */
  safetyFlagsTriggered?: string[];
};

/** Computed score stored in LongitudinalCaseSession.scoreJson on completion. */
export type CaseSessionScore = {
  totalSteps: number;
  correctCount: number;
  score0to100: number;
  trajectoryProfile: Record<CaseStepConsequence["trajectory"], number>;
  weakDomains: CnpleDomainSlug[];
  strongDomains: CnpleDomainSlug[];
  recommendations: string[];
  /** Final trajectory state after all decisions. Optional — added in Phase 8. */
  finalTrajectoryState?: ClinicalTrajectoryState;
  /** Confidence-weighted remediation priorities. Optional — added in Phase 8. */
  remediationPriority?: RemediationPriorityMap;
  /** Cumulative clinical debt (0–100). Optional — added in Phase 8. */
  cumulativeDebt?: number;
  /** Structured analytics payload for telemetry. Optional — added in Phase 8. */
  analyticsPayload?: CaseSessionAnalyticsPayload;
};

/** Structured analytics payload — no PHI, no free-text learner answers. */
export type CaseSessionAnalyticsPayload = {
  scenarioId: string;
  pathwayId: "ca-np-cnple";
  mode: "PRACTICE" | "SIMULATION";
  totalSteps: number;
  correctCount: number;
  score0to100: number;
  cumulativeDebt: number;
  finalStabilityState: PatientStabilityState;
  trajectoryProfile: Record<CaseStepConsequence["trajectory"], number>;
  safetyFlagsCount: number;
  criticalFlagsCount: number;
  prescribingRiskEncountered: boolean;
  highCriticalPrescribingMissCount: number;
  domainErrors: Array<{ domain: CnpleDomainSlug; errorCount: number; priority: RemediationPriority }>;
  followUpInappropriateCount: number;
  completedAt: string;
};

/** Public payload returned by the session API for the current step. */
export type CaseStepPayload = {
  sessionId: string;
  scenarioId: string;
  stepIndex: number;
  totalSteps: number;
  /** In SIMULATION mode, rationale is withheld until completion. */
  mode: "PRACTICE" | "SIMULATION";
  step: Omit<CaseStep, "question"> & {
    question: Omit<CaseStepQuestion, "rationale" | "whyWrongByOptionId" | "consequencesByOptionId" | "correctOptionId">;
  };
  isLastStep: boolean;
  /** Current trajectory state (computed from prior decisions). */
  trajectoryState?: ClinicalTrajectoryState;
};

/** Payload returned after the learner advances a step. */
export type CaseStepAdvanceResult = {
  sessionId: string;
  isCorrect: boolean;
  trajectory: CaseStepConsequence["trajectory"];
  consequence: string;
  /** In PRACTICE mode: show rationale immediately. In SIMULATION mode: withheld. */
  rationale: string | null;
  whyWrong: string | null;
  correctOptionId: string | null;
  nextStep: CaseStepPayload | null;
  completed: boolean;
  score: CaseSessionScore | null;
  /** Updated trajectory state after this decision. */
  trajectoryState?: ClinicalTrajectoryState;
  /** Follow-up appropriateness for this step. */
  followUpAppropriateness?: FollowUpAppropriateness;
};
