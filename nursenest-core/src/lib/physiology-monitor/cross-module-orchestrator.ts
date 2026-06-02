/**
 * Cross-Module Orchestrator
 *
 * Bridges Physiology Monitor session outcomes to other platform surfaces:
 * flashcards, practice questions, ECG module, telemetry cases, clinical skills,
 * and NGN question sets.
 *
 * The orchestrator reads a MonitorSessionReport and produces a set of
 * OrchestrationActions — specific content routing decisions that integrate
 * with the existing learner platform.
 *
 * Integration points:
 *   - UserRemediationQueue (existing DB model) — writes new remediation rows
 *   - Flashcard tag routing — targets specific flashcard decks by tag
 *   - Practice question routing — targets specific exam topics
 *   - ECG module routing — triggers ECG drill for rhythm failures
 *   - Clinical skills launch — surfaces specific skill scenarios
 *   - NGN question generation — creates post-session reasoning questions
 *
 * Usage:
 *   const actions = buildOrchestrationActions(sessionReport);
 *   // → persist each action via the remediation queue or study plan
 */

import type { NcjmmDomain } from "./clinical-judgment-engine";
import type { HarmLevel } from "./harm-index";
import type { MonitorMode } from "./physiology-state";
import type { MonitorSessionReport } from "./monitor-session-report";

// ─── Action types ─────────────────────────────────────────────────────────────

export type OrchestrationSurface =
  | "flashcards"
  | "practice_questions"
  | "ecg_module"
  | "telemetry_case"
  | "clinical_skills"
  | "ngn_question"
  | "replay"           // direct to replay engine for this session
  | "lesson";

export type OrchestrationTrigger =
  | "harm_event"
  | "weak_ncjmm_domain"
  | "delayed_escalation"
  | "missed_opportunity"
  | "low_composite_score"
  | "specific_condition_weakness"
  | "rhythm_recognition_failure"
  | "alarming_trend";

export interface OrchestrationAction {
  surface: OrchestrationSurface;
  trigger: OrchestrationTrigger;
  priority: 1 | 2 | 3;    // 1 = urgent, 3 = supplementary
  contentTag: string;      // Tag used to find matching content
  label: string;
  reason: string;
  /** Estimated minutes to complete this remediation action. */
  estimatedMinutes: number;
  /** NCJMM domain this action targets. */
  targetDomain?: NcjmmDomain;
  /** Specific condition to replay or drill. */
  conditionKey?: string;
}

// ─── Orchestration result ─────────────────────────────────────────────────────

export interface OrchestrationResult {
  sessionId: string;
  conditionKey: string;
  actions: OrchestrationAction[];
  /** One-sentence summary for display. */
  summary: string;
  /** Total estimated remediation time. */
  totalEstimatedMinutes: number;
  /** Whether any critical harm-safety actions are included. */
  hasCriticalActions: boolean;
}

// ─── Condition → content routing maps ────────────────────────────────────────

const CONDITION_FLASHCARD_TAGS: Record<string, string[]> = {
  stemi:                  ["cardiac-ischemia", "stemi", "ecg-st-elevation"],
  sepsis:                 ["sepsis", "shock", "infection-recognition"],
  septic_shock:           ["septic-shock", "vasopressors", "shock-management"],
  afib_rvr:               ["atrial-fibrillation", "rate-control", "anticoagulation"],
  svt:                    ["svt", "adenosine", "vagal-maneuvers"],
  vt_to_vf:               ["vt", "vf", "acls", "defibrillation"],
  pulmonary_embolism:     ["pe", "dvt", "anticoagulation"],
  ards:                   ["ards", "lung-protective-ventilation", "peep"],
  hyperkalemia:           ["hyperkalemia", "ecg-electrolyte", "calcium-gluconate"],
  dka:                    ["dka", "insulin-drip", "diabetic-emergencies"],
  anaphylaxis:            ["anaphylaxis", "epinephrine", "allergic-reactions"],
  increased_icp:          ["icp", "cushing-reflex", "neuro-assessment"],
  cardiac_tamponade:      ["tamponade", "pericardiocentesis", "beck-triad"],
  tension_pneumothorax:   ["tension-ptx", "needle-decompression"],
  heart_failure:          ["chf", "diuretics", "bipap"],
  gi_bleed:               ["gi-bleed", "massive-transfusion", "hemorrhagic-shock"],
  opioid_toxicity:        ["opioid-toxicity", "naloxone", "respiratory-depression"],
  stroke:                 ["stroke", "cva", "tpa-eligibility"],
  rt_auto_peep:           ["auto-peep", "air-trapping", "ventilator-management"],
  rt_mucus_plug:          ["mucus-plug", "atelectasis", "suctioning"],
  rt_vent_asynchrony:     ["asynchrony", "ventilator-settings", "waveform-interpretation"],
  rt_accidental_extubation: ["extubation", "airway-emergency", "reintubation"],
  acs_differential:       ["acs", "nstemi", "chest-pain-differential"],
  complex_shock:          ["undifferentiated-shock", "shock-differential", "bedside-echo"],
  multi_system_failure:   ["mods", "multiorgan-failure", "palliative-icu"],
  pulmonary_edema:        ["flash-pulmonary-edema", "bipap-initiation"],
};

