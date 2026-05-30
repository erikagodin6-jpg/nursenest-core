/**
 * ECG Clearances — Achievement & Credentialing System
 *
 * Clearances are milestone-based credentials that learners earn by
 * demonstrating mastery across specific ECG competency domains.
 *
 * Unlike participation-based badges, clearances require minimum scores,
 * simulation performance, and case completion — they represent genuine
 * clinical readiness, not just content exposure.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ClearanceTier = "foundation" | "core" | "advanced" | "expert";

export type ClearanceStatus = "locked" | "in_progress" | "eligible" | "earned";

export type ClearanceRequirement = {
  type:
    | "detective_rhythm_completion"   // N rhythms completed in detective mode
    | "detective_min_score"           // Minimum score on detective sessions
    | "deterioration_pathway"         // Specific deterioration pathway completed
    | "deterioration_prevention"      // Deterioration pathway with prevention achieved
    | "readiness_domain_score"        // Minimum readiness score in a domain
    | "compare_contrast_completion"   // Compare & contrast pairs completed
    | "telemetry_shift_score"         // Telemetry shift simulator score
    | "medication_safety_score"       // Medication safety domain score across sessions
    | "high_stakes_rhythm_mastery";   // Specific high-stakes rhythms mastered
  /** Human-readable description of the requirement */
  description: string;
  /** Target value (count, percentage, etc.) */
  target: number;
  /** Specific identifiers required (rhythm keys, pathway IDs, etc.) */
  requiredIds?: string[];
};

export type EcgClearance = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tier: ClearanceTier;
  /** Competency domains this clearance validates */
  domains: string[];
  requirements: ClearanceRequirement[];
  /** Clinical contexts this clearance signals readiness for */
  readinessFor: string[];
  /** Clearances that must be earned before this one */
  prerequisites: string[];
  /** Accent colour for the clearance badge */
  badgeColor: "blue" | "teal" | "amber" | "red" | "purple" | "emerald";
  /** Icon identifier for the badge */
  iconKey: string;
};

// ─── Clearance definitions ────────────────────────────────────────────────────

