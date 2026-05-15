/**
 * ECG Adaptive Remediation Engine
 *
 * This module drives three adaptive behaviors:
 *
 *   1. Differential confusion matrix — maps observed wrong-answer pairs
 *      (correct_rhythm → selected_rhythm) to specific side-by-side review
 *      curriculum units. Prevents silent "saw it wrong, never corrected" failure.
 *
 *   2. Prerequisite surfacing — when a learner misses a complex rhythm, surfaces
 *      the foundational prerequisite topics likely underlying that miss.
 *
 *   3. Clinical risk pair detection — identifies ACLS-critical confusion pairs
 *      where the wrong action could cause direct patient harm. These pairs trigger
 *      PostHog ecg_clinical_risk_miss events (P1 alert threshold).
 *
 * Architecture:
 *   - Pure functions, no state — the caller (quiz engine, remediation API) owns state.
 *   - All topic IDs must be verifiable against ECG_FULL_CURRICULUM via getEcgCurriculumTopic.
 *   - The confusion registry is a typed map, not a runtime database — updates require code
 *     review, which is intentional (clinical accuracy check).
 *
 * Usage:
 *   const recs = getEcgRemediationRecommendations("ventricular_tachycardia", "svt", weaknesses);
 *   for (const rec of recs) display(rec);
 */

import {
  getEcgCurriculumTopic,
  getRelatedEcgConceptUnitIds,
  type EcgCurriculumTopic,
  type EcgRemediationPriority,
} from "@/lib/ecg-module/ecg-curriculum-config";
import { resolveEcgCurriculumUnitIdForTag } from "@/lib/ecg-module/ecg-rhythm-tag-registry";

// ─── Types ─────────────────────────────────────────────────────────────────────

/** A pair of (correct_rhythm_tag, selected_wrong_rhythm_tag). */
export type EcgDifferentialConfusionPair = {
  correctTag: string;
  selectedTag: string;
};

/**
 * A single remediation recommendation produced by the adaptive engine.
 * The quiz UI uses this to surface review material post-answer.
 */
export type EcgRemediationRecommendation = {
  /** Curriculum topic ID to route to. */
  topicId: string;
  /** Human-readable reason shown to the learner. */
  reason: string;
  /** Priority: "critical" recommendations are shown before others. */
  priority: EcgRemediationPriority;
  /** True if this confusion pair has ACLS-critical patient-harm potential. */
  isClinicalRiskPair: boolean;
  /** The full topic for deep-linking. undefined = topic not yet in curriculum (fallback). */
  topic: EcgCurriculumTopic | undefined;
};

/**
 * An observed pattern of learner weakness across multiple questions.
 * Passed to the remediation engine after ≥2 incorrect answers on the same topic.
 */
export type EcgLearnerWeaknessPattern = {
  rhythmTag: string;
  incorrectCount: number;
  totalAttempts: number;
  /** Most common wrong answers (rhythmTag strings), in descending frequency. */
  topWrongAnswers: string[];
};

// ─── Clinical Risk Pair Registry ───────────────────────────────────────────────

/**
 * ACLS-critical confusion pairs where the wrong action would cause direct harm.
 *
 * Rationale for each pair:
 *   VT → SVT: giving adenosine for VT when you think it's SVT is dangerous
 *   VF → artifact: starting CPR vs ignoring alarm depends on correct identification
 *   torsades → polymorphic VT: different first-line therapy (Mg vs amio)
 *   Mobitz II → Mobitz I: Mobitz II requires urgent pacing regardless of symptoms
 *   3rd AV block → junctional: external pacing urgency differs drastically
 *   AFib + WPW → AFib: AV-blocking agents contraindicated in WPW-AFib
 *   PEA → asystole: treatment is identical but the distinction matters for family/code narrative
 *   STEMI → pericarditis: cath lab activation vs observation is the decision
 *   hyperkalemia sine wave → VF: calcium admin first, not defibrillation
 */
const CLINICAL_RISK_PAIRS = new Set<string>([
  "ventricular_tachycardia|svt",
  "svt|ventricular_tachycardia",
  "ventricular_fibrillation|artifact",
  "artifact|ventricular_fibrillation",
  "torsades_de_pointes|ventricular_tachycardia",
  "ventricular_tachycardia|torsades_de_pointes",
  "second_degree_type_ii_av_block|second_degree_type_i_av_block",
  "third_degree_av_block|second_degree_type_i_av_block",
  "third_degree_av_block|second_degree_type_ii_av_block",
  "stemi_pattern|pericarditis",
  "hyperkalemia_pattern|ventricular_fibrillation",
]);

