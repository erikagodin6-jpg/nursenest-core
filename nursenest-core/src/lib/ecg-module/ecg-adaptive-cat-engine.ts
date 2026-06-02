/**
 * ECG Adaptive CAT Engine — Phase 2
 *
 * Extends the existing ECG adaptive remediation infrastructure with a
 * 5-level adaptive domain system for ECG-specific computer-adaptive testing.
 *
 * INTEGRATES WITH (does not replace):
 *   - EcgAdaptiveRemediationEngine (ecg-adaptive-remediation.ts)
 *   - EcgMasteryRecord (ecg-learner-mastery.ts)
 *   - EcgCompetencyDomainId (ecg-competency-domains.ts)
 *   - EcgPassportLevel (ecg-competency-passport.ts)
 *
 * 5-LEVEL ADAPTIVE DIFFICULTY
 *   Level 1: Basic recognition — identify the rhythm from the strip
 *   Level 2: Recognition + intervention — identify rhythm + correct first action
 *   Level 3: Recognition + prioritization — identify rhythm + who gets attention first
 *   Level 4: Recognition + patient deterioration — interpret evolving rhythm changes
 *   Level 5: Full clinical judgment — NCJMM all 6 layers across a complex scenario
 *
 * WEAK AREA TRIGGERS
 *   When a learner falls below threshold on any domain, the engine
 *   surfaces targeted content from:
 *     - Lessons (ecg-structured-lessons.ts)
 *     - Flashcards (ecg-pediatric-flashcard-pathways.ts or adult equivalent)
 *     - Simulations (ecg-simulation-catalog.ts)
 *     - Clinical judgment cases (ecg-ngn-cases.ts)
 *     - Targeted ECG quizzes (this engine's question pool)
 */

import type { EcgCompetencyDomainId } from "@/lib/ecg-module/ecg-competency-domains";
import type { EcgMasteryState } from "@/lib/ecg-module/ecg-learner-mastery";
import type { EcgPassportLevel } from "@/lib/ecg-module/ecg-competency-passport";

// ─── Adaptive difficulty levels ────────────────────────────────────────────────

export type EcgAdaptiveDifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type EcgAdaptiveLevelSpec = {
  level: EcgAdaptiveDifficultyLevel;
  label: string;
  description: string;
  /** What clinical judgment capabilities this level tests */
  competencies: ReadonlyArray<string>;
  /** Which NCJMM layers are tested at this level */
  ngjmLayers: ReadonlyArray<string>;
  /** Passport levels where this difficulty is appropriate */
  targetPassportLevels: ReadonlyArray<EcgPassportLevel>;
  /** Approximate proportion of correct responses expected at proficiency */
  expectedProficiencyThreshold: number;
};

export const ECG_ADAPTIVE_LEVELS: ReadonlyArray<EcgAdaptiveLevelSpec> = [
  {
    level: 1,
    label: "Basic Recognition",
    description:
      "Identify the rhythm from a rhythm strip. Rate, regularity, P waves, PR interval, QRS width. " +
      "No hemodynamic context required. Strip identification only.",
    competencies: [
      "Name the rhythm accurately",
      "Identify the rate and regularity",
      "Describe the P-QRS relationship",
    ],
    ngjmLayers: ["recognize_cues"],
    targetPassportLevels: ["beginner", "developing"],
    expectedProficiencyThreshold: 0.80,
  },
  {
    level: 2,
    label: "Recognition + Intervention",
    description:
      "Identify the rhythm AND select the correct first nursing action. " +
      "Patient is described as symptomatic or asymptomatic. Hemodynamic assessment required.",
    competencies: [
      "Identify the rhythm",
      "Assess hemodynamic stability from clinical description",
      "Select the correct first intervention",
    ],
    ngjmLayers: ["recognize_cues", "analyze_cues", "generate_solutions"],
    targetPassportLevels: ["developing", "proficient"],
    expectedProficiencyThreshold: 0.75,
  },
  {
    level: 3,
    label: "Recognition + Prioritization",
    description:
      "Identify the rhythm AND determine which of multiple patients requires the most urgent attention. " +
      "Four-patient prioritization with different rhythms and clinical contexts.",
    competencies: [
      "Identify rhythms across multiple patients",
      "Rank urgency using hemodynamic and clinical context",
      "Justify the prioritization decision",
    ],
    ngjmLayers: ["recognize_cues", "analyze_cues", "prioritize_hypotheses"],
    targetPassportLevels: ["proficient", "advanced"],
    expectedProficiencyThreshold: 0.72,
  },
  {
    level: 4,
    label: "Recognition + Patient Deterioration",
    description:
      "Interpret a rhythm trend over time. Identify what changed, why, what warning signs were present, " +
      "and what intervention would have prevented the deterioration.",
    competencies: [
      "Recognize rhythm progression over a time series",
      "Identify missed warning signs",
      "Select the earliest preventive intervention",
    ],
    ngjmLayers: ["recognize_cues", "analyze_cues", "prioritize_hypotheses", "take_actions"],
    targetPassportLevels: ["advanced", "telemetry_ready"],
    expectedProficiencyThreshold: 0.70,
  },
  {
    level: 5,
    label: "Full Clinical Judgment",
    description:
      "Complex multi-step scenario integrating rhythm recognition, hemodynamic assessment, " +
      "escalation decision, intervention selection, documentation, and outcome evaluation. " +
      "Tests all six NCJMM layers.",
    competencies: [
      "Recognize and analyze complex rhythm changes",
      "Prioritize across multiple competing hypotheses",
      "Generate and execute evidence-based solutions",
      "Evaluate outcomes and adapt management",
      "Document and communicate clinical findings",
    ],
    ngjmLayers: ["recognize_cues", "analyze_cues", "prioritize_hypotheses", "generate_solutions", "take_actions", "evaluate_outcomes"],
    targetPassportLevels: ["telemetry_ready", "clinical_ready", "ecg_mastery"],
    expectedProficiencyThreshold: 0.68,
  },
];