export const ECG_CLEARANCES: EcgClearance[] = [
  // ── Foundation tier ────────────────────────────────────────────────────────
  {
    id: "basic-rhythm-recognition",
    title: "Basic Rhythm Recognition",
    subtitle: "Foundation Clearance",
    description: "Demonstrates ability to identify the fundamental rhythms every nurse encounters on telemetry. Rate, regularity, P-waves, QRS width, and basic escalation decisions.",
    tier: "foundation",
    domains: ["rhythm_recognition"],
    requirements: [
      {
        type: "detective_rhythm_completion",
        description: "Complete detective mode for 8 foundational rhythms",
        target: 8,
        requiredIds: [
          "normal_sinus_rhythm", "sinus_bradycardia", "sinus_tachycardia",
          "atrial_fibrillation", "pvcs", "pacs", "paced_rhythm", "asystole",
        ],
      },
      {
        type: "detective_min_score",
        description: "Score ≥ 70% on each completed detective session",
        target: 70,
      },
    ],
    readinessFor: ["General medical/surgical telemetry monitoring", "Step-down unit basic monitoring"],
    prerequisites: [],
    badgeColor: "blue",
    iconKey: "rhythm-wave",
  },
  {
    id: "medication-safety-foundation",
    title: "ECG Medication Safety",
    subtitle: "Foundation Clearance",
    description: "Demonstrates knowledge of dangerous medication-rhythm interactions. Identifies which medications are contraindicated for specific rhythms and why.",
    tier: "foundation",
    domains: ["rhythm_recognition"],
    requirements: [
      {
        type: "medication_safety_score",
        description: "Score ≥ 80% on medication safety steps across 6+ detective sessions",
        target: 80,
      },
      {
        type: "detective_rhythm_completion",
        description: "Complete detective mode including medication safety step for high-stakes rhythms",
        target: 5,
        requiredIds: [
          "ventricular_tachycardia", "torsades_de_pointes", "sinus_tachycardia",
          "atrial_fibrillation", "stemi_pattern",
        ],
      },
    ],
    readinessFor: ["Safe medication administration near cardiac monitoring", "Recognising contraindicated treatments"],
    prerequisites: ["basic-rhythm-recognition"],
    badgeColor: "amber",
    iconKey: "shield-medication",
  },

  // ── Core tier ──────────────────────────────────────────────────────────────
  {
    id: "telemetry-ready",
    title: "Telemetry Ready",
    subtitle: "Core Clearance",
    description: "Demonstrates clinical-level rhythm identification, escalation judgment, and understanding of hemodynamic consequences across all core rhythms.",
    tier: "core",
    domains: ["rhythm_recognition", "interval_analysis", "telemetry_interpretation"],
    requirements: [
      {
        type: "detective_rhythm_completion",
        description: "Complete advanced detective mode for 15+ rhythms",
        target: 15,
      },
      {
        type: "detective_min_score",
        description: "Score ≥ 75% average across all sessions",
        target: 75,
      },
      {
        type: "compare_contrast_completion",
        description: "Complete 4 compare & contrast pairs",
        target: 4,
        requiredIds: [
          "afib-vs-flutter", "vt-vs-svt", "pac-vs-pvc", "mobitz1-vs-mobitz2",
        ],
      },
      {
        type: "readiness_domain_score",
        description: "Escalation domain readiness score ≥ 75%",
        target: 75,
      },
    ],
    readinessFor: [
      "Telemetry unit assignment",
      "Post-operative cardiac monitoring",
      "Step-down / PCU unit work",
    ],
    prerequisites: ["basic-rhythm-recognition", "medication-safety-foundation"],
    badgeColor: "teal",
    iconKey: "monitor-pulse",
  },
  {
    id: "arrhythmia-recognition-ready",
    title: "Arrhythmia Recognition Ready",
    subtitle: "Core Clearance",
    description: "Demonstrates ability to identify and differentiate all major arrhythmias, including AV blocks, bundle branch blocks, and ectopic rhythms.",
    tier: "core",
    domains: ["rhythm_recognition", "interval_analysis", "conduction_disorders"],
    requirements: [
      {
        type: "detective_rhythm_completion",
        description: "Complete detective mode for all AV block rhythms",
        target: 4,
        requiredIds: [
          "first_degree_av_block", "second_degree_type_i_av_block",
          "second_degree_type_ii_av_block", "third_degree_av_block",
        ],
      },
      {
        type: "detective_rhythm_completion",
        description: "Complete detective mode for RBBB and LBBB",
        target: 2,
        requiredIds: ["right_bundle_branch_block", "left_bundle_branch_block"],
      },
      {
        type: "compare_contrast_completion",
        description: "Complete Mobitz I vs II and RBBB vs LBBB compare & contrast",
        target: 2,
        requiredIds: ["mobitz1-vs-mobitz2", "rbbb-vs-lbbb"],
      },
      {
        type: "detective_min_score",
        description: "Score ≥ 80% on AV block detective sessions",
        target: 80,
      },
    ],
    readinessFor: [
      "Caring for patients with pacemakers",
      "Post-cardiac catheterisation monitoring",
      "CCU / cardiac step-down",
    ],
    prerequisites: ["telemetry-ready"],
    badgeColor: "teal",
    iconKey: "heart-conduction",
  },

  // ── Advanced tier ──────────────────────────────────────────────────────────
  {
    id: "deterioration-recognition-ready",
    title: "Deterioration Recognition Ready",
    subtitle: "Advanced Clearance",
    description: "Demonstrates ability to recognise early warning signs of rhythm deterioration, prioritise interventions correctly, and prevent cardiac arrest through timely action.",
    tier: "advanced",
    domains: ["acls_critical_rhythms", "rhythm_recognition"],
    requirements: [
      {
        type: "deterioration_pathway",
        description: "Complete 2 deterioration pathways",
        target: 2,
        requiredIds: ["pvc-to-vf", "mobitz2-to-chb"],
      },
      {
        type: "deterioration_prevention",
        description: "Achieve 'Prevention' outcome in at least 1 deterioration pathway",
        target: 1,
      },
      {
        type: "readiness_domain_score",
        description: "Clinical reasoning readiness score ≥ 75%",
        target: 75,
      },
    ],
    readinessFor: [
      "High-acuity telemetry",
      "Rapid response team support",
      "ICU orientation",
    ],
    prerequisites: ["telemetry-ready", "arrhythmia-recognition-ready"],
    badgeColor: "red",
    iconKey: "deterioration-alert",
  },
  {
    id: "emergency-ecg-ready",
    title: "Emergency ECG Ready",
    subtitle: "Advanced Clearance",
    description: "Demonstrates mastery of life-threatening rhythm management: VF, VT, pulseless rhythms, complete heart block, STEMI, and Torsades. Correct first actions under time pressure.",
    tier: "advanced",
    domains: ["acls_critical_rhythms", "ischemia_stemi"],
    requirements: [
      {
        type: "high_stakes_rhythm_mastery",
        description: "Score ≥ 85% on all high-stakes rhythm detective sessions",
        target: 85,
        requiredIds: [
          "ventricular_fibrillation", "ventricular_tachycardia",
          "torsades_de_pointes", "stemi_pattern", "third_degree_av_block",
          "pea", "asystole",
        ],
      },
      {
        type: "deterioration_prevention",
        description: "Prevent deterioration in 2 pathways",
        target: 2,
      },
      {
        type: "medication_safety_score",
        description: "100% medication safety accuracy on high-stakes rhythms",
        target: 100,
      },
    ],
    readinessFor: [
      "ACLS provider role",
      "Emergency department work",
      "ICU nursing",
      "Code Blue team member",
    ],
    prerequisites: ["deterioration-recognition-ready"],
    badgeColor: "red",
    iconKey: "emergency-ecg",
  },
  {
    id: "ischemia-ecg-ready",
    title: "Ischaemia & STEMI ECG Ready",
    subtitle: "Advanced Clearance",
    description: "Demonstrates ability to identify STEMI patterns, apply Sgarbossa criteria in LBBB, distinguish STEMI from NSTEMI, and initiate the correct response sequence.",
    tier: "advanced",
    domains: ["ischemia_stemi"],
    requirements: [
      {
        type: "detective_rhythm_completion",
        description: "Complete detective mode for STEMI and NSTEMI",
        target: 2,
        requiredIds: ["stemi_pattern", "nstemi_pattern"],
      },
      {
        type: "compare_contrast_completion",
        description: "Complete STEMI vs NSTEMI compare & contrast",
        target: 1,
        requiredIds: ["stemi-vs-nstemi"],
      },
      {
        type: "high_stakes_rhythm_mastery",
        description: "Score ≥ 90% on STEMI detective session",
        target: 90,
        requiredIds: ["stemi_pattern"],
      },
    ],
    readinessFor: [
      "Cardiac catheterisation lab or CCU",
      "Emergency department cardiac triage",
      "STEMI protocol first responder",
    ],
    prerequisites: ["telemetry-ready"],
    badgeColor: "red",
    iconKey: "stemi-wave",
  },
  {
    id: "electrolyte-ecg-ready",
    title: "Electrolyte ECG Changes Ready",
    subtitle: "Advanced Clearance",
    description: "Demonstrates ability to identify hyperkalemia and hypokalemia ECG patterns, understand the treatment sequence, and recognise the specific medication safety implications.",
    tier: "advanced",
    domains: ["electrolyte_abnormalities"],
    requirements: [
      {
        type: "detective_rhythm_completion",
        description: "Complete detective mode for hyperkalemia and hypokalemia",
        target: 2,
        requiredIds: ["hyperkalemia_pattern", "hypokalemia_pattern"],
      },
      {
        type: "compare_contrast_completion",
        description: "Complete hyperkalemia vs hypokalemia compare & contrast",
        target: 1,
        requiredIds: ["hyperkalemia-vs-hypokalemia"],
      },
      {
        type: "deterioration_pathway",
        description: "Complete the hyperkalemia deterioration pathway",
        target: 1,
        requiredIds: ["hyperkalemia-to-pea"],
      },
    ],
    readinessFor: [
      "Renal / nephrology nursing",
      "ICU electrolyte management",
      "Post-operative care for cardiac patients",
    ],
    prerequisites: ["telemetry-ready"],
    badgeColor: "purple",
    iconKey: "electrolyte-wave",
  },

  // ── Expert tier ────────────────────────────────────────────────────────────
  {
    id: "advanced-telemetry-ready",
    title: "Advanced Telemetry Ready",
    subtitle: "Expert Clearance",
    description: "The highest NurseNest ECG clearance. Demonstrates comprehensive mastery across all 29 rhythms, all deterioration pathways, advanced clinical reasoning, and multi-patient shift management.",
    tier: "expert",
    domains: [
      "rhythm_recognition", "interval_analysis", "ischemia_stemi",
      "acls_critical_rhythms", "telemetry_interpretation", "conduction_disorders",
      "paced_rhythms", "electrolyte_abnormalities",
    ],
    requirements: [
      {
        type: "detective_rhythm_completion",
        description: "Complete advanced detective mode for all 29 rhythms",
        target: 29,
      },
      {
        type: "detective_min_score",
        description: "Score ≥ 80% average across all detective sessions",
        target: 80,
      },
      {
        type: "deterioration_prevention",
        description: "Prevent deterioration in all 4 deterioration pathways",
        target: 4,
      },
      {
        type: "readiness_domain_score",
        description: "Overall ECG readiness score ≥ 85%",
        target: 85,
      },
    ],
    readinessFor: [
      "Critical Care / ICU",
      "Cardiac care unit (CCU)",
      "Advanced cardiac monitoring",
      "ACLS resource nurse",
      "NP advanced practice cardiac assessment",
    ],
    prerequisites: [
      "emergency-ecg-ready",
      "ischemia-ecg-ready",
      "electrolyte-ecg-ready",
      "deterioration-recognition-ready",
    ],
    badgeColor: "emerald",
    iconKey: "advanced-ecg-star",
  },
];