export function isEcgClinicalRiskPair(correctTag: string, selectedTag: string): boolean {
  const normalized = (s: string) =>
    s.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return (
    CLINICAL_RISK_PAIRS.has(`${normalized(correctTag)}|${normalized(selectedTag)}`) ||
    CLINICAL_RISK_PAIRS.has(`${normalized(selectedTag)}|${normalized(correctTag)}`)
  );
}

// ─── Differential Confusion Registry ──────────────────────────────────────────

/**
 * Maps confusion pairs to remediation topic IDs and learner-facing explanations.
 *
 * Registry key: "correct_tag|selected_tag" (lowercase, underscores).
 *
 * The goal is NOT to exhaustively cover every possible confusion pair.
 * The goal is to cover the HIGH-YIELD pairs where:
 *   a) The error is clinically dangerous, OR
 *   b) The pair appears frequently in learner data, OR
 *   c) The differential requires explicit side-by-side teaching to resolve.
 */
type ConfusionRemediationEntry = {
  topicId: string;
  reason: string;
};

const CONFUSION_REMEDIATION_REGISTRY: Record<string, ConfusionRemediationEntry[]> = {
  // ─── VT / SVT ───────────────────────────────────────────────────────────────
  "ventricular_tachycardia|svt": [
    {
      topicId: "qrs",
      reason: "Wide QRS is the key VT discriminator. Review QRS width assessment before applying the Brugada algorithm.",
    },
    {
      topicId: "rhythm-diagnosis",
      reason: "Apply the Brugada 4-step algorithm to all wide-complex tachycardias — default to VT when uncertain.",
    },
  ],
  "svt|ventricular_tachycardia": [
    {
      topicId: "rhythm-diagnosis",
      reason: "SVT is narrow-complex (< 0.12s) and very rapid. Review the rate + QRS width criteria that distinguish it from VT.",
    },
    {
      topicId: "qrs",
      reason: "Wide QRS in a tachycardia rules out typical narrow-complex SVT. Review QRS width measurement.",
    },
  ],

  // ─── AFib ───────────────────────────────────────────────────────────────────
  "atrial_fibrillation|atrial_flutter": [
    {
      topicId: "rhythm",
      reason: "AFib is irregularly irregular with no organized atrial activity. AFib with RVR can mimic regular rhythms — measure R-R intervals.",
    },
    {
      topicId: "p-waves",
      reason: "Flutter waves (sawtooth) are organized atrial activity at 250–350/min. AFib shows only fine fibrillatory baseline.",
    },
  ],
  "atrial_flutter|atrial_fibrillation": [
    {
      topicId: "p-waves",
      reason: "Atrial flutter has organized sawtooth flutter waves at 250–350/min. AFib shows irregular fibrillatory baseline without organized P waves.",
    },
    {
      topicId: "rhythm",
      reason: "Flutter is regularly irregular (fixed 2:1, 3:1, or 4:1 conduction). AFib is irregularly irregular.",
    },
  ],

  // ─── Torsades vs polymorphic VT ─────────────────────────────────────────────
  "torsades_de_pointes|ventricular_tachycardia": [
    {
      topicId: "torsades",
      reason: "Torsades has a twisting axis around the isoelectric line (polymorphic). Monomorphic VT has consistent QRS morphology. The QTc on preceding sinus beats determines management.",
    },
    {
      topicId: "qt-qtc",
      reason: "Torsades requires prolonged QTc on the baseline rhythm. Always measure QTc before and after treatment.",
    },
  ],

  // ─── AV blocks ──────────────────────────────────────────────────────────────
  "second_degree_type_ii_av_block|second_degree_type_i_av_block": [
    {
      topicId: "av-blocks-advanced",
      reason: "Mobitz II has a FIXED PR before the dropped beat. Mobitz I (Wenckebach) has progressive PR lengthening. This distinction determines pacing urgency.",
    },
    {
      topicId: "pr-interval",
      reason: "Progressive PR prolongation is the hallmark of Mobitz I. If PR is constant before a dropped QRS, that is Mobitz II — a more serious block requiring immediate pacing preparation.",
    },
  ],
  "second_degree_type_i_av_block|second_degree_type_ii_av_block": [
    {
      topicId: "pr-interval",
      reason: "Wenckebach (Mobitz I) shows progressive PR lengthening before the dropped beat. Review PR interval measurement across multiple beats.",
    },
    {
      topicId: "av-blocks-advanced",
      reason: "Narrow QRS and progressive PR lengthening favor nodal Mobitz I. Wide QRS before the dropped beat favors infranodal Mobitz II.",
    },
  ],

  // ─── STEMI vs pericarditis ───────────────────────────────────────────────────
  "stemi_pattern|pericarditis": [
    {
      topicId: "stemi-localization",
      reason: "STEMI shows territory-specific ST elevation with reciprocal depression. Pericarditis shows diffuse saddle-shaped elevation without reciprocal changes.",
    },
    {
      topicId: "st-t-changes",
      reason: "Reciprocal ST depression in the anatomically opposite leads is a hallmark of STEMI, not pericarditis. Review the distribution pattern.",
    },
  ],

  // ─── VF vs artifact ─────────────────────────────────────────────────────────
  "ventricular_fibrillation|pvcs": [
    {
      topicId: "rhythm-diagnosis",
      reason: "VF is chaotic with no organized QRS complexes. Frequent PVCs have identifiable wide bizarre QRS with compensatory pauses and a dominant narrow-complex baseline.",
    },
  ],

  // ─── Hyperkalemia ────────────────────────────────────────────────────────────
  "hyperkalemia_pattern|ventricular_fibrillation": [
    {
      topicId: "electrolyte-ecg",
      reason: "Hyperkalemia sine-wave pattern precedes cardiac arrest. IV calcium stabilizes the membrane BEFORE electrical therapy. Do NOT defibrillate a hyperkalemia sine wave as first action.",
    },
    {
      topicId: "rhythm-diagnosis",
      reason: "Review the progression of hyperkalemia ECG changes: peaked T → widened QRS → sine wave → VF. Clinical context (renal history, medications) is essential.",
    },
  ],

  // ─── Bundle branch block ─────────────────────────────────────────────────────
  "bundle_branch_block|ventricular_tachycardia": [
    {
      topicId: "bundle-branch-blocks",
      reason: "BBB with rate-appropriate QRS morphology in a hemodynamically stable patient at normal rates is different from VT. Apply Brugada criteria when uncertain.",
    },
    {
      topicId: "qrs",
      reason: "BBB morphology (LBBB: negative V1, RBBB: RSR' in V1) follows predictable patterns. VT morphology is often bizarre with concordance across precordial leads.",
    },
  ],
};

