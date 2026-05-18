/**
 * Medication adherence tracker.
 *
 * Builds the medication adherence state from the case's initial medications
 * plus per-step changes and per-decision trajectory signals.
 *
 * Adherence status affects which medication effects are applied to labs/vitals.
 */
import type {
  MedicationChange,
  CaseDecisionRecord,
  MedicationAdherenceRecord,
  CaseStepConsequence,
} from "@/lib/cases/longitudinal-case-types";
import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

// ── Status inference ──────────────────────────────────────────────────────────

/**
 * Determines adherence status for a medication given a decision at a step.
 * Harmful trajectories on prescribing steps may flag a medication as
 * contraindicated or duplicated.
 */
function inferAdherenceStatusFromDecision(
  medName: string,
  decision: CaseDecisionRecord,
): MedicationAdherenceRecord["status"] | null {
  if (decision.trajectory !== "harmful" && decision.trajectory !== "suboptimal") return null;

  const lowerMed = medName.toLowerCase();
  const flags = decision.safetyFlagsTriggered ?? [];

  if (flags.includes("contraindication_missed") || flags.includes("duplicate_therapy")) {
    if (flags.includes("duplicate_therapy")) return "duplicated";
    return "contraindicated";
  }
  // Check for signals in prescribingRiskSeverity
  if (decision.prescribingRiskSeverity === "critical" && decision.trajectory === "harmful") {
    return "contraindicated";
  }
  return null;
}

// ── Adherence state builder ───────────────────────────────────────────────────

/**
 * Builds the current medication adherence records up to a given step.
 *
 * Rules:
 * 1. Initial medications → all start as "active" at step 0
 * 2. MedicationChange with flag="new" at step i → "started" at step i
 * 3. MedicationChange with flag="discontinued" → "stopped" at that step
 * 4. Harmful prescribing decisions may mark a medication as "contraindicated" or "duplicated"
 */
export function buildMedicationAdherenceRecords(
  patientCase: PatientCase,
  decisions: CaseDecisionRecord[],
  upToStepIndex: number,
): MedicationAdherenceRecord[] {
  const records: MedicationAdherenceRecord[] = [];
  const medStatusMap = new Map<string, MedicationAdherenceRecord["status"]>();

  // Seed from initial case medications
  for (const med of patientCase.medications) {
    medStatusMap.set(med.name.toLowerCase(), "active");
  }

  // Process step-by-step changes up to upToStepIndex
  for (let si = 0; si <= upToStepIndex && si < patientCase.steps.length; si++) {
    const step = patientCase.steps[si];
    if (!step) continue;

    // Apply authored medication changes at this step
    for (const change of step.medicationChanges) {
      const key = change.name.toLowerCase();
      const flag = medicationChangeFlag(change);
      if (flag === "new") {
        medStatusMap.set(key, "started");
      } else if (flag === "discontinued") {
        medStatusMap.set(key, "stopped");
      } else if (flag === "hold") {
        medStatusMap.set(key, "stopped");
      } else if (flag === "changed") {
        medStatusMap.set(key, "active");
      }
    }

    // Apply decision-based adherence signals
    const decision = decisions.find((d) => d.stepIndex === si);
    if (decision) {
      for (const [medKey] of medStatusMap.entries()) {
        const status = inferAdherenceStatusFromDecision(medKey, decision);
        if (status) medStatusMap.set(medKey, status);
      }
    }
  }

  // Convert map to records
  for (const [name, status] of medStatusMap.entries()) {
    records.push({ name, status, stepIndex: upToStepIndex });
  }

  return records;
}

function medicationChangeFlag(change: MedicationChange): "new" | "changed" | "discontinued" | "hold" | undefined {
  if (change.flag) return change.flag;
  if (change.change === "start") return "new";
  if (change.change === "continue") return "changed";
  if (change.change === "stop") return "discontinued";
  if (change.change === "hold") return "hold";
  if (change.change === "change") return "changed";
  return undefined;
}

/**
 * Returns a list of medication names currently considered "active"
 * (i.e., started or active, not stopped/contraindicated/refused/delayed).
 */
export function getActiveMedicationNames(records: MedicationAdherenceRecord[]): string[] {
  return records
    .filter((r) => r.status === "active" || r.status === "started")
    .map((r) => r.name);
}

/**
 * Derives a human-readable short label for a status badge.
 */
export function adherenceStatusLabel(status: MedicationAdherenceRecord["status"]): string {
  const labels: Record<MedicationAdherenceRecord["status"], string> = {
    started: "Started",
    active: "Ongoing",
    delayed: "Delayed",
    refused: "Refused",
    contraindicated: "Contraindicated",
    duplicated: "Duplicate",
    stopped: "Stopped",
  };
  return labels[status];
}

/** Severity tier used for colour selection — maps to semantic token names. */
export type AdherenceSeverity = "success" | "warning" | "danger" | "muted" | "none";

export type AdherenceStatusConfig = {
  severity: AdherenceSeverity;
  /** Short label shown in the badge. */
  badgeLabel: string;
  /** Clinical explanation shown below the badge for risky statuses. Null for non-risky. */
  clinicalNote: string | null;
  /** Whether the medication row should be visually de-emphasised (stopped/refused). */
  dimRow: boolean;
};

/** Complete badge + explanation config for each adherence status. */
export const ADHERENCE_STATUS_CONFIG: Record<
  MedicationAdherenceRecord["status"],
  AdherenceStatusConfig