// ─── Domain-specific adaptive configuration ────────────────────────────────────

export type EcgDomainAdaptiveConfig = {
  domain: EcgCompetencyDomainId;
  /**
   * Below this accuracy threshold, the adaptive engine triggers remediation.
   * Different domains have different tolerances based on clinical risk.
   */
  remediationThreshold: number;
  /**
   * Mastery state below which this domain is flagged as a weak area
   * requiring targeted intervention.
   */
  weakAreaMasteryStates: ReadonlyArray<EcgMasteryState>;
  /**
   * What content types to surface when this domain is weak.
   * Ordered by priority (first = highest priority surface).
   */
  weakAreaRemediationOrder: ReadonlyArray<"lessons" | "flashcards" | "simulations" | "ngn_cases" | "quizzes">;
  /** The lesson IDs most relevant for remediating weakness in this domain */
  remediationLessonIds: ReadonlyArray<string>;
  /** The simulation IDs most relevant for this domain */
  remediationSimulationIds: ReadonlyArray<string>;
};

export const ECG_DOMAIN_ADAPTIVE_CONFIGS: ReadonlyArray<EcgDomainAdaptiveConfig> = [
  {
    domain: "rhythm_recognition",
    remediationThreshold: 0.70,
    weakAreaMasteryStates: ["not_started", "learning", "struggling"],
    weakAreaRemediationOrder: ["lessons", "quizzes", "flashcards", "simulations"],
    remediationLessonIds: ["normal-sinus-rhythm", "rate-calculation", "rhythm-regularity", "p-wave-identification"],
    remediationSimulationIds: ["ecg-ng-systematic-approach", "ecg-ng-reading-the-strip-practice"],
  },
  {
    domain: "acls_critical_rhythms",
    remediationThreshold: 0.75,
    weakAreaMasteryStates: ["not_started", "learning", "struggling", "needs_review"],
    weakAreaRemediationOrder: ["simulations", "ngn_cases", "lessons", "quizzes"],
    remediationLessonIds: ["ventricular-tachycardia", "ventricular-fibrillation", "asystole-pea"],
    remediationSimulationIds: ["ecg-sim-vt-code-rn", "ecg-rn-pea-6h-5t", "ecg-rn-asystole-confirm"],
  },
  {
    domain: "ischemia_stemi",
    remediationThreshold: 0.75,
    weakAreaMasteryStates: ["not_started", "learning", "struggling"],
    weakAreaRemediationOrder: ["simulations", "ngn_cases", "lessons", "flashcards"],
    remediationLessonIds: ["stemi-pattern", "nstemi-pattern", "right-sided-leads"],
    remediationSimulationIds: ["ecg-sim-stemi-activation-rn", "ecg-rn-posterior-stemi", "ecg-rn-lbbb-new"],
  },
  {
    domain: "conduction_disorders",
    remediationThreshold: 0.65,
    weakAreaMasteryStates: ["not_started", "learning", "struggling"],
    weakAreaRemediationOrder: ["lessons", "flashcards", "simulations", "quizzes"],
    remediationLessonIds: ["av-blocks-overview", "bundle-branch-block"],
    remediationSimulationIds: ["ecg-rn-bradycardia-chb", "ecg-rn-wenckebach", "ecg-rn-mobitz2-urgent"],
  },
  {
    domain: "telemetry_interpretation",
    remediationThreshold: 0.68,
    weakAreaMasteryStates: ["not_started", "learning", "struggling"],
    weakAreaRemediationOrder: ["quizzes", "simulations", "lessons", "flashcards"],
    remediationLessonIds: ["artifact-recognition", "lead-placement"],
    remediationSimulationIds: ["ecg-rn-artifact-vf", "ecg-rn-pacemaker-failure"],
  },
  {
    domain: "electrolyte_abnormalities",
    remediationThreshold: 0.65,
    weakAreaMasteryStates: ["not_started", "learning", "struggling"],
    weakAreaRemediationOrder: ["lessons", "flashcards", "quizzes", "simulations"],
    remediationLessonIds: ["hyperkalemia-ecg", "hypokalemia-ecg"],
    remediationSimulationIds: ["ecg-rn-hyperkalemia", "ecg-rn-hypokalemia-u-wave"],
  },
  {
    domain: "paced_rhythms",
    remediationThreshold: 0.62,
    weakAreaMasteryStates: ["not_started", "learning", "struggling"],
    weakAreaRemediationOrder: ["lessons", "simulations", "quizzes"],
    remediationLessonIds: ["pacemaker-basics", "paced-rhythm-interpretation"],
    remediationSimulationIds: ["ecg-rn-pacemaker-failure", "ecg-rn-atrial-pacing"],
  },
  {
    domain: "interval_analysis",
    remediationThreshold: 0.68,
    weakAreaMasteryStates: ["not_started", "learning", "struggling"],
    weakAreaRemediationOrder: ["lessons", "quizzes", "flashcards"],
    remediationLessonIds: ["pr-interval-analysis", "qrs-duration-measurement", "qt-interval-qtc"],
    remediationSimulationIds: ["ecg-rn-long-qt-drug"],
  },
];