// ─── Engine Functions ──────────────────────────────────────────────────────────

/**
 * Returns ordered remediation recommendations for a given wrong-answer event.
 *
 * Call this after a learner submits an incorrect answer. The result drives:
 *   1. Immediate post-answer remediation link surfacing
 *   2. The differential confusion PostHog event payload
 *   3. The adaptive queue weighting in the study session
 */
export function getEcgRemediationRecommendations(
  correctRhythm: string,
  selectedRhythm: string,
  weaknesses: EcgLearnerWeaknessPattern[] = [],
): EcgRemediationRecommendation[] {
  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/[\s-]+/g, "_");

  const key = `${normalize(correctRhythm)}|${normalize(selectedRhythm)}`;
  const isClinicalRiskPair = isEcgClinicalRiskPair(correctRhythm, selectedRhythm);
  const registryEntries = CONFUSION_REMEDIATION_REGISTRY[key] ?? [];
  const recs: EcgRemediationRecommendation[] = [];

  // 1. Confusion-specific registered remediation (highest priority)
  for (const entry of registryEntries) {
    const topic = getEcgCurriculumTopic(entry.topicId);
    const topicPriority = topic?.remediationPriority ?? "medium";
    recs.push({
      topicId: entry.topicId,
      reason: entry.reason,
      priority: isClinicalRiskPair ? "critical" : topicPriority,
      isClinicalRiskPair,
      topic,
    });
  }

  // 2. Related concept units from the curriculum (prerequisite surfacing)
  const curriculumUnitId = resolveEcgCurriculumUnitIdForTag(correctRhythm);
  if (curriculumUnitId) {
    const relatedIds = getRelatedEcgConceptUnitIds(curriculumUnitId);
    for (const relId of relatedIds) {
      if (recs.some((r) => r.topicId === relId)) continue;
      const topic = getEcgCurriculumTopic(relId);
      if (!topic) continue;
      recs.push({
        topicId: relId,
        reason: `Foundational concept for ${topic.label} — review before retrying this rhythm.`,
        priority: topic.remediationPriority,
        isClinicalRiskPair: false,
        topic,
      });
    }
  }

  // 3. Weakness-pattern escalation — bump priority if this learner has a pattern
  const weaknessForRhythm = weaknesses.find(
    (w) => normalize(w.rhythmTag) === normalize(correctRhythm),
  );
  if (weaknessForRhythm && weaknessForRhythm.incorrectCount >= 2) {
    for (const rec of recs) {
      if (rec.priority === "medium" || rec.priority === "low") {
        rec.priority = "high";
      }
    }
  }

  // Sort: clinical risk first, then by priority weight
  const priorityWeight: Record<EcgRemediationPriority, number> = {
    critical: 4, high: 3, medium: 2, low: 1,
  };
  return recs.sort((a, b) => {
    if (a.isClinicalRiskPair !== b.isClinicalRiskPair) return a.isClinicalRiskPair ? -1 : 1;
    return (priorityWeight[b.priority] ?? 0) - (priorityWeight[a.priority] ?? 0);
  });
}