const DOMAIN_PRACTICE_QUESTION_TAGS: Record<NcjmmDomain, string> = {
  recognize_cues:        "clinical-recognition",
  analyze_cues:          "pathophysiology",
  prioritize_hypotheses: "clinical-prioritization",
  generate_solutions:    "intervention-planning",
  take_action:           "medication-administration",
  evaluate_outcomes:     "reassessment",
};

const HARM_LEVEL_ECG_TAGS: Partial<Record<HarmLevel, string>> = {
  near_miss:          "ecg-recognition-basics",
  moderate:           "ecg-arrhythmia-management",
  severe:             "ecg-life-threatening-rhythms",
  preventable_arrest: "acls-rhythms",
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildOrchestrationActions(
  report: MonitorSessionReport,
): OrchestrationResult {
  const actions: OrchestrationAction[] = [];
  const conditionKey = report.remediationPlan.conditionKey;

  // ── 1. Harm events → immediate replay + targeted content ─────────────────
  if (report.harmIndex.color === "red") {
    actions.push({
      surface: "replay",
      trigger: "harm_event",
      priority: 1,
      contentTag: `session:${report.sessionId}`,
      label: "Review harm events in session replay",
      reason: `Red Harm Index (${report.harmIndex.score}/100) — mandatory review before next session`,
      estimatedMinutes: 8,
    });

    const harmEcgTag = HARM_LEVEL_ECG_TAGS["severe"];
    if (harmEcgTag) {
      actions.push({
        surface: "ecg_module",
        trigger: "harm_event",
        priority: 1,
        contentTag: harmEcgTag,
        label: "Life-threatening rhythm recognition drill",
        reason: "Patient reached critical harm threshold — ECG reinforcement required",
        estimatedMinutes: 12,
      });
    }
  }

  // ── 2. Missed escalation → rapid response drill ───────────────────────────
  if (report.timeToIntervention.escalationTimeSec === null
    || (report.timeToIntervention.escalationTimeSec ?? Infinity) > 180) {
    actions.push({
      surface: "clinical_skills",
      trigger: "delayed_escalation",
      priority: 1,
      contentTag: "rapid-response-activation",
      label: "Rapid Response Activation Drill",
      reason: "Escalation was delayed or absent — practice SBAR and rapid response protocol",
      estimatedMinutes: 10,
      conditionKey,
    });
  }

  // ── 3. Weak NCJMM domains → targeted practice questions ──────────────────
  for (const domain of report.clinicalJudgment.weakDomains) {
    const qTag = DOMAIN_PRACTICE_QUESTION_TAGS[domain];
    actions.push({
      surface: "practice_questions",
      trigger: "weak_ncjmm_domain",
      priority: 2,
      contentTag: qTag,
      label: `${domain.replace(/_/g, " ")} practice set`,
      reason: `NCJMM score of ${report.clinicalJudgment.domainScores[domain].score}/100 — below passing threshold`,
      estimatedMinutes: 15,
      targetDomain: domain,
    });
  }

  // ── 4. Condition-specific flashcards ─────────────────────────────────────
  const flashcardTags = CONDITION_FLASHCARD_TAGS[conditionKey] ?? [];
  if (flashcardTags.length > 0 && report.scores.clinicalJudgment < 70) {
    actions.push({
      surface: "flashcards",
      trigger: "specific_condition_weakness",
      priority: 2,
      contentTag: flashcardTags[0]!,
      label: `${conditionKey.replace(/_/g, " ")} flashcard review`,
      reason: `Clinical judgment score ${report.scores.clinicalJudgment}/100 — reinforce key concepts`,
      estimatedMinutes: 10,
      conditionKey,
    });
  }

  // ── 5. ECG recognition failure (if rhythm-heavy condition) ────────────────
  const rhythmConditions = ["stemi", "afib_rvr", "svt", "vt_to_vf", "hyperkalemia", "acs_differential"];
  if (rhythmConditions.includes(conditionKey) && report.scores.monitorInterpretation < 65) {
    actions.push({
      surface: "ecg_module",
      trigger: "rhythm_recognition_failure",
      priority: 2,
      contentTag: CONDITION_FLASHCARD_TAGS[conditionKey]?.[2] ?? "ecg-recognition",
      label: `${conditionKey.replace(/_/g, " ")} ECG drill`,
      reason: `Monitor interpretation score ${report.scores.monitorInterpretation}/100 — ECG pattern reinforcement needed`,
      estimatedMinutes: 12,
      conditionKey,
    });
  }

  // ── 6. NGN question generation ────────────────────────────────────────────
  if (report.scores.composite >= 60) {
    actions.push({
      surface: "ngn_question",
      trigger: "specific_condition_weakness",
      priority: 3,
      contentTag: `ngn:${conditionKey}`,
      label: `NGN reasoning question — ${conditionKey.replace(/_/g, " ")}`,
      reason: "Test clinical reasoning transfer from simulation to written assessment",
      estimatedMinutes: 8,
      conditionKey,
    });
  }

  // ── 7. Lesson link for below-average performance ──────────────────────────
  if (report.scores.composite < 55) {
    actions.push({
      surface: "lesson",
      trigger: "low_composite_score",
      priority: 2,
      contentTag: flashcardTags[0] ?? conditionKey,
      label: `Review ${conditionKey.replace(/_/g, " ")} lesson`,
      reason: `Composite score ${report.scores.composite}/100 suggests foundational knowledge gap`,
      estimatedMinutes: 15,
      conditionKey,
    });
  }

  // Sort by priority
  actions.sort((a, b) => a.priority - b.priority);

  const totalMinutes = actions.reduce((s, a) => s + a.estimatedMinutes, 0);
  const hasCritical = actions.some((a) => a.priority === 1);

  const summary = hasCritical
    ? `⚠ Critical review required — ${actions.filter((a) => a.priority === 1).length} urgent action(s) identified.`
    : report.scores.composite >= 80
    ? `Good session. ${actions.length} optional reinforcement actions available.`
    : `${actions.length} personalised remediation steps (est. ${totalMinutes} min).`;

  return {
    sessionId: report.sessionId,
    conditionKey,
    actions: actions.slice(0, 8),
    summary,
    totalEstimatedMinutes: totalMinutes,
    hasCriticalActions: hasCritical,
  };
}

// ─── Remediation queue writer ─────────────────────────────────────────────────

/**
 * Converts OrchestrationAction[] into UserRemediationQueue upsert payloads.
 * Caller is responsible for the actual Prisma write.
 */
export function orchestrationActionsToRemediationRows(
  userId: string,
  pathwayId: string,
  actions: OrchestrationAction[],
): Array<{
  userId: string;
  pathwayKey: string;
  topicKey: string;
  bodySystemKey: string;
  priorityScore: number;
  nextReviewAt: Date;
  source: "question";
}> {
  const now = new Date();
  return actions.map((action) => ({
    userId,
    pathwayKey: pathwayId,
    topicKey: action.contentTag.slice(0, 200),
    bodySystemKey: action.conditionKey ?? action.targetDomain ?? "monitor",
    priorityScore: action.priority === 1 ? 100 : action.priority === 2 ? 65 : 35,
    nextReviewAt: new Date(now.getTime() + (action.priority === 1 ? 0 : 24 * 60 * 60 * 1000)),
    source: "question" as const,
  }));
}
