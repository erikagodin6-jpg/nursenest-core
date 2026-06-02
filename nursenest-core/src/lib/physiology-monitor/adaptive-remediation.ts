/**
 * Adaptive Remediation Engine
 *
 * Analyses weak NCJMM domains, harm events, and competency gaps from a
 * monitor session, then generates a Personalized Remediation Plan routing
 * the learner to specific content on each platform surface.
 *
 * Content routing surfaces:
 *   - lessons      → structured lesson content
 *   - flashcards   → targeted concept cards
 *   - questions    → practice question sets
 *   - simulations  → full scenario simulations
 *   - ecg          → ECG-specific cases and drills
 *   - clinical_skills → procedure/assessment simulations
 *
 * Each recommendation carries:
 *   - surface: where to send the learner
 *   - tag / contentRef: what content to show (matches existing tag taxonomy)
 *   - reason: shown to learner explaining why this is recommended
 *   - priority: 1 (urgent) – 3 (supplementary)
 */

import type { NcjmmDomain } from "./clinical-judgment-engine";
import type { HarmLevel } from "./harm-index";
import type { MonitorMode } from "./physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RemediationSurface =
  | "lessons"
  | "flashcards"
  | "questions"
  | "simulations"
  | "ecg"
  | "clinical_skills";

export interface RemediationItem {
  surface: RemediationSurface;
  /** Tag or content reference — matches existing flashcard/question/lesson taxonomy. */
  contentTag: string;
  /** Human-readable label shown to learner. */
  label: string;
  /** Why this is being recommended. */
  reason: string;
  priority: 1 | 2 | 3;
}

export interface PersonalisedRemediationPlan {
  conditionKey: string;
  mode: MonitorMode;
  items: RemediationItem[];
  /** 1–3 sentence summary shown at top of plan. */
  planSummary: string;
  /** Estimated time to complete plan (minutes). */
  estimatedMinutes: number;
}

// ─── Condition → content tag maps ─────────────────────────────────────────────

const CONDITION_LESSON_TAGS: Record<string, string[]> = {
  sepsis:              ["sepsis", "shock", "infection", "vasopressors"],
  stemi:               ["stemi", "acs", "ischemia", "cardiac"],
  afib_rvr:            ["atrial-fibrillation", "arrhythmia", "rate-control"],
  svt:                 ["svt", "tachycardia", "adenosine", "cardioversion"],
  vt_to_vf:            ["ventricular-tachycardia", "vf", "acls", "defibrillation"],
  pulmonary_embolism:  ["pulmonary-embolism", "shock", "anticoagulation"],
  ards:                ["ards", "respiratory-failure", "ventilator", "peep"],
  hyperkalemia:        ["hyperkalemia", "electrolytes", "renal"],
  dka:                 ["dka", "diabetes", "metabolic-acidosis"],
  anaphylaxis:         ["anaphylaxis", "epinephrine", "shock"],
  increased_icp:       ["icp", "neurologic", "brain-herniation"],
  cardiac_tamponade:   ["tamponade", "pericardial", "obstructive-shock"],
  tension_pneumothorax:["pneumothorax", "chest-trauma", "obstructive-shock"],
  heart_failure:       ["heart-failure", "pulmonary-edema", "diuretics"],
  gi_bleed:            ["gi-bleed", "hemorrhage", "hypovolemia"],
  opioid_toxicity:     ["opioid-toxicity", "naloxone", "respiratory-depression"],
  stroke:              ["stroke", "neurologic", "tpa", "nihss"],
  rt_auto_peep:        ["auto-peep", "ventilator", "copd", "air-trapping"],
  rt_mucus_plug:       ["airway", "suction", "ventilator"],
  rt_vent_asynchrony:  ["patient-ventilator-asynchrony", "sedation", "ventilator"],
  rt_accidental_extubation: ["accidental-extubation", "airway-emergency", "reintubation"],
};

