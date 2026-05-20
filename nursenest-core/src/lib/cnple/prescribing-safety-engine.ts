/**
 * Prescribing safety engine for the CNPLE longitudinal case system.
 *
 * Identifies prescribing-risk decisions, classifies severity,
 * tracks repeated medication safety errors, and integrates with
 * remediation scoring and readiness confidence.
 *
 * Canadian context: references Canadian prescribing authority frameworks,
 * Beers Criteria, and Health Canada safety notices where relevant.
 * Does NOT reference US-specific regulations (HIPAA, DEA schedules, etc.).
 */
import type {
  CaseDecisionRecord,
  CaseStepConsequence,
  PrescribingRiskSeverity,
} from "@/lib/cases/longitudinal-case-types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PrescribingRiskCategory =
  | "contraindication"
  | "renal_dosing"
  | "hepatic_dosing"
  | "drug_interaction"
  | "duplicate_therapy"
  | "pregnancy_safety"
  | "anticoagulation"
  | "pediatric_dosing"
  | "geriatric_safety"         // Beers Criteria / STOPP
  | "controlled_substance"
  | "monitoring_omission"
  | "underdosing_or_underprescribing"
  | "unknown";

export type PrescribingRiskFlag = {
  code: string;
  category: PrescribingRiskCategory;
  severity: PrescribingRiskSeverity;
  description: string;
  /** Step index that generated this flag. */
  stepIndex: number;
  /** Whether this is a repeat of a prior prescribing error in the same session. */
  isRepeat: boolean;
};

export type PrescribingRiskProfile = {
  flags: PrescribingRiskFlag[];
  worstSeverity: PrescribingRiskSeverity | null;
  highCriticalCount: number;
  repeatErrorCount: number;
  /** Penalty deducted from readiness score (0–30 points). */
  readinessPenalty: number;
  /** Amplified remediation priority indicator. */
  requiresUrgentRemediation: boolean;
};

// ── Prescribing families ──────────────────────────────────────────────────────

/** Question families that can generate prescribing risk flags when wrong. */
const PRESCRIBING_RISK_FAMILIES = new Set([
  "safe-prescribing-medication-management",
  "lab-diagnostic-interpretation",   // Lab findings that should trigger dose adjustment
  "chronic-disease-management",       // Ongoing prescribing management
  "lifespan-primary-care",
  "acute-deterioration-urgent-referral",
]);

// ── Severity from trajectory ──────────────────────────────────────────────────

/**
 * Maps a question family + trajectory combo to prescribing risk severity.
 * Conservative: only classifies risk for question families with prescribing relevance.
 */
export function classifyPrescribingRiskSeverity(
  questionFamily: string,
  trajectory: CaseStepConsequence["trajectory"],
): PrescribingRiskSeverity | null {
  if (!PRESCRIBING_RISK_FAMILIES.has(questionFamily)) return null;
  if (trajectory === "optimal" || trajectory === "acceptable") return null;

  if (questionFamily === "safe-prescribing-medication-management") {
    if (trajectory === "harmful") return "critical";
    return "high";
  }

  if (questionFamily === "acute-deterioration-urgent-referral") {
    if (trajectory === "harmful") return "high";
    return "moderate";
  }

  if (trajectory === "harmful") return "high";
  return "moderate";
}

// ── Safety code inference ─────────────────────────────────────────────────────

const SAFETY_CODE_KEYWORDS: Array<[RegExp, PrescribingRiskCategory, PrescribingRiskSeverity]> = [
  [/contraindic/i, "contraindication", "critical"],
  [/renal|eGFR|creatinine|CKD|dose.*adjust/i, "renal_dosing", "high"],
  [/hepat|liver.*impair|CYP.*inhibit/i, "hepatic_dosing", "high"],
  [/interact|combination.*avoid|avoid.*combination/i, "drug_interaction", "high"],
  [/duplicate|same.*class|two.*ACE|two.*ARB|two.*statin/i, "duplicate_therapy", "moderate"],
  [/pregnan|teratogen|breast.?feed/i, "pregnancy_safety", "critical"],
  [/anticoagul|warfarin|heparin|LMWH|DOAC|rivaroxab|apixab/i, "anticoagulation", "high"],
  [/paediatric|pediatric|weight.?based|mg\/kg/i, "pediatric_dosing", "high"],
  [/Beers|elderly.*avoid|older.*avoid|STOPP|inappropriate.*older/i, "geriatric_safety", "moderate"],
  [/controlled|narcotic|opioid|benzodiazepine|stimulant.*prescrib/i, "controlled_substance", "high"],
  [/monitor|follow.?up.*omit|no.*monitoring|without.*check/i, "monitoring_omission", "moderate"],
  [/under.?treat|under.?dose|inadequate.*dose|too.*low/i, "underdosing_or_underprescribing", "low"],
];

/**
 * Attempts to classify a prescribing error by scanning whyWrong text.
 * Returns a category and severity upgrade if a pattern matches.
 */
