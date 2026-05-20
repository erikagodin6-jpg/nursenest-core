/**
 * Future case engine contracts — Phase 8.
 *
 * Interface definitions for upcoming multi-case session formats.
 * These are TYPE-ONLY contracts; no implementation is shipped here.
 *
 * Formats prepared for:
 * - OSCE-style station assessment
 * - Multi-patient queue (triage simulation)
 * - Urgent interruption events (acute deterioration mid-case)
 * - Inbox/result follow-up (async diagnostic)
 * - Continuity clinic simulation (multiple scheduled visits)
 *
 * DO NOT implement full UX until each format is prioritised for a sprint.
 * These types exist to ensure the core engine stays forwards-compatible.
 */
import type { CnpleDomainSlug } from "@/lib/np/cnple-domain-tags";
import type { ClinicalTrajectoryState, CaseSessionAnalyticsPayload } from "@/lib/cases/longitudinal-case-types";

// ── OSCE station ──────────────────────────────────────────────────────────────

/**
 * OSCE-style station: time-limited, structured, examiner-observed (simulated).
 * Single-encounter, criterion-referenced — pass/fail per station.
 */
export interface OsceStationContract {
  stationId: string;
  title: string;
  /** Domain this station primarily assesses. */
  domain: CnpleDomainSlug;
  /** Duration in minutes. */
  timeLimitMinutes: number;
  /** Structured checklist items (observable actions/decisions). */
  checklist: OsceChecklistItem[];
  /** Scenario text shown at station entry. */
  scenarioText: string;
  /** Patient demographics and context. */
  patientContext: {
    age: number | string;
    sex: string;
    setting: string;
    chiefComplaint: string;
  };
}

export interface OsceChecklistItem {
  id: string;
  behaviour: string;
  /** Critical item — station fails if this is missed. */
  isCritical: boolean;
  /** Domain associated with this item. */
  domain: CnpleDomainSlug;
}

export interface OsceStationResult {
  stationId: string;
  completedItems: string[];  // item ids
  missedItems: string[];
  criticalItemsMissed: string[];
  passed: boolean;
  score0to100: number;
  timeTakenSec: number;
}

// ── Multi-patient queue ───────────────────────────────────────────────────────

/**
 * Multi-patient queue: simulates NP triage in a busy clinical setting.
 * Learner must allocate attention across concurrent patients.
 */
export interface MultiPatientQueueContract {
  queueId: string;
  title: string;
  /** Patients waiting at queue start. */
  initialPatients: QueuedPatient[];
  /** Total time available in minutes. */
  totalTimeLimitMinutes: number;
  /** New patients may arrive during the session. */
  scheduledArrivals: Array<{ atMinute: number; patient: QueuedPatient }>;
}

export interface QueuedPatient {
  patientId: string;
  chiefComplaint: string;
  acuity: "emergent" | "urgent" | "semi_urgent" | "routine";
  /** Time this patient has been waiting (minutes). */
  waitMinutes: number;
  /** Domain of the primary clinical decision for this patient. */
  primaryDomain: CnpleDomainSlug;
}

export interface MultiPatientQueueResult {
  queueId: string;
  patientsAssessed: string[];
  patientsDelayed: string[];
  criticalPatientsDelayed: string[];
  triagingScore: number;
  analyticsPayload: Omit<CaseSessionAnalyticsPayload, "scenarioId"> & { queueId: string };
}

// ── Urgent interruption event ─────────────────────────────────────────────────

/**
 * Mid-case urgent interruption: a new acute event interrupts a routine visit.
 * Tests escalation decision-making under simulated time pressure.
 */
export interface UrgentInterruptionContract {
  interruptionId: string;
  /** Step index in the parent case where this interruption fires. */
  firesAtStepIndex: number;
  /** Brief notification shown to the learner. */
  notificationText: string;
  /** Clinical summary of the interruption patient/event. */
  interruptionScenario: string;
  /** The decision required: escalate, stabilise, or continue. */
  options: Array<{
    id: string;
    label: string;
    trajectory: "optimal" | "acceptable" | "suboptimal" | "harmful";
    outcome: string;
  }>;
  correctOptionId: string;
  cnpleDomain: CnpleDomainSlug;
  /** Interruptions always set urgency = "urgent" or "emergency". */
  urgency: "urgent" | "emergency";
}

// ── Async inbox/result follow-up ──────────────────────────────────────────────

/**
 * Inbox follow-up: a diagnostic result arrives after initial assessment.
 * Learner must act on the result correctly (callback, prescription, referral).
 */
export interface InboxFollowUpContract {
  inboxItemId: string;
  /** Patient context for the result. */
  patientSummary: string;
  /** The arriving result (lab, imaging report, specialist letter). */
  resultType: "lab" | "imaging" | "specialist_letter" | "pharmacy_query";
  resultContent: string;
  /**
   * Decision required: e.g. "call patient", "adjust medication", "refer urgently".
   */
  options: Array<{ id: string; label: string; trajectory: "optimal" | "acceptable" | "suboptimal" | "harmful" }>;
  correctOptionId: string;
  cnpleDomain: CnpleDomainSlug;
  urgency: "routine" | "urgent" | "emergent";
}

// ── Continuity clinic simulation ──────────────────────────────────────────────

/**
 * Continuity clinic: longitudinal care for one patient across multiple
 * scheduled visits over a simulated timeframe.
 * Extends the existing PatientCase model with visit-level metadata.
 */
export interface ContinuityClinicContract {
  clinicId: string;
  patientId: string;
  /** Duration of the simulated care relationship (e.g. "6 months"). */
  timeframeLabel: string;
  /** Ordered list of visit case IDs. */
  visitCaseIds: string[];
  /** Whether decisions in earlier visits affect later visit content. */
  hasCrossVisitDependency: boolean;
  /**
   * Trajectory state carried across visits.
   * Provided to the engine when starting each subsequent visit.
   */
  carryoverTrajectoryState?: ClinicalTrajectoryState;
}

// ── Engine capability registry ────────────────────────────────────────────────

/**
 * Declares which session formats the engine supports at a given version.
 * Update when a new format is implemented.
 */
export interface CaseEngineCapabilities {
  /** Supported session formats. */
  supportedFormats: Array<
    | "longitudinal_case"
    | "osce_station"
    | "multi_patient_queue"
    | "urgent_interruption"
    | "inbox_followup"
    | "continuity_clinic"
  >;
  /** Engine version semver. */
  engineVersion: string;
  /** Whether cross-case trajectory state carry-over is supported. */
  supportsTrajectoryCarryover: boolean;
  /** Whether multi-patient parallel sessions are supported. */
  supportsParallelPatients: boolean;
}

/** Current engine capabilities snapshot. Update when formats are shipped. */
export const CURRENT_ENGINE_CAPABILITIES: CaseEngineCapabilities = {
  supportedFormats: ["longitudinal_case"],
  engineVersion: "1.1.0",
  supportsTrajectoryCarryover: false,
  supportsParallelPatients: false,
};