// ─── Item selection logic ──────────────────────────────────────────────────────

export type EcgAdaptiveItemRequest = {
  /** Current learner passport level */
  currentLevel: EcgPassportLevel;
  /** Domains where the learner is weakest */
  weakDomains: ReadonlyArray<EcgCompetencyDomainId>;
  /** The rhythm that was most recently missed (for targeted retry) */
  lastMissedRhythmKey?: string;
  /** The current adaptive difficulty level the engine should target */
  targetDifficultyLevel: EcgAdaptiveDifficultyLevel;
  /** Items already presented in this session (avoid repetition) */
  presentedItemIds: ReadonlyArray<string>;
};

export type EcgAdaptiveItemRecommendation = {
  /** Type of content to surface */
  contentType: "question" | "lesson" | "simulation" | "flashcard" | "ngn_case";
  /** ID of the recommended content item */
  contentId: string;
  /** Why this item was selected */
  reason: string;
  /** Target difficulty level for this item */
  targetLevel: EcgAdaptiveDifficultyLevel;
  /** Which domain this item addresses */
  domain: EcgCompetencyDomainId;
  /** Priority score (higher = show first) */
  priority: number;
};

/**
 * Selects the next recommended content item for a learner session.
 * Pure function — caller owns state.
 */
export function selectNextEcgAdaptiveItem(
  request: EcgAdaptiveItemRequest,
): EcgAdaptiveItemRecommendation | null {
  // Find the highest-priority weak domain
  if (request.weakDomains.length === 0) return null;

  const primaryWeakDomain = request.weakDomains[0];
  if (!primaryWeakDomain) return null;

  const domainConfig = ECG_DOMAIN_ADAPTIVE_CONFIGS.find(
    (c) => c.domain === primaryWeakDomain,
  );
  if (!domainConfig) return null;

  // Select the appropriate content type based on the domain config and difficulty
  const contentType = domainConfig.weakAreaRemediationOrder[0];
  if (!contentType) return null;

  // Map content type to actual content IDs
  let contentId: string;
  let reason: string;

  if (contentType === "simulations" && domainConfig.remediationSimulationIds.length > 0) {
    const available = domainConfig.remediationSimulationIds.filter(
      (id) => !request.presentedItemIds.includes(id),
    );
    if (available.length === 0) return null;
    contentId = available[0]!;
    reason = `Simulation targeting your weak area in ${primaryWeakDomain.replace(/_/g, " ")}`;
  } else if (contentType === "lessons" && domainConfig.remediationLessonIds.length > 0) {
    const available = domainConfig.remediationLessonIds.filter(
      (id) => !request.presentedItemIds.includes(id),
    );
    if (available.length === 0) return null;
    contentId = available[0]!;
    reason = `Lesson review for your weak area in ${primaryWeakDomain.replace(/_/g, " ")}`;
  } else {
    return null;
  }

  return {
    contentType: contentType === "simulations" ? "simulation" : "lesson",
    contentId,
    reason,
    targetLevel: request.targetDifficultyLevel,
    domain: primaryWeakDomain,
    priority: 100,
  };
}