// ─── Registry ─────────────────────────────────────────────────────────────────

export function getEcgClearance(id: string): EcgClearance | undefined {
  return ECG_CLEARANCES.find((c) => c.id === id);
}

export function getEcgClearancesByTier(tier: ClearanceTier): EcgClearance[] {
  return ECG_CLEARANCES.filter((c) => c.tier === tier);
}

export function getAvailableClearances(earnedClearanceIds: string[]): EcgClearance[] {
  const earned = new Set(earnedClearanceIds);
  return ECG_CLEARANCES.filter((c) =>
    !earned.has(c.id) &&
    c.prerequisites.every((prereq) => earned.has(prereq)),
  );
}

// ─── Progress evaluation ──────────────────────────────────────────────────────

export type ClearanceEligibilityResult = {
  clearanceId: string;
  status: ClearanceStatus;
  requirementResults: Array<{
    requirement: ClearanceRequirement;
    met: boolean;
    currentValue: number;
    targetValue: number;
  }>;
  percentageComplete: number;
};

export type LearnerClearanceMetrics = {
  /** Detective sessions completed (rhythm key → best score) */
  detectiveScores: Record<string, number>;
  /** Detective sessions by rhythm key: count of completions */
  detectiveCompletions: Record<string, number>;
  /** Deterioration pathways completed (pathway ID → {completed, prevented}) */
  deteriorationResults: Record<string, { completed: boolean; prevented: boolean; score: number }>;
  /** Compare & contrast pairs completed */
  compareContrastCompletions: string[];
  /** Readiness domain scores */
  readinessDomainScores: Record<string, number>;
  /** Overall medication safety average score */
  medicationSafetyScore: number;
};

