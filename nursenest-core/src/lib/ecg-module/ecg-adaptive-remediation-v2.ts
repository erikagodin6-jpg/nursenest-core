/**
 * ECG Adaptive Remediation v2 — Closed-Loop Performance-to-Content Routing
 *
 * Analyses a learner's performance across Detective Mode, Deterioration Engine,
 * Telemetry Shift, and Compare & Contrast to generate a prioritised study plan
 * that routes to the specific content (lesson, flashcard, question, simulation)
 * most likely to close the identified gap.
 */

import type { DetectiveSessionScore } from "@/lib/ecg-module/ecg-detective-mode";
import type { EcgReadinessProfile } from "@/lib/ecg-module/ecg-readiness-scoring";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type RemediationContentType =
  | "ecg_lesson"
  | "ecg_flashcard_deck"
  | "practice_question"
  | "detective_session"
  | "compare_contrast"
  | "deterioration_pathway"
  | "telemetry_shift";

export type RemediationItem = {
  contentType: RemediationContentType;
  title: string;
  description: string;
  rhythmKey?: string;
  lessonId?: string;
  flashcardDeckId?: string;
  compareContrastPairId?: string;
  deteriorationPathwayId?: string;
  /** Priority: 1 = highest (do first), 5 = lowest */
  priority: 1 | 2 | 3 | 4 | 5;
  /** Clinical rationale for why this specific gap needs to be addressed */
  clinicalRationale: string;
  /** Estimated time to complete in minutes */
  estimatedMinutes: number;
  /** Which weakness this item addresses */
  addressesGap: string;
};

export type EcgStudyPlan = {
  learnerId: string;
  generatedAt: string;
  /** Total items in the plan */
  totalItems: number;
  /** Items sorted by priority (priority 1 first) */
  items: RemediationItem[];
  /** High-level summary for the learner */
  summary: string;
  /** Primary focus this week */
  weeklyFocus: string;
  /** Estimated total study time in minutes */
  estimatedTotalMinutes: number;
};

// ─── Gap analysis ─────────────────────────────────────────────────────────────

type PerformanceGap = {
  gapId: string;
  rhythmKey?: string;
  domainId?: string;
  stepKey?: string;
  severity: "critical" | "moderate" | "mild";
  description: string;
  evidenceSources: string[];
};

function analyseDetectiveGaps(scores: DetectiveSessionScore[]): PerformanceGap[] {
  const gaps: PerformanceGap[] = [];

  for (const score of scores) {
    if (score.percentScore < 60) {
      gaps.push({
        gapId: `det-${score.rhythmKey}-overall`,
        rhythmKey: score.rhythmKey,
        severity: "critical",
        description: `${score.rhythmKey} overall recognition score below 60% (${score.percentScore}%)`,
        evidenceSources: ["detective_mode"],
      });
    } else if (score.percentScore < 75) {
      gaps.push({
        gapId: `det-${score.rhythmKey}-moderate`,
        rhythmKey: score.rhythmKey,
        severity: "moderate",
        description: `${score.rhythmKey} recognition score ${score.percentScore}% — below mastery threshold`,
        evidenceSources: ["detective_mode"],
      });
    }

    // Domain-specific gaps
    if (score.domainScores.escalation < 70) {
      gaps.push({
        gapId: `esc-${score.rhythmKey}`,
        rhythmKey: score.rhythmKey,
        domainId: "escalation",
        severity: score.domainScores.escalation < 50 ? "critical" : "moderate",
        description: `Escalation decision errors for ${score.rhythmKey} (score: ${score.domainScores.escalation}%)`,
        evidenceSources: ["detective_mode_escalation"],
      });
    }

    if (score.domainScores.medicationSafety < 80) {
      gaps.push({
        gapId: `med-${score.rhythmKey}`,
        rhythmKey: score.rhythmKey,
        domainId: "medication_safety",
        severity: "critical", // medication safety gaps are always critical
        description: `Medication safety error for ${score.rhythmKey} (score: ${score.domainScores.medicationSafety}%) — patient safety risk`,
        evidenceSources: ["detective_mode_medication"],
      });
    }

    // Weak individual steps
    for (const step of score.weakSteps) {
      gaps.push({
        gapId: `step-${score.rhythmKey}-${step}`,
        rhythmKey: score.rhythmKey,
        stepKey: step,
        severity: "mild",
        description: `${step} identification errors on ${score.rhythmKey} strip`,
        evidenceSources: ["detective_mode_step"],
      });
    }
  }

  return gaps;
}