/**
 * Determines the appropriate next adaptive difficulty level based on performance.
 * Implements the adaptive engine logic: correct → increase; incorrect → decrease or hold.
 */
export function computeNextAdaptiveDifficulty(
  currentLevel: EcgAdaptiveDifficultyLevel,
  recentAccuracy: number,
  consecutiveCorrect: number,
  consecutiveIncorrect: number,
): EcgAdaptiveDifficultyLevel {
  const spec = ECG_ADAPTIVE_LEVELS.find((l) => l.level === currentLevel);
  if (!spec) return currentLevel;

  const threshold = spec.expectedProficiencyThreshold;

  // Increase difficulty: 3+ consecutive correct AND recent accuracy above threshold
  if (consecutiveCorrect >= 3 && recentAccuracy >= threshold) {
    return Math.min(5, currentLevel + 1) as EcgAdaptiveDifficultyLevel;
  }

  // Decrease difficulty: 2+ consecutive incorrect OR recent accuracy far below threshold
  if (consecutiveIncorrect >= 2 || recentAccuracy < threshold - 0.20) {
    return Math.max(1, currentLevel - 1) as EcgAdaptiveDifficultyLevel;
  }

  return currentLevel;
}

// ─── Session readiness score ───────────────────────────────────────────────────

export type EcgAdaptiveReadinessScore = {
  /** 0–100 score */
  score: number;
  /** Breakdown by domain [0–1] */
  domainBreakdown: Record<EcgCompetencyDomainId, number>;
  /** Domains flagged as weak (below remediation threshold) */
  weakDomains: ReadonlyArray<EcgCompetencyDomainId>;
  /** Domains at or above proficiency threshold */
  strongDomains: ReadonlyArray<EcgCompetencyDomainId>;
  /** The readiness label for UI display */
  readinessLabel:
    | "Not yet ready"
    | "Building foundations"
    | "Developing competency"
    | "Approaching readiness"
    | "NCLEX ready"
    | "Clinical ready";
};

export function computeEcgReadinessScore(
  domainScores: Partial<Record<EcgCompetencyDomainId, number>>,
): EcgAdaptiveReadinessScore {
  const allDomains: EcgCompetencyDomainId[] = [
    "rhythm_recognition", "acls_critical_rhythms", "ischemia_stemi",
    "conduction_disorders", "telemetry_interpretation", "electrolyte_abnormalities",
    "paced_rhythms", "interval_analysis",
  ];

  const weights: Record<EcgCompetencyDomainId, number> = {
    rhythm_recognition: 0.20,
    acls_critical_rhythms: 0.22,
    ischemia_stemi: 0.18,
    conduction_disorders: 0.12,
    telemetry_interpretation: 0.10,
    electrolyte_abnormalities: 0.08,
    paced_rhythms: 0.05,
    interval_analysis: 0.05,
  };

  const breakdown: Record<EcgCompetencyDomainId, number> = {} as Record<EcgCompetencyDomainId, number>;
  let weightedSum = 0;

  for (const domain of allDomains) {
    const score = domainScores[domain] ?? 0;
    breakdown[domain] = score;
    weightedSum += score * (weights[domain] ?? 0);
  }

  const score = Math.round(weightedSum * 100);

  const thresholds = ECG_DOMAIN_ADAPTIVE_CONFIGS.reduce(
    (acc, cfg) => ({ ...acc, [cfg.domain]: cfg.remediationThreshold }),
    {} as Record<EcgCompetencyDomainId, number>,
  );

  const weakDomains = allDomains.filter(
    (d) => (breakdown[d] ?? 0) < (thresholds[d] ?? 0.70),
  );
  const strongDomains = allDomains.filter(
    (d) => !weakDomains.includes(d),
  );

  let readinessLabel: EcgAdaptiveReadinessScore["readinessLabel"];
  if (score < 40) readinessLabel = "Not yet ready";
  else if (score < 55) readinessLabel = "Building foundations";
  else if (score < 68) readinessLabel = "Developing competency";
  else if (score < 78) readinessLabel = "Approaching readiness";
  else if (score < 88) readinessLabel = "NCLEX ready";
  else readinessLabel = "Clinical ready";

  return { score, domainBreakdown: breakdown, weakDomains, strongDomains, readinessLabel };
}