/**
 * Returns the learner-facing differential comparison framing text.
 * Displayed above the remediation links to explain WHY this pair is confused.
 *
 * Returns undefined when no specific framing is registered (generic fallback applies).
 */
export function getEcgDifferentialComparisonFraming(
  correctRhythm: string,
  selectedRhythm: string,
): string | undefined {
  const FRAMING: Record<string, string> = {
    "ventricular_tachycardia|svt":
      "VT vs SVT with aberrancy — this is one of the most consequential differentials in telemetry nursing. VT default saves lives.",
    "atrial_fibrillation|atrial_flutter":
      "AFib vs Flutter — both are atrial tachyarrhythmias but with very different atrial rates and management nuances.",
    "torsades_de_pointes|ventricular_tachycardia":
      "Torsades vs polymorphic VT — the QTc on preceding sinus beats determines whether IV magnesium or amiodarone is first-line.",
    "second_degree_type_ii_av_block|second_degree_type_i_av_block":
      "Mobitz II vs Wenckebach — Mobitz II is infranodal and may progress to complete heart block without warning. Atropine is unreliable.",
    "stemi_pattern|pericarditis":
      "STEMI vs pericarditis — one activates the cath lab; the other does not. Reciprocal changes and ST shape are the discriminators.",
    "hyperkalemia_pattern|ventricular_fibrillation":
      "Hyperkalemia sine wave vs VF — calcium chloride stabilizes the membrane in hyperkalemia BEFORE electrical therapy.",
  };

  const normalize = (s: string) => s.trim().toLowerCase().replace(/[\s-]+/g, "_");
  const key = `${normalize(correctRhythm)}|${normalize(selectedRhythm)}`;
  return FRAMING[key] ?? FRAMING[`${normalize(selectedRhythm)}|${normalize(correctRhythm)}`];
}

/**
 * Builds a prerequisite remediation queue for a learner who has established weakness
 * on a given rhythm. Used by the adaptive study session to pre-insert review cards.
 *
 * The queue is ordered: foundational first, then the target rhythm.
 */
export function buildEcgPrerequisiteQueue(
  rhythmTag: string,
  weakness: EcgLearnerWeaknessPattern,
): EcgCurriculumTopic[] {
  const curriculumUnitId = resolveEcgCurriculumUnitIdForTag(rhythmTag);
  if (!curriculumUnitId) return [];

  const topic = getEcgCurriculumTopic(curriculumUnitId);
  if (!topic) return [];

  const queue: EcgCurriculumTopic[] = [];
  const seen = new Set<string>();

  // Add related concept units first (foundational prerequisites)
  for (const relId of getRelatedEcgConceptUnitIds(curriculumUnitId)) {
    if (seen.has(relId)) continue;
    const relTopic = getEcgCurriculumTopic(relId);
    if (relTopic) {
      queue.push(relTopic);
      seen.add(relId);
    }
  }

  // Add declared prerequisites
  for (const prereqId of topic.prerequisites) {
    if (seen.has(prereqId)) continue;
    const prereqTopic = getEcgCurriculumTopic(prereqId);
    if (prereqTopic) {
      queue.push(prereqTopic);
      seen.add(prereqId);
    }
  }

  // Add the target topic last
  if (!seen.has(curriculumUnitId)) {
    queue.push(topic);
  }

  return queue;
}