function analyseReadinessGaps(profile: EcgReadinessProfile): PerformanceGap[] {
  const gaps: PerformanceGap[] = [];

  for (const domain of profile.domains) {
    if (domain.score < 60) {
      gaps.push({
        gapId: `domain-${domain.domainId}-critical`,
        domainId: domain.domainId,
        severity: "critical",
        description: `${domain.label} readiness score critically low (${domain.score}%)`,
        evidenceSources: ["readiness_profile"],
      });
    } else if (domain.score < 75) {
      gaps.push({
        gapId: `domain-${domain.domainId}-moderate`,
        domainId: domain.domainId,
        severity: "moderate",
        description: `${domain.label} readiness score below target (${domain.score}%)`,
        evidenceSources: ["readiness_profile"],
      });
    }

    for (const weakRhythm of domain.weakRhythms) {
      gaps.push({
        gapId: `domain-rhythm-${domain.domainId}-${weakRhythm}`,
        rhythmKey: weakRhythm,
        domainId: domain.domainId,
        severity: "moderate",
        description: `${weakRhythm} is a weak rhythm in the ${domain.label} domain`,
        evidenceSources: ["readiness_profile"],
      });
    }
  }

  return gaps;
}

// ─── Remediation item generation ──────────────────────────────────────────────

const RHYTHM_LESSON_MAP: Partial<Record<string, string>> = {
  ventricular_fibrillation: "ecg-lesson-vf",
  ventricular_tachycardia: "ecg-lesson-vt",
  torsades_de_pointes: "ecg-lesson-torsades",
  stemi_pattern: "ecg-lesson-stemi",
  nstemi_pattern: "ecg-lesson-nstemi",
  third_degree_av_block: "ecg-lesson-3rd-degree-block",
  second_degree_type_ii_av_block: "ecg-lesson-mobitz2",
  second_degree_type_i_av_block: "ecg-lesson-mobitz1",
  atrial_fibrillation: "ecg-lesson-afib",
  hyperkalemia_pattern: "ecg-lesson-hyperkalemia",
  hypokalemia_pattern: "ecg-lesson-hypokalemia",
  pea: "ecg-lesson-pea",
  asystole: "ecg-lesson-asystole",
};

const RHYTHM_FLASHCARD_DECK_MAP: Partial<Record<string, string>> = {
  ventricular_tachycardia: "flashcard-deck-vt",
  ventricular_fibrillation: "flashcard-deck-vf",
  atrial_fibrillation: "flashcard-deck-afib",
  stemi_pattern: "flashcard-deck-stemi",
  torsades_de_pointes: "flashcard-deck-torsades",
  second_degree_type_ii_av_block: "flashcard-deck-mobitz2",
  third_degree_av_block: "flashcard-deck-3rd-degree",
  hyperkalemia_pattern: "flashcard-deck-hyperkalemia",
};

const RHYTHM_COMPARE_CONTRAST_MAP: Partial<Record<string, string>> = {
  atrial_fibrillation: "afib-vs-flutter",
  atrial_flutter: "afib-vs-flutter",
  ventricular_tachycardia: "vt-vs-svt",
  svt: "vt-vs-svt",
  pacs: "pac-vs-pvc",
  pvcs: "pac-vs-pvc",
  second_degree_type_i_av_block: "mobitz1-vs-mobitz2",
  second_degree_type_ii_av_block: "mobitz1-vs-mobitz2",
  right_bundle_branch_block: "rbbb-vs-lbbb",
  left_bundle_branch_block: "rbbb-vs-lbbb",
  stemi_pattern: "stemi-vs-nstemi",
  nstemi_pattern: "stemi-vs-nstemi",
  hyperkalemia_pattern: "hyperkalemia-vs-hypokalemia",
  hypokalemia_pattern: "hyperkalemia-vs-hypokalemia",
};

const RHYTHM_DETERIORATION_MAP: Partial<Record<string, string>> = {
  pvcs: "pvc-to-vf",
  ventricular_tachycardia: "pvc-to-vf",
  ventricular_fibrillation: "pvc-to-vf",
  second_degree_type_ii_av_block: "mobitz2-to-chb",
  third_degree_av_block: "mobitz2-to-chb",
  hyperkalemia_pattern: "hyperkalemia-to-pea",
  pea: "hyperkalemia-to-pea",
  pacs: "pac-to-afib",
  atrial_fibrillation: "pac-to-afib",
};