export function classifyFromText(text: string): { category: PrescribingRiskCategory; severity: PrescribingRiskSeverity } | null {
  for (const [pattern, category, severity] of SAFETY_CODE_KEYWORDS) {
    if (pattern.test(text)) return { category, severity };
  }
  return null;
}

// ── Profile builder ───────────────────────────────────────────────────────────

/**
 * Builds a PrescribingRiskProfile from the full decision list.
 * Accepts optional per-step whyWrong text for deeper category classification.
 */
export function buildPrescribingRiskProfile(
  decisions: CaseDecisionRecord[],
  whyWrongByStep?: Record<number, string>,
): PrescribingRiskProfile {
  const flags: PrescribingRiskFlag[] = [];
  const seenCategories = new Set<string>();

  for (const d of decisions) {
    const severity = d.prescribingRiskSeverity;
    if (!severity) continue;
    if (severity === "low") continue; // Low risk not flagged in profile summary

    const whyText = whyWrongByStep?.[d.stepIndex] ?? "";
    const textClassification = whyText ? classifyFromText(whyText) : null;

    const effectiveSeverity: PrescribingRiskSeverity =
      textClassification && severityRank(textClassification.severity) > severityRank(severity)
        ? textClassification.severity
        : severity;

    const category = textClassification?.category ?? "unknown";
    const codeKey = `${category}_step${d.stepIndex}`;
    const isRepeat = seenCategories.has(category);
    seenCategories.add(category);

    flags.push({
      code: codeKey,
      category,
      severity: effectiveSeverity,
      description: prescribingFlagDescription(category, d.stepIndex),
      stepIndex: d.stepIndex,
      isRepeat,
    });
  }

  const worstSeverity = flags.reduce<PrescribingRiskSeverity | null>((worst, f) => {
    if (!worst) return f.severity;
    return severityRank(f.severity) > severityRank(worst) ? f.severity : worst;
  }, null);

  const highCriticalCount = flags.filter((f) => f.severity === "high" || f.severity === "critical").length;
  const repeatErrorCount = flags.filter((f) => f.isRepeat).length;
  const readinessPenalty = computeReadinessPenalty(flags);
  const requiresUrgentRemediation = highCriticalCount >= 1;

  return {
    flags,
    worstSeverity,
    highCriticalCount,
    repeatErrorCount,
    readinessPenalty,
    requiresUrgentRemediation,
  };
}

// ── Readiness penalty ─────────────────────────────────────────────────────────

/**
 * Returns the readiness score penalty from prescribing flags (0–30 points).
 * Critical errors are weighted more heavily than moderate ones.
 * Repeat errors add extra penalty to reflect unsafe reasoning patterns.
 */
export function computeReadinessPenalty(flags: PrescribingRiskFlag[]): number {
  const PENALTY: Record<PrescribingRiskSeverity, number> = {
    critical: 12,
    high: 7,
    moderate: 3,
    low: 0,
  };
  let total = 0;
  for (const f of flags) {
    total += PENALTY[f.severity];
    if (f.isRepeat) total += 3; // Extra penalty for repeated pattern
  }
  return Math.min(30, total);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function severityRank(s: PrescribingRiskSeverity): number {
  return { low: 1, moderate: 2, high: 3, critical: 4 }[s];
}

function prescribingFlagDescription(category: PrescribingRiskCategory, stepIndex: number): string {
  const descs: Record<PrescribingRiskCategory, string> = {
    contraindication: `Contraindicated medication selected at step ${stepIndex + 1}`,
    renal_dosing: `Renal dose adjustment not applied at step ${stepIndex + 1}`,
    hepatic_dosing: `Hepatic impairment dose adjustment missed at step ${stepIndex + 1}`,
    drug_interaction: `Dangerous drug interaction not recognised at step ${stepIndex + 1}`,
    duplicate_therapy: `Duplicate therapy combination initiated at step ${stepIndex + 1}`,
    pregnancy_safety: `Medication unsafe in pregnancy/breastfeeding at step ${stepIndex + 1}`,
    anticoagulation: `Anticoagulation management error at step ${stepIndex + 1}`,
    pediatric_dosing: `Paediatric weight-based dosing error at step ${stepIndex + 1}`,
    geriatric_safety: `Medication inappropriate for older adults (Beers/STOPP) at step ${stepIndex + 1}`,
    controlled_substance: `Controlled substance prescribing error at step ${stepIndex + 1}`,
    monitoring_omission: `Required monitoring omitted at step ${stepIndex + 1}`,
    underdosing_or_underprescribing: `Under-treatment — dose or drug choice inadequate at step ${stepIndex + 1}`,
    unknown: `Prescribing safety concern at step ${stepIndex + 1}`,
  };
  return descs[category];
}

// ── Readiness confidence adjustment ──────────────────────────────────────────

/**
 * Adjusts a base readiness score downward based on prescribing risk profile.
 * High/critical misses reduce readiness confidence more aggressively.
 */
export function applyPrescribingPenaltyToReadiness(
  baseScore0to100: number,
  profile: PrescribingRiskProfile,
): number {
  return Math.max(0, baseScore0to100 - profile.readinessPenalty);
}