// ─── Known Confusion Pairs Export ─────────────────────────────────────────────

/** All confusion pairs registered in the remediation engine, for testing and audit. */
export const KNOWN_ECG_CONFUSION_PAIRS: ReadonlyArray<EcgDifferentialConfusionPair> =
  Object.keys(CONFUSION_REMEDIATION_REGISTRY).map((key) => {
    const [correctTag, selectedTag] = key.split("|") as [string, string];
    return { correctTag, selectedTag };
  });

// ─── Confusion Frequency Tracker ──────────────────────────────────────────────

/**
 * Tracks how often each confusion pair occurs in a learner's session.
 * Immutable record — the caller accumulates these; this module computes from them.
 */
export type EcgConfusionFrequencyRecord = {
  /** Normalized "correct_tag|selected_tag" key. */
  pairKey: string;
  correctTag: string;
  selectedTag: string;
  occurrences: number;
  isClinicalRiskPair: boolean;
};

/**
 * Aggregates raw wrong-answer events into a frequency map.
 * Input: array of {correctRhythm, selectedRhythm} events.
 * Returns: sorted by occurrences descending.
 *
 * Use this to identify which confusion pairs appear most in a learner's history
 * and prioritize those for targeted remediation.
 */
export function aggregateEcgConfusionFrequency(
  events: ReadonlyArray<{ correctRhythm: string; selectedRhythm: string }>,
): EcgConfusionFrequencyRecord[] {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/[\s-]+/g, "_");
  const map = new Map<string, EcgConfusionFrequencyRecord>();

  for (const ev of events) {
    const ct = normalize(ev.correctRhythm);
    const st = normalize(ev.selectedRhythm);
    const key = `${ct}|${st}`;
    const existing = map.get(key);
    if (existing) {
      existing.occurrences += 1;
    } else {
      map.set(key, {
        pairKey: key,
        correctTag: ct,
        selectedTag: st,
        occurrences: 1,
        isClinicalRiskPair: isEcgClinicalRiskPair(ct, st),
      });
    }
  }

  return [...map.values()].sort((a, b) => {
    // Clinical risk pairs always rank first regardless of frequency
    if (a.isClinicalRiskPair !== b.isClinicalRiskPair) {
      return a.isClinicalRiskPair ? -1 : 1;
    }
    return b.occurrences - a.occurrences;
  });
}

/**
 * Returns the top confusion pairs for a learner that cross a frequency threshold.
 * Used to drive the "Your top differential challenges" feature in the progress view.
 */
export function getTopEcgConfusionPairs(
  events: ReadonlyArray<{ correctRhythm: string; selectedRhythm: string }>,
  opts: { minOccurrences?: number; maxResults?: number } = {},
): EcgConfusionFrequencyRecord[] {
  const { minOccurrences = 1, maxResults = 5 } = opts;
  return aggregateEcgConfusionFrequency(events)
    .filter((r) => r.occurrences >= minOccurrences)
    .slice(0, maxResults);
}

// ─── STEMI/BER and additional confusion pairs ─────────────────────────────────
// These are appended to the registry via a post-declaration merge to keep the
// primary registry readable.