> = {
  active: {
    severity: "none",
    badgeLabel: "Ongoing",
    clinicalNote: null,
    dimRow: false,
  },
  started: {
    severity: "success",
    badgeLabel: "Started",
    clinicalNote: null,
    dimRow: false,
  },
  delayed: {
    severity: "warning",
    badgeLabel: "Delayed",
    clinicalNote: "Therapy delayed; monitor response.",
    dimRow: false,
  },
  refused: {
    severity: "muted",
    badgeLabel: "Refused",
    clinicalNote: "Patient declined.",
    dimRow: true,
  },
  contraindicated: {
    severity: "danger",
    badgeLabel: "Contraindicated",
    clinicalNote: "Safety concern — review before continuing.",
    dimRow: false,
  },
  duplicated: {
    severity: "warning",
    badgeLabel: "Duplicate",
    clinicalNote: "Possible duplicate therapy.",
    dimRow: false,
  },
  stopped: {
    severity: "muted",
    badgeLabel: "Stopped",
    clinicalNote: "Medication stopped in this trajectory.",
    dimRow: true,
  },
};

// ── Merge helper ──────────────────────────────────────────────────────────────

/** Minimal medication detail shape accepted as hydration source. */
export type MedicationDetailSource = {
  name: string;
  dose?: string;
  route?: string;
  frequency?: string;
  indication?: string;
  /** When present, used to set isNewThisStep on the display entry. */
  flag?: "new" | "changed" | "discontinued" | "hold";
};

/** Rich medication display entry: original details + current adherence status. */
export type AdherenceMedDisplayEntry = {
  name: string;
  dose?: string;
  route?: string;
  frequency?: string;
  indication?: string;
  /** Adherence status from evolved state. Null = status unknown (render as active). */
  status: MedicationAdherenceRecord["status"] | null;
  /**
   * The case step at which this medication was started.
   * Undefined for initial case medications.
   */
  sourceStepIndex?: number;
  /**
   * True when the medication was started or changed at the current step being rendered.
   * Used to show the "New this step" indicator without waiting for activeMeds to refresh.
   */
  isNewThisStep?: boolean;
};

/**
 * Merges a `MedicationEntry[]` (rich dose/frequency/route details)
 * with `MedicationAdherenceRecord[]` (current session status).
 *
 * @param meds            Current medication entries with dose/route/frequency/indication.
 * @param adherenceRecords Adherence status records from evolvedState.
 * @param stepChanges     Optional: medication changes from the CURRENT step's authored content.
 *                        Used to hydrate dose/route/frequency for newly-started medications
 *                        BEFORE activeMeds state updates (same-step visibility fix).
 *
 * Matching is case-insensitive on `name`. Medications in `meds` without
 * a matching adherence record get status=null (rendered as active/no badge).
 *
 * Medications in adherence records that aren't in `meds` are appended;
 * their details are sourced from `stepChanges` when available.
 */
export function mergeAdherenceWithMedications(
  meds: Array<{ name: string; dose?: string; route?: string; frequency?: string; indication?: string }>,
  adherenceRecords: MedicationAdherenceRecord[],
  stepChanges?: MedicationDetailSource[],
): AdherenceMedDisplayEntry[] {
  const result: AdherenceMedDisplayEntry[] = [];
  const seen = new Set<string>();

  // Build a fast lookup from step changes (case-insensitive)
  const stepChangeMap = new Map<string, MedicationDetailSource>();
  for (const change of stepChanges ?? []) {
    stepChangeMap.set(change.name.toLowerCase(), change);
  }

  for (const med of meds) {
    const key = med.name.toLowerCase();
    const record = adherenceRecords.find((r) => r.name.toLowerCase() === key);
    const stepChange = stepChangeMap.get(key);
    const isNewThisStep = stepChange?.flag === "new" || stepChange?.flag === "changed";
    result.push({
      name: med.name,
      // Prefer step-change details when a dose update happened this step
      dose: isNewThisStep && stepChange?.dose ? stepChange.dose : med.dose,
      route: isNewThisStep && stepChange?.route ? stepChange.route : med.route,
      frequency: isNewThisStep && stepChange?.frequency ? stepChange.frequency : med.frequency,
      indication: isNewThisStep && stepChange?.indication ? stepChange.indication : med.indication,
      status: record?.status ?? null,
      isNewThisStep: isNewThisStep || undefined,
      sourceStepIndex: record?.stepIndex,
    });
    seen.add(key);
  }

  // Append adherence-only entries not yet in activeMeds.
  // Hydrate dose/route/frequency from stepChanges when available — this is the
  // same-step visibility fix: new medications appear fully-detailed immediately.
  for (const record of adherenceRecords) {
    const key = record.name.toLowerCase();
    if (seen.has(key)) continue;

    const stepChange = stepChangeMap.get(key);
    const isNewThisStep = record.status === "started" || stepChange?.flag === "new";

    result.push({
      name: stepChange?.name ?? record.name,
      dose: stepChange?.dose,
      route: stepChange?.route,
      frequency: stepChange?.frequency,
      indication: stepChange?.indication,
      status: record.status,
      sourceStepIndex: record.stepIndex,
      isNewThisStep: isNewThisStep || undefined,
    });
    seen.add(key);
  }

  return result;
}