function gapToRemediationItems(gap: PerformanceGap): RemediationItem[] {
  const items: RemediationItem[] = [];
  const rk = gap.rhythmKey;

  const basePriority: 1 | 2 | 3 | 4 | 5 =
    gap.severity === "critical" ? 1 : gap.severity === "moderate" ? 2 : 3;

  // Medication safety gap → lesson + detective mode (safety is always critical priority)
  if (gap.domainId === "medication_safety" && rk) {
    const lessonId = RHYTHM_LESSON_MAP[rk];
    if (lessonId) {
      items.push({
        contentType: "ecg_lesson",
        title: `Review: ${rk.replace(/_/g, " ")} — Medication Safety`,
        description: `Focused lesson review on medication contraindications for ${rk.replace(/_/g, " ")}.`,
        rhythmKey: rk,
        lessonId,
        priority: 1,
        clinicalRationale: gap.description,
        estimatedMinutes: 10,
        addressesGap: gap.gapId,
      });
    }
    items.push({
      contentType: "detective_session",
      title: `Detective Mode: ${rk.replace(/_/g, " ")} (with medication safety focus)`,
      description: `Repeat detective mode session focusing on the medication safety step.`,
      rhythmKey: rk,
      priority: 1,
      clinicalRationale: "Medication safety errors carry patient harm risk — must be resolved before this rhythm is considered mastered.",
      estimatedMinutes: 8,
      addressesGap: gap.gapId,
    });
    return items;
  }

  // Escalation gap → compare & contrast + detective
  if (gap.domainId === "escalation" && rk) {
    items.push({
      contentType: "detective_session",
      title: `Detective Mode: ${rk.replace(/_/g, " ")} (escalation focus)`,
      description: `Re-attempt detective mode with attention to escalation level and first action steps.`,
      rhythmKey: rk,
      priority: basePriority,
      clinicalRationale: `Correct escalation for ${rk.replace(/_/g, " ")} prevents under- or over-treatment.`,
      estimatedMinutes: 8,
      addressesGap: gap.gapId,
    });
    const pathwayId = RHYTHM_DETERIORATION_MAP[rk];
    if (pathwayId) {
      items.push({
        contentType: "deterioration_pathway",
        title: `Deterioration Pathway: ${rk.replace(/_/g, " ")}`,
        description: "Practice escalation timing in a real deterioration scenario.",
        rhythmKey: rk,
        deteriorationPathwayId: pathwayId,
        priority: basePriority,
        clinicalRationale: "Deterioration pathways reinforce correct escalation timing under clinical pressure.",
        estimatedMinutes: 15,
        addressesGap: gap.gapId,
      });
    }
    return items;
  }

  // Overall rhythm recognition gap → lesson + flashcards + detective
  if (rk && !gap.domainId) {
    const lessonId = RHYTHM_LESSON_MAP[rk];
    if (lessonId) {
      items.push({
        contentType: "ecg_lesson",
        title: `Lesson: ${rk.replace(/_/g, " ")}`,
        description: "Complete the core lesson including mechanism, recognition criteria, and nursing priorities.",
        rhythmKey: rk,
        lessonId,
        priority: basePriority,
        clinicalRationale: gap.description,
        estimatedMinutes: 12,
        addressesGap: gap.gapId,
      });
    }

    const deckId = RHYTHM_FLASHCARD_DECK_MAP[rk];
    if (deckId) {
      items.push({
        contentType: "ecg_flashcard_deck",
        title: `Flashcards: ${rk.replace(/_/g, " ")}`,
        description: "Spaced repetition flashcard deck for key rhythm facts.",
        rhythmKey: rk,
        flashcardDeckId: deckId,
        priority: (basePriority + 1) as 1 | 2 | 3 | 4 | 5,
        clinicalRationale: "Flashcards build rapid recognition — essential for clinical environments.",
        estimatedMinutes: 10,
        addressesGap: gap.gapId,
      });
    }

    items.push({
      contentType: "detective_session",
      title: `Detective Mode: ${rk.replace(/_/g, " ")}`,
      description: "Practice full investigation workflow.",
      rhythmKey: rk,
      priority: basePriority,
      clinicalRationale: "Detective mode builds systematic investigation rather than pattern-matching.",
      estimatedMinutes: 8,
      addressesGap: gap.gapId,
    });

    const pairId = RHYTHM_COMPARE_CONTRAST_MAP[rk];
    if (pairId) {
      items.push({
        contentType: "compare_contrast",
        title: `Compare & Contrast: ${pairId.replace(/-/g, " vs ")}`,
        description: "Side-by-side comparison to reinforce visual and clinical differences.",
        rhythmKey: rk,
        compareContrastPairId: pairId,
        priority: (basePriority + 1) as 1 | 2 | 3 | 4 | 5,
        clinicalRationale: "Compare & contrast is the most effective tool for distinguishing look-alike rhythms.",
        estimatedMinutes: 10,
        addressesGap: gap.gapId,
      });
    }
  }

  // Domain gap without specific rhythm → general recommendations
  if (gap.domainId && !rk) {
    const domainToActivity: Partial<Record<string, RemediationItem>> = {
      acls_critical_rhythms: {
        contentType: "deterioration_pathway",
        title: "Deterioration Pathway: PVC → VT → VF",
        description: "Practice the most common ACLS deterioration pathway.",
        deteriorationPathwayId: "pvc-to-vf",
        priority: basePriority,
        clinicalRationale: "ACLS domain weakness indicates critical rhythm management needs reinforcement.",
        estimatedMinutes: 15,
        addressesGap: gap.gapId,
      },
      telemetry_interpretation: {
        contentType: "telemetry_shift",
        title: "Telemetry Shift Simulator",
        description: "Practice multi-patient prioritisation on the telemetry ward.",
        priority: basePriority,
        clinicalRationale: "Telemetry interpretation improves with multi-patient prioritisation practice.",
        estimatedMinutes: 20,
        addressesGap: gap.gapId,
      },
    };
    const activity = domainToActivity[gap.domainId];
    if (activity) items.push(activity);
  }

  return items;
}