const ADDITIONAL_CONFUSION_ENTRIES: typeof CONFUSION_REMEDIATION_REGISTRY = {
  // ─── STEMI vs benign early repolarization (BER) ────────────────────────────
  // BER is not a rhythm-template rhythmKey but appears as a learner answer choice.
  // The remediation routes to stemi-localization for comparison teaching.
  "stemi_pattern|benign_early_repolarization": [
    {
      topicId: "stemi-localization",
      reason:
        "STEMI vs BER: STEMI has territory-specific distribution and reciprocal depression. " +
        "BER shows diffuse concave ST elevation without reciprocal changes, typically in young patients.",
    },
    {
      topicId: "st-t-changes",
      reason:
        "ST shape is the primary discriminator: BER shows a 'fish-hook' J-point notch with " +
        "concave upsloping. STEMI shows convex (dome-shaped) or flat ST elevation.",
    },
  ],
  "benign_early_repolarization|stemi_pattern": [
    {
      topicId: "stemi-localization",
      reason:
        "Early repolarization can mimic STEMI. Review the distribution (BER is diffuse; " +
        "STEMI is in a coronary territory) and presence of reciprocal depression.",
    },
  ],

  // ─── SVT vs sinus tachycardia ───────────────────────────────────────────────
  "svt|sinus_tachycardia": [
    {
      topicId: "rate",
      reason:
        "SVT typically starts abruptly (paroxysmal) and exceeds 150 BPM. Sinus tachycardia " +
        "has a gradual onset with identifiable P-waves and a rate that reflects the physiologic cause.",
    },
    {
      topicId: "p-waves",
      reason:
        "In SVT, P-waves are absent, hidden, or retrograde. In sinus tachycardia, each QRS " +
        "is preceded by an upright P-wave in lead II.",
    },
  ],
  "sinus_tachycardia|svt": [
    {
      topicId: "p-waves",
      reason:
        "Sinus tachycardia has identifiable sinus P-waves before every QRS. SVT buries P-waves " +
        "in the T-wave or after the QRS. Check for abrupt onset which suggests SVT.",
    },
  ],

  // ─── PEA vs asystole ──────────────────────────────────────────────────────
  "pea|asystole": [
    {
      topicId: "rhythm-diagnosis",
      reason:
        "PEA has organized electrical activity on the monitor but NO pulse. Asystole is flat. " +
        "BOTH are treated with CPR + epinephrine and reversible cause search — the distinction " +
        "matters for prognosis and family communication, not immediate ACLS action.",
    },
  ],

  // ─── Paced rhythm vs VT ───────────────────────────────────────────────────
  "paced_rhythm|ventricular_tachycardia": [
    {
      topicId: "qrs",
      reason:
        "Paced rhythm has visible pacer spikes before each wide QRS. VT has no pacer spikes. " +
        "The pacer spike is the key discriminator — always look for it in wide-complex rhythms.",
    },
    {
      topicId: "paced-rhythms",
      reason:
        "Review paced rhythm morphology: the paced QRS is LBBB-type. Failure to recognize " +
        "pacemaker spikes leads to unnecessary interventions in pacemaker-dependent patients.",
    },
  ],
};

// Merge additional entries into the confusion registry.
// CONFUSION_REMEDIATION_REGISTRY is a const, so we merge at module level.
Object.assign(CONFUSION_REMEDIATION_REGISTRY, ADDITIONAL_CONFUSION_ENTRIES);

// ─── Mastery-aware recommendation enrichment ──────────────────────────────────

import type { EcgMasteryRecord } from "@/lib/ecg-module/ecg-learner-mastery";
import { shouldSurfaceRemediation, getMasteryQueueWeight } from "@/lib/ecg-module/ecg-learner-mastery";

/**
 * Enriches remediation recommendations with learner mastery context.
 * If the learner is in "struggling" state, escalates recommendation priority.
 * If mastery record says remediation should not be shown yet, filters to critical-only.
 *
 * Call this after `getEcgRemediationRecommendations()` to apply mastery-state gating.
 */
export function applyMasteryContextToRecommendations(
  recommendations: EcgRemediationRecommendation[],
  masteryRecord: EcgMasteryRecord | null | undefined,
): EcgRemediationRecommendation[] {
  if (!masteryRecord) return recommendations;

  const shouldShow = shouldSurfaceRemediation(masteryRecord);
  if (!shouldShow) {
    // Learner hasn't shown a pattern yet — only show clinical risk items
    return recommendations.filter((r) => r.isClinicalRiskPair);
  }

  // Escalate priority for struggling learners
  if (masteryRecord.state === "struggling") {
    return recommendations.map((r) => ({
      ...r,
      priority: r.priority === "medium" || r.priority === "low"
        ? ("high" as const)
        : r.priority,
    }));
  }

  return recommendations;
}

/**
 * Scores an adaptive study queue using combined mastery weight and confusion frequency.
 * Higher score = appears earlier in the next study session.
 */
export function scoreEcgAdaptiveQueueEntry(
  rhythmTag: string,
  masteryRecord: EcgMasteryRecord | null | undefined,
  confusionFrequency: number,
): number {
  const masteryWeight = masteryRecord
    ? getMasteryQueueWeight(masteryRecord.state)
    : 4; // not_started weight
  const confusionBoost = Math.min(confusionFrequency, 5) * 1.5;
  return masteryWeight + confusionBoost;
}
