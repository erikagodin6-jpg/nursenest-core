/**
 * Adaptive Learning Orchestrator
 *
 * Expands adaptive-remediation.ts into a full learning queue system.
 * Analyses the LearnerGrowthProfile across all sessions and generates a
 * prioritised, personalised learning queue targeting specific gaps.
 *
 * Queue items are ranked by:
 *   1. Safety urgency (unsafe trends block other progression)
 *   2. NCJMM domain weakness severity
 *   3. Harm pattern recurrence
 *   4. Pathway coverage gaps (conditions not yet attempted)
 *   5. Competency advancement requirements
 */

import type { LearnerGrowthProfile, UnsafeTrend } from "./learner-profile";
import type { NcjmmDomain } from "./clinical-judgment-engine";
import type { SimulationProfession } from "./simulation-catalog";
import { SIMULATION_CATALOG } from "./simulation-catalog";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QueueItemType =
  | "simulation"
  | "ecg_drill"
  | "flashcard_deck"
  | "lesson"
  | "practice_questions"
  | "clinical_skill"
  | "documentation_drill";

export interface LearningQueueItem {
  id: string;
  type: QueueItemType;
  title: string;
  description: string;
  /** Why this item was selected. */
  reason: string;
  /** Content tag or simulation ID. */
  contentRef: string;
  /** 1 = urgent safety gap, 5 = enrichment. */
  priority: 1 | 2 | 3 | 4 | 5;
  /** Estimated completion time in minutes. */
  estimatedMinutes: number;
  /** NCJMM domain this item targets. */
  targetDomain?: NcjmmDomain;
  /** Condition key this item targets (for simulations). */
  conditionKey?: string;
}

export interface OrchestrationResult {
  learnerId: string;
  generatedAt: string;
  totalItems: number;
  urgentItems: number;
  queue: LearningQueueItem[];
  weeklyPlan: WeeklyPlan;
  orchestrationNotes: string[];
}

export interface WeeklyPlan {
  days: DayPlan[];
  totalMinutes: number;
  totalItems: number;
}

export interface DayPlan {
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  label: string;
  items: LearningQueueItem[];
  estimatedMinutes: number;
}

// ─── Domain-to-content mapping ────────────────────────────────────────────────

const DOMAIN_CONTENT_MAP: Record<NcjmmDomain, Array<{ type: QueueItemType; contentRef: string; title: string; minutes: number }>> = {
  recognize_cues: [
    { type: "ecg_drill", contentRef: "rhythm_recognition", title: "ECG Rhythm Recognition Drill", minutes: 10 },
    { type: "flashcard_deck", contentRef: "vital-signs-recognition", title: "Vital Sign Recognition Cards", minutes: 8 },
    { type: "lesson", contentRef: "early-warning-signs", title: "Early Warning Signs Lesson", minutes: 15 },
  ],
  analyze_cues: [
    { type: "lesson", contentRef: "pathophysiology-deterioration", title: "Pathophysiology of Deterioration", minutes: 20 },
    { type: "flashcard_deck", contentRef: "clinical-reasoning-patterns", title: "Clinical Reasoning Pattern Cards", minutes: 10 },
    { type: "practice_questions", contentRef: "analyze-cues-ngn", title: "Analyze Cues NGN Questions", minutes: 15 },
  ],
  prioritize_hypotheses: [
    { type: "practice_questions", contentRef: "prioritization-ngn", title: "Clinical Prioritization Questions", minutes: 15 },
    { type: "simulation", contentRef: "rn-rapid-response", title: "Rapid Response Simulation", minutes: 20 },
  ],
  generate_solutions: [
    { type: "flashcard_deck", contentRef: "treatment-bundles", title: "Treatment Bundle Cards", minutes: 10 },
    { type: "lesson", contentRef: "evidence-based-protocols", title: "Evidence-Based Protocol Review", minutes: 18 },
    { type: "practice_questions", contentRef: "generate-solutions-ngn", title: "Generate Solutions NGN Questions", minutes: 12 },
  ],
  take_action: [
    { type: "simulation", contentRef: "rn-code-blue", title: "Code Blue Timed Simulation", minutes: 20 },
    { type: "clinical_skill", contentRef: "rapid-response-activation", title: "Rapid Response Activation", minutes: 15 },
    { type: "simulation", contentRef: "rn-anaphylaxis", title: "Anaphylaxis Response (Timed)", minutes: 15 },
  ],
  evaluate_outcomes: [
    { type: "practice_questions", contentRef: "evaluate-outcomes-ngn", title: "Outcome Evaluation Questions", minutes: 12 },
    { type: "lesson", contentRef: "trend-interpretation", title: "Trend Interpretation Lesson", minutes: 15 },
    { type: "flashcard_deck", contentRef: "reassessment-protocols", title: "Post-Intervention Reassessment Cards", minutes: 8 },
  ],
};

// ─── Condition-to-content mapping ─────────────────────────────────────────────