// ─── Study plan generation ────────────────────────────────────────────────────

export function generateEcgStudyPlan(
  learnerId: string,
  detectiveScores: DetectiveSessionScore[],
  readinessProfile: EcgReadinessProfile,
): EcgStudyPlan {
  const allGaps = [
    ...analyseDetectiveGaps(detectiveScores),
    ...analyseReadinessGaps(readinessProfile),
  ];

  // De-duplicate gaps by gapId
  const uniqueGaps = allGaps.reduce((acc, gap) => {
    if (!acc.find((g) => g.gapId === gap.gapId)) acc.push(gap);
    return acc;
  }, [] as PerformanceGap[]);

  // Sort by severity: critical first
  const sortedGaps = uniqueGaps.sort((a, b) => {
    const order = { critical: 0, moderate: 1, mild: 2 };
    return order[a.severity] - order[b.severity];
  });

  // Generate remediation items from gaps
  const allItems = sortedGaps.flatMap((gap) => gapToRemediationItems(gap));

  // De-duplicate by (contentType + rhythmKey + lessonId)
  const seen = new Set<string>();
  const uniqueItems = allItems.filter((item) => {
    const key = `${item.contentType}-${item.rhythmKey ?? ""}-${item.lessonId ?? ""}-${item.compareContrastPairId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by priority, then estimated time (shorter first within same priority)
  const sorted = uniqueItems.sort((a, b) =>
    a.priority !== b.priority ? a.priority - b.priority : a.estimatedMinutes - b.estimatedMinutes,
  );

  // Limit to 12 items to keep the plan focused
  const planItems = sorted.slice(0, 12);

  const totalMinutes = planItems.reduce((sum, item) => sum + item.estimatedMinutes, 0);
  const criticalCount = sortedGaps.filter((g) => g.severity === "critical").length;

  const weeklyFocus =
    criticalCount > 0
      ? `Address ${criticalCount} critical gap${criticalCount > 1 ? "s" : ""}: ${sortedGaps.filter((g) => g.severity === "critical").slice(0, 2).map((g) => g.description.slice(0, 40)).join("; ")}`
      : "Strengthen moderate gaps and build mastery across weak rhythms";

  const summary = planItems.length === 0
    ? "No significant gaps identified — continue maintaining mastery with detective mode practice."
    : `${planItems.length} targeted activities address your current gaps. Focus on priority 1 items first — they address the most clinically significant weaknesses.`;

  return {
    learnerId,
    generatedAt: new Date().toISOString(),
    totalItems: planItems.length,
    items: planItems,
    summary,
    weeklyFocus,
    estimatedTotalMinutes: totalMinutes,
  };
}

// ─── Quick remediation lookup ─────────────────────────────────────────────────

/**
 * Returns the single most important next activity for a learner based on
 * their weakest detective session score and domain performance.
 * Used for "What should I do next?" quick recommendations.
 */
export function getNextBestActivity(
  detectiveScores: DetectiveSessionScore[],
  readinessProfile: EcgReadinessProfile,
): RemediationItem | null {
  const plan = generateEcgStudyPlan("anon", detectiveScores, readinessProfile);
  return plan.items[0] ?? null;
}

/**
 * Returns the 3 rhythms most in need of practice, sorted by deficit.
 */
export function getWeakestRhythms(
  detectiveScores: DetectiveSessionScore[],
): string[] {
  return detectiveScores
    .filter((s) => s.percentScore < 85)
    .sort((a, b) => a.percentScore - b.percentScore)
    .slice(0, 3)
    .map((s) => s.rhythmKey);
}