export function evaluateClearanceEligibility(
  clearance: EcgClearance,
  metrics: LearnerClearanceMetrics,
  earnedClearanceIds: string[],
): ClearanceEligibilityResult {
  const earned = new Set(earnedClearanceIds);
  const prerequisitesMet = clearance.prerequisites.every((p) => earned.has(p));

  if (!prerequisitesMet) {
    return {
      clearanceId: clearance.id,
      status: "locked",
      requirementResults: clearance.requirements.map((r) => ({
        requirement: r,
        met: false,
        currentValue: 0,
        targetValue: r.target,
      })),
      percentageComplete: 0,
    };
  }

  const requirementResults = clearance.requirements.map((req) => {
    let currentValue = 0;
    let met = false;

    switch (req.type) {
      case "detective_rhythm_completion": {
        const ids = req.requiredIds ?? [];
        if (ids.length > 0) {
          currentValue = ids.filter((k) => (metrics.detectiveCompletions[k] ?? 0) > 0).length;
          met = currentValue >= req.target;
        } else {
          currentValue = Object.keys(metrics.detectiveCompletions).length;
          met = currentValue >= req.target;
        }
        break;
      }
      case "detective_min_score": {
        const scores = Object.values(metrics.detectiveScores);
        currentValue = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        met = currentValue >= req.target;
        break;
      }
      case "deterioration_pathway": {
        const ids = req.requiredIds ?? [];
        if (ids.length > 0) {
          currentValue = ids.filter((id) => metrics.deteriorationResults[id]?.completed).length;
        } else {
          currentValue = Object.values(metrics.deteriorationResults).filter((r) => r.completed).length;
        }
        met = currentValue >= req.target;
        break;
      }
      case "deterioration_prevention": {
        currentValue = Object.values(metrics.deteriorationResults).filter((r) => r.prevented).length;
        met = currentValue >= req.target;
        break;
      }
      case "readiness_domain_score": {
        const scores = Object.values(metrics.readinessDomainScores);
        currentValue = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        met = currentValue >= req.target;
        break;
      }
      case "compare_contrast_completion": {
        const ids = req.requiredIds ?? [];
        if (ids.length > 0) {
          currentValue = ids.filter((id) => metrics.compareContrastCompletions.includes(id)).length;
        } else {
          currentValue = metrics.compareContrastCompletions.length;
        }
        met = currentValue >= req.target;
        break;
      }
      case "medication_safety_score": {
        currentValue = metrics.medicationSafetyScore;
        met = currentValue >= req.target;
        break;
      }
      case "high_stakes_rhythm_mastery": {
        const ids = req.requiredIds ?? [];
        if (ids.length > 0) {
          const relevantScores = ids.map((id) => metrics.detectiveScores[id] ?? 0);
          const belowTarget = relevantScores.filter((s) => s < req.target).length;
          currentValue = ids.length - belowTarget;
          met = belowTarget === 0;
        }
        break;
      }
    }

    return { requirement: req, met, currentValue, targetValue: req.target };
  });

  const metCount = requirementResults.filter((r) => r.met).length;
  const percentageComplete = Math.round((metCount / requirementResults.length) * 100);
  const allMet = metCount === requirementResults.length;

  return {
    clearanceId: clearance.id,
    status: allMet ? "eligible" : prerequisitesMet ? "in_progress" : "locked",
    requirementResults,
    percentageComplete,
  };
}

/** Returns ordered clearance progression path for a given learner. */
export function getClearanceRoadmap(
  earnedClearanceIds: string[],
  metrics: LearnerClearanceMetrics,
): Array<{ clearance: EcgClearance; eligibility: ClearanceEligibilityResult }> {
  const tierOrder: ClearanceTier[] = ["foundation", "core", "advanced", "expert"];
  return ECG_CLEARANCES
    .sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier))
    .map((clearance) => ({
      clearance,
      eligibility: evaluateClearanceEligibility(clearance, metrics, earnedClearanceIds),
    }));
}