const CONDITION_ECG_TAGS: Record<string, string[]> = {
  stemi:          ["stemi_pattern", "ischemia_stemi"],
  afib_rvr:       ["atrial_fibrillation"],
  svt:            ["svt"],
  vt_to_vf:       ["ventricular_tachycardia", "ventricular_fibrillation", "acls_critical_rhythms"],
  hyperkalemia:   ["hyperkalemia_pattern", "electrolyte_abnormalities"],
  pulmonary_embolism: ["right_bundle_branch_block"],
  cardiac_tamponade:  ["rhythm_recognition"],
  increased_icp:  ["sinus_bradycardia", "third_degree_av_block"],
  sepsis:         ["sinus_tachycardia"],
  dka:            ["hyperkalemia_pattern"],
};

// ─── NCJMM domain → content surface map ──────────────────────────────────────

const DOMAIN_SURFACE_MAP: Record<NcjmmDomain, RemediationSurface[]> = {
  recognize_cues:        ["lessons", "flashcards", "ecg"],
  analyze_cues:          ["lessons", "questions", "flashcards"],
  prioritize_hypotheses: ["questions", "simulations"],
  generate_solutions:    ["lessons", "flashcards", "clinical_skills"],
  take_action:           ["simulations", "clinical_skills", "ecg"],
  evaluate_outcomes:     ["questions", "simulations"],
};

// ─── Harm level → remediation urgency ────────────────────────────────────────