const CONDITION_REMEDIATION: Record<string, { simId: string; ecgTag?: string; flashcardTag: string }> = {
  sepsis:              { simId: "rn-sepsis-early",        ecgTag: "sinus_tachycardia",       flashcardTag: "sepsis-bundle" },
  stemi:               { simId: "rn-stemi",               ecgTag: "stemi_pattern",           flashcardTag: "stemi-protocol" },
  afib_rvr:            { simId: "rpn-afib-monitoring",    ecgTag: "atrial_fibrillation",     flashcardTag: "afib-management" },
  svt:                 { simId: "np-stable-vt",           ecgTag: "svt",                     flashcardTag: "svt-adenosine" },
  vt_to_vf:            { simId: "rn-code-blue",           ecgTag: "ventricular_tachycardia", flashcardTag: "acls-vt-vf" },
  hyperkalemia:        { simId: "rn-hyperkalemia",        ecgTag: "hyperkalemia_pattern",    flashcardTag: "hyperkalemia-treatment" },
  ards:                { simId: "rt-ards",                ecgTag: undefined,                 flashcardTag: "ardsnet-protocol" },
  anaphylaxis:         { simId: "rn-anaphylaxis",         ecgTag: undefined,                 flashcardTag: "anaphylaxis-epinephrine" },
  pulmonary_embolism:  { simId: "rn-pe",                  ecgTag: "right_bundle_branch_block", flashcardTag: "pe-anticoagulation" },
  dka:                 { simId: "rn-dka",                 ecgTag: undefined,                 flashcardTag: "dka-management" },
  gi_bleed:            { simId: "rn-gi-bleed",            ecgTag: undefined,                 flashcardTag: "hemorrhage-resuscitation" },
  opioid_toxicity:     { simId: "rn-opioid-toxicity",     ecgTag: undefined,                 flashcardTag: "naloxone-administration" },
};

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export function orchestrateLearningQueue(
  profile: LearnerGrowthProfile,
  profession: SimulationProfession,
  maxItems = 20,
): OrchestrationResult {
  const items: LearningQueueItem[] = [];
  const notes: string[] = [];

  // ── 1. Unsafe trends — priority 1 ───────────────────────────────────────
  for (const unsafe of profile.unsafeTrends) {
    if (unsafe.severity === "critical") {
      items.push({
        id: `unsafe-${unsafe.domain.toLowerCase().replace(/\s/g, "-")}`,
        type: "simulation",
        title: "Safety Remediation: ACLS Protocol",
        description: unsafe.description,
        reason: "Unsafe trend detected — must address before progressing.",
        contentRef: "rn-code-blue",
        priority: 1,
        estimatedMinutes: 20,
        targetDomain: "take_action",
      });
    }
  }

  if (profile.unsafeTrends.some((u) => u.severity === "critical")) {
    notes.push("Safety-critical gaps detected — queue starts with mandatory safety remediation.");
  }

  // ── 2. Weak NCJMM domains — priority 1–2 ────────────────────────────────
  const domains: NcjmmDomain[] = [
    "recognize_cues", "analyze_cues", "prioritize_hypotheses",
    "generate_solutions", "take_action", "evaluate_outcomes",
  ];

  const weakDomains = domains
    .filter((d) => profile.ncjmmTrends[d].rollingAverage < 55)
    .sort((a, b) => profile.ncjmmTrends[a].rollingAverage - profile.ncjmmTrends[b].rollingAverage);

  for (const domain of weakDomains.slice(0, 3)) {
    const contentOptions = DOMAIN_CONTENT_MAP[domain];
    for (const option of contentOptions.slice(0, 2)) {
      items.push({
        id: `domain-${domain}-${option.type}`,
        type: option.type,
        title: option.title,
        description: `Targets weak ${domain.replace(/_/g, " ")} domain (score: ${Math.round(profile.ncjmmTrends[domain].rollingAverage)}/100).`,
        reason: `${domain.replace(/_/g, " ")} is consistently below threshold.`,
        contentRef: option.contentRef,
        priority: profile.ncjmmTrends[domain].rollingAverage < 40 ? 1 : 2,
        estimatedMinutes: option.minutes,
        targetDomain: domain,
      });
    }
  }

  // ── 3. Repeated harm conditions — priority 2 ────────────────────────────
  for (const pattern of profile.harmPatterns.filter((p) => p.isRecurring)) {
    const conditionKey = pattern.conditionKeys[0];
    if (!conditionKey) continue;
    const remediation = CONDITION_REMEDIATION[conditionKey];
    if (remediation) {
      items.push({
        id: `harm-${conditionKey}`,
        type: "simulation",
        title: `Repeat Simulation: ${conditionKey.replace(/_/g, " ")} (Safety Focus)`,
        description: `Harm pattern in ${conditionKey.replace(/_/g, " ")} — repeat with focus on patient safety.`,
        reason: `${pattern.harmLevel.replace(/_/g, " ")} harm events recurring in this condition.`,
        contentRef: remediation.simId,
        priority: 2,
        estimatedMinutes: 20,
        conditionKey,
      });

      if (remediation.ecgTag) {
        items.push({
          id: `ecg-${conditionKey}`,
          type: "ecg_drill",
          title: `ECG Drill: ${remediation.ecgTag.replace(/_/g, " ")}`,
          description: `Reinforce ECG recognition for ${conditionKey.replace(/_/g, " ")}.`,
          reason: "ECG changes in this condition require rapid recognition.",
          contentRef: remediation.ecgTag,
          priority: 2,
          estimatedMinutes: 10,
          conditionKey,
        });
      }
    }
  }

  // ── 4. Conditions not yet attempted — priority 3 ─────────────────────────
  const availableSims = SIMULATION_CATALOG.filter((s) => s.profession.includes(profession));
  const coveredConditions = new Set(profile.conditionsCovered.map((c) => c.toLowerCase()));
  const newConditionSims = availableSims
    .filter((s) => !coveredConditions.has(s.conditionKey))
    .slice(0, 4);

  for (const sim of newConditionSims) {
    items.push({
      id: `new-condition-${sim.id}`,
      type: "simulation",
      title: sim.title,
      description: `New scenario: ${sim.conditionKey.replace(/_/g, " ")}. Not yet attempted.`,
      reason: "Expanding clinical exposure across condition types.",
      contentRef: sim.id,
      priority: 3,
      estimatedMinutes: sim.estimatedMinutes,
      conditionKey: sim.conditionKey,
    });
  }

  // ── 5. Failed simulations — priority 2 ──────────────────────────────────
  for (const failed of profile.simulationsFailed.slice(0, 3)) {
    const sim = availableSims.find((s) => s.conditionKey === failed.toLowerCase());
    if (sim) {
      items.push({
        id: `retry-${sim.id}`,
        type: "simulation",
        title: `Retry: ${sim.title}`,
        description: `Previous attempt scored < 65/100. Retry after targeted review.`,
        reason: "Below-threshold simulation performance requires another attempt.",
        contentRef: sim.id,
        priority: 2,
        estimatedMinutes: sim.estimatedMinutes,
        conditionKey: sim.conditionKey,
      });
    }
  }

  // ── 6. Documentation drill — periodic ───────────────────────────────────
  if (profile.sessionCount % 5 === 0 && profile.sessionCount > 0) {
    items.push({
      id: "documentation-drill",
      type: "documentation_drill",
      title: "Documentation Practice: SBAR + Vital Sign Charting",
      description: "Periodic documentation competency reinforcement.",
      reason: "Documentation is assessed in every session — periodic drill maintains accuracy.",
      contentRef: "documentation-sbar",
      priority: 4,
      estimatedMinutes: 10,
    });
  }

  // ── 7. Enrichment — strong areas to advance ─────────────────────────────
  const strongDomains = domains.filter((d) => profile.ncjmmTrends[d].rollingAverage >= 80);
  if (strongDomains.length > 0 && items.length < maxItems) {
    items.push({
      id: "advanced-simulation",
      type: "simulation",
      title: "Advanced Scenario: NP/ICU Level",
      description: "Challenge scenario for learners performing well in core domains.",
      reason: "Strong performance enables progression to higher-acuity scenarios.",
      contentRef: profession === "NP" ? "np-complex-shock" : "rn-septic-shock",
      priority: 5,
      estimatedMinutes: 30,
    });
  }

  // ── Deduplicate and sort ─────────────────────────────────────────────────
  const seen = new Set<string>();
  const uniqueItems = items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  uniqueItems.sort((a, b) => a.priority - b.priority);
  const finalItems = uniqueItems.slice(0, maxItems);

  // ── Weekly plan ──────────────────────────────────────────────────────────
  const weeklyPlan = buildWeeklyPlan(finalItems);

  if (notes.length === 0) {
    notes.push(`${finalItems.length} items queued targeting ${weakDomains.length} weak NCJMM domains.`);
  }

  return {
    learnerId: profile.learnerId,
    generatedAt: new Date().toISOString(),
    totalItems: finalItems.length,
    urgentItems: finalItems.filter((i) => i.priority === 1).length,
    queue: finalItems,
    weeklyPlan,
    orchestrationNotes: notes,
  };
}

// ─── Weekly plan builder ──────────────────────────────────────────────────────

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const DAY_CAPACITY_MINUTES = [30, 20, 30, 20, 30, 45, 45]; // typical learner capacity per day

function buildWeeklyPlan(items: LearningQueueItem[]): WeeklyPlan {
  const days: DayPlan[] = DAY_LABELS.map((label, i) => ({
    day: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
    label,
    items: [],
    estimatedMinutes: 0,
  }));

  let itemIndex = 0;
  for (let d = 0; d < 7 && itemIndex < items.length; d++) {
    const capacity = DAY_CAPACITY_MINUTES[d]!;
    let used = 0;
    while (itemIndex < items.length && used + items[itemIndex]!.estimatedMinutes <= capacity) {
      const item = items[itemIndex]!;
      days[d]!.items.push(item);
      days[d]!.estimatedMinutes += item.estimatedMinutes;
      used += item.estimatedMinutes;
      itemIndex++;
    }
  }

  return {
    days,
    totalMinutes: days.reduce((a, d) => a + d.estimatedMinutes, 0),
    totalItems: items.length,
  };
}