const HARM_PRIORITY: Record<HarmLevel, 1 | 2 | 3> = {
  none:               3,
  near_miss:          2,
  moderate:           2,
  severe:             1,
  preventable_arrest: 1,
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export interface RemediationInput {
  conditionKey: string;
  mode: MonitorMode;
  weakNcjmmDomains: NcjmmDomain[];
  worstHarmLevel: HarmLevel;
  overallJudgmentScore: number;
  missedInterventions: string[];
}

export function buildRemediationPlan(input: RemediationInput): PersonalisedRemediationPlan {
  const {
    conditionKey,
    mode,
    weakNcjmmDomains,
    worstHarmLevel,
    overallJudgmentScore,
    missedInterventions,
  } = input;

  const items: RemediationItem[] = [];
  const harmPriority = HARM_PRIORITY[worstHarmLevel];
  const conditionTags = CONDITION_LESSON_TAGS[conditionKey] ?? ["critical-care"];
  const ecgTags = CONDITION_ECG_TAGS[conditionKey] ?? [];

  // ── 1. Condition-specific lesson ────────────────────────────────────────────
  items.push({
    surface: "lessons",
    contentTag: conditionTags[0]!,
    label: `Review: ${conditionTags[0]!.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    reason: `Core pathophysiology review for this scenario.`,
    priority: harmPriority,
  });

  // ── 2. ECG remediation if ECG findings were involved ──────────────────────
  if (ecgTags.length > 0) {
    items.push({
      surface: "ecg",
      contentTag: ecgTags[0]!,
      label: `ECG Drill: ${ecgTags[0]!.replace(/_/g, " ")}`,
      reason: "ECG recognition is critical for timely diagnosis in this condition.",
      priority: weakNcjmmDomains.includes("recognize_cues") ? 1 : 2,
    });
  }

  // ── 3. Weak NCJMM domain remediation ──────────────────────────────────────
  for (const domain of weakNcjmmDomains.slice(0, 3)) {
    const surfaces = DOMAIN_SURFACE_MAP[domain];
    const primarySurface = surfaces[0]!;

    switch (domain) {
      case "recognize_cues":
        items.push({
          surface: "flashcards",
          contentTag: `${conditionTags[0]!}-recognition`,
          label: "Flashcards: Clinical Recognition Cues",
          reason: "Practice identifying abnormal findings rapidly.",
          priority: 1,
        });
        break;

      case "analyze_cues":
        items.push({
          surface: "lessons",
          contentTag: `${conditionTags[0]!}-pathophysiology`,
          label: "Lesson: Pathophysiology & Pattern Analysis",
          reason: "Understanding the mechanism strengthens interpretation accuracy.",
          priority: 2,
        });
        break;

      case "prioritize_hypotheses":
        items.push({
          surface: "questions",
          contentTag: `${conditionTags[0]!}-prioritization`,
          label: "Practice Questions: Clinical Prioritization",
          reason: "NGN-format prioritization questions build hypothesis ranking.",
          priority: 2,
        });
        break;

      case "generate_solutions":
        items.push({
          surface: "flashcards",
          contentTag: `${conditionTags[1] ?? conditionTags[0]!}-treatment`,
          label: "Flashcards: Treatment Bundle",
          reason: "Memorize evidence-based treatment protocols for rapid recall.",
          priority: 2,
        });
        break;

      case "take_action":
        items.push({
          surface: "simulations",
          contentTag: conditionKey,
          label: "Simulation: Repeat Scenario (Timed)",
          reason: "Practice applying interventions within optimal time windows.",
          priority: harmPriority,
        });
        break;

      case "evaluate_outcomes":
        items.push({
          surface: "questions",
          contentTag: `${conditionTags[0]!}-evaluation`,
          label: "Practice Questions: Outcome Evaluation",
          reason: "Develops post-intervention reassessment and trend interpretation.",
          priority: 2,
        });
        break;
    }
  }

  // ── 4. Missed intervention flashcards ─────────────────────────────────────
  if (missedInterventions.length > 0) {
    items.push({
      surface: "flashcards",
      contentTag: "interventions-pharmacology",
      label: `Flashcards: ${missedInterventions.map((k) => k.replace(/_/g, " ")).join(", ")}`,
      reason: "Indicated interventions were not applied. Review indication and mechanism.",
      priority: 1,
    });
  }

  // ── 5. Mode-specific clinical skills ──────────────────────────────────────
  if (mode === "rt" && (conditionKey.startsWith("rt_") || conditionKey === "ards")) {
    items.push({
      surface: "clinical_skills",
      contentTag: "ventilator-management",
      label: "Clinical Skill: Ventilator Management",
      reason: "RT-specific hands-on ventilator troubleshooting.",
      priority: 2,
    });
  }

  if (mode === "np") {
    items.push({
      surface: "questions",
      contentTag: `${conditionTags[0]!}-differential`,
      label: "NP: Differential Diagnosis Questions",
      reason: "Advanced diagnostic reasoning for NP-level clinical judgment.",
      priority: 2,
    });
  }

  // ── 6. ACLS / emergency remediation for arrest scenarios ─────────────────
  if (worstHarmLevel === "preventable_arrest") {
    items.push({
      surface: "simulations",
      contentTag: "acls",
      label: "ACLS Simulation: Cardiac Arrest Scenario",
      reason: "Preventable arrest occurred. ACLS algorithm rehearsal is required.",
      priority: 1,
    });
  }

  // ── 7. Rapid response for high-harm scenarios ─────────────────────────────
  if (harmPriority === 1) {
    items.push({
      surface: "clinical_skills",
      contentTag: "rapid-response",
      label: "Clinical Skill: Rapid Response Activation",
      reason: "Escalation skills need development for this severity of deterioration.",
      priority: 1,
    });
  }

  // Deduplicate by contentTag
  const seen = new Set<string>();
  const uniqueItems = items.filter((item) => {
    const key = `${item.surface}:${item.contentTag}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: priority 1 first, then by surface
  uniqueItems.sort((a, b) => a.priority - b.priority);

  const estimatedMinutes = uniqueItems.reduce((acc, item) => {
    return acc + (item.surface === "simulations" ? 20 : item.surface === "lessons" ? 15 : 8);
  }, 0);

  return {
    conditionKey,
    mode,
    items: uniqueItems,
    planSummary: buildPlanSummary(overallJudgmentScore, weakNcjmmDomains, worstHarmLevel, conditionKey),
    estimatedMinutes,
  };
}

function buildPlanSummary(
  score: number,
  weakDomains: NcjmmDomain[],
  harmLevel: HarmLevel,
  conditionKey: string,
): string {
  const parts: string[] = [];
  if (harmLevel === "preventable_arrest" || harmLevel === "severe") {
    parts.push("This remediation plan addresses critical gaps identified in patient safety.");
  } else if (score < 60) {
    parts.push("Targeted remediation to build clinical judgment competency.");
  } else {
    parts.push("Reinforcement plan to consolidate developing skills.");
  }

  if (weakDomains.length > 0) {
    parts.push(`Focus areas: ${weakDomains.slice(0, 2).map((d) => d.replace(/_/g, " ")).join(", ")}.`);
  }

  parts.push("Complete in order — priority 1 items first.");
  return parts.join(" ");
}
