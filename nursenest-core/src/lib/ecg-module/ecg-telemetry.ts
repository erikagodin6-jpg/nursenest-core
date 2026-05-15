/**
 * ECG Progressive Learning System — client-side telemetry.
 *
 * All events go through trackClientEvent (PostHog). This file:
 *   1. Defines the stable event-name constants so PostHog Insights queries
 *      never need to be updated when display labels change.
 *   2. Provides typed helper functions that enforce required properties and
 *      add common dimensions automatically.
 *   3. Makes every silent-failure mode observable (curriculum misses, API errors).
 *   4. Tracks differential confusion patterns (safety-critical: wrong → wrong
 *      on ACLS-critical rhythms triggers clinical risk alerts).
 *
 * Event naming convention: ecg_{object}_{action}
 *   - Object: scaffold | question | lesson_card | level | api | differential | clinical_risk
 *   - Action: past tense verb (started, completed, skipped, answered, expanded, failed, confused)
 *
 * Dashboard alert thresholds (configure in PostHog Alerts / HogQL):
 *   ecg_curriculum_unit_missing     > 1% of question views → P1 (content gap)
 *   ecg_answer_api_failed           > 2% of submissions    → P1 (API health)
 *   ecg_scaffold_skipped            > 80% per cohort-day   → P2 (pedagogical review)
 *   ecg_question_incorrect          > 70% for any rhythmTag → P2 (content quality)
 *   ecg_scaffold_abandoned          > 60% per cohort-day   → P2 (pacing review)
 *   ecg_differential_confusion      > 5% VT→SVT rate       → P1 (clinical safety)
 *   ecg_clinical_risk_miss          any ACLS-critical pair → P1 (clinical safety)
 */

import { trackClientEvent } from "@/lib/observability/posthog-client";

// ─── Event name constants ──────────────────────────────────────────────────────

export const ECG_EVENTS = {
  // Scaffold lifecycle
  scaffoldStarted: "ecg_scaffold_started",
  scaffoldCompleted: "ecg_scaffold_completed",
  scaffoldSkipped: "ecg_scaffold_skipped",
  scaffoldStepCompleted: "ecg_scaffold_step_completed",
  scaffoldAbandoned: "ecg_scaffold_abandoned",       // partial progress, user left

  // Question submission
  questionAnswered: "ecg_question_answered",
  questionCorrect: "ecg_question_correct",
  questionIncorrect: "ecg_question_incorrect",
  questionTimeExceeded: "ecg_question_time_exceeded", // spent > 3 min on single question

  // Learning review
  lessonCardExpanded: "ecg_lesson_card_expanded",
  lessonCardSectionOpened: "ecg_lesson_card_section_opened",
  lessonCardSectionClosed: "ecg_lesson_card_section_closed",
  rationaleViewed: "ecg_rationale_viewed",
  lessonScrollDepth: "ecg_lesson_scroll_depth",       // 25 / 50 / 75 / 100% thresholds
  lessonRevisited: "ecg_lesson_revisited",            // same lesson card within session

  // Progression
  levelStarted: "ecg_level_started",
  levelCompleted: "ecg_level_completed",
  prerequisiteBypassed: "ecg_prerequisite_bypassed",

  // Differential confusion tracking (safety-critical)
  // Fired when a learner selects wrong_rhythm as their answer for a correct_rhythm question.
  differentialConfusion: "ecg_differential_confusion",

  // Clinical risk — dangerous differential confusion patterns
  // Fired for ACLS-critical pairs where confusion has direct patient harm potential.
  clinicalRiskMiss: "ecg_clinical_risk_miss",

  // Remediation analytics
  remediationAccepted: "ecg_remediation_accepted",    // learner clicked remediation link
  remediationCompleted: "ecg_remediation_completed",  // returned and answered correctly
  remediationRejected: "ecg_remediation_rejected",    // learner dismissed remediation

  // Interpretation quality — measurement accuracy (Part 1 instrumentation)
  // These events separate "lucky MCQ correct" from "true interpretive competency".
  rateMeasurementCompleted: "ecg_rate_measurement_completed",   // learner submitted numerical rate
  rateMeasurementAccuracy: "ecg_rate_measurement_accuracy",     // scored against correct rate
  scaffoldInterpretationScore: "ecg_scaffold_interpretation_score", // weighted scaffold score post-answer
  competencyGapDetected: "ecg_competency_gap_detected",         // high MCQ / low scaffold score mismatch
  confirmedCompetency: "ecg_confirmed_competency",              // scaffold + MCQ both correct

  // Mastery state transitions
  masteryStateChanged: "ecg_mastery_state_changed",   // topic transitioned (learning→proficient, etc.)
  masteryDecayDetected: "ecg_mastery_decay_detected", // proficient/mastered → needs_review
  aclsReadinessChanged: "ecg_acls_readiness_changed", // learner crossed ACLS-readiness threshold
  nclexReadinessChanged: "ecg_nclex_readiness_changed",

  // Degraded / error states (observability events)
  answerApiFailed: "ecg_answer_api_failed",
  curriculumUnitMissing: "ecg_curriculum_unit_missing",
  missingLessonCard: "ecg_missing_lesson_card",
  stripRenderFailed: "ecg_strip_render_failed",       // ECG waveform failed to render
} as const;

export type EcgEventName = (typeof ECG_EVENTS)[keyof typeof ECG_EVENTS];

// ─── Shared dimension type ────────────────────────────────────────────────────

type EcgEventBase = {
  /** ECG rhythm tag from the question record (e.g. "Atrial fibrillation"). */
  rhythm_tag: string;
  /** Level string — "basic" | "advanced". */
  level: string;
  /** Delivery mode — "lessons" | "quizzes" | "video-drills" | "scenarios". */
  mode: string;
  /** Question ID from the ECG question record. */
  question_id?: string;
  /** Whether the learner's most-recent answer was correct. */
  is_correct?: boolean;
};

// ─── Typed event helpers ──────────────────────────────────────────────────────

function track(event: EcgEventName, props: EcgEventBase & Record<string, string | number | boolean | undefined>) {
  void trackClientEvent(event, props);
}

// Scaffold events

export function trackEcgScaffoldStarted(base: EcgEventBase) {
  track(ECG_EVENTS.scaffoldStarted, base);
}

export function trackEcgScaffoldCompleted(
  base: EcgEventBase,
  opts: { stepsCompleted: number; timeOnScaffoldMs: number },
) {
  track(ECG_EVENTS.scaffoldCompleted, {
    ...base,
    steps_completed: opts.stepsCompleted,
    time_on_scaffold_ms: opts.timeOnScaffoldMs,
  });
}

export function trackEcgScaffoldSkipped(
  base: EcgEventBase,
  opts: { stepsCompleted: number },
) {
  track(ECG_EVENTS.scaffoldSkipped, {
    ...base,
    steps_completed_before_skip: opts.stepsCompleted,
  });
}

export function trackEcgScaffoldStepCompleted(
  base: EcgEventBase,
  opts: { stepKey: string; stepIndex: number },
) {
  track(ECG_EVENTS.scaffoldStepCompleted, {
    ...base,
    step_key: opts.stepKey,
    step_index: opts.stepIndex,
  });
}

// Question events

export function trackEcgQuestionAnswered(
  base: EcgEventBase & { question_id: string; is_correct: boolean },
  opts: { scaffoldWasCompleted: boolean; scaffoldWasSkipped: boolean },
) {
  const event = base.is_correct ? ECG_EVENTS.questionCorrect : ECG_EVENTS.questionIncorrect;
  // Fire both the general event and the specific correct/incorrect event
  track(ECG_EVENTS.questionAnswered, {
    ...base,
    scaffold_completed: opts.scaffoldWasCompleted,
    scaffold_skipped: opts.scaffoldWasSkipped,
  });
  track(event, {
    ...base,
    scaffold_completed: opts.scaffoldWasCompleted,
    scaffold_skipped: opts.scaffoldWasSkipped,
  });
}

// Learning review events

export function trackEcgLessonCardExpanded(base: EcgEventBase & { is_correct: boolean }) {
  track(ECG_EVENTS.lessonCardExpanded, base);
}

export function trackEcgLessonCardSectionOpened(
  base: EcgEventBase,
  opts: { sectionTitle: string },
) {
  track(ECG_EVENTS.lessonCardSectionOpened, {
    ...base,
    section_title: opts.sectionTitle,
  });
}

export function trackEcgRationaleViewed(base: EcgEventBase & { is_correct: boolean }) {
  track(ECG_EVENTS.rationaleViewed, base);
}

// Progression events

export function trackEcgLevelStarted(opts: { level: string; mode: string }) {
  track(ECG_EVENTS.levelStarted, {
    rhythm_tag: "",
    level: opts.level,
    mode: opts.mode,
  });
}

// Degraded/failure observability

export function trackEcgAnswerApiFailed(base: EcgEventBase, opts: { httpStatus?: number; errorCode?: string }) {
  track(ECG_EVENTS.answerApiFailed, {
    ...base,
    http_status: opts.httpStatus,
    error_code: opts.errorCode,
  });
}

export function trackEcgCurriculumUnitMissing(
  base: Omit<EcgEventBase, "is_correct">,
  opts: { lookupType: "rhythmTag" | "unitId" },
) {
  track(ECG_EVENTS.curriculumUnitMissing, {
    ...base,
    lookup_type: opts.lookupType,
  });
}

export function trackEcgMissingLessonCard(base: Omit<EcgEventBase, "is_correct">) {
  track(ECG_EVENTS.missingLessonCard, base);
}

// Scaffold abandonment

export function trackEcgScaffoldAbandoned(
  base: EcgEventBase,
  opts: { stepsCompleted: number; lastStepKey: string },
) {
  track(ECG_EVENTS.scaffoldAbandoned, {
    ...base,
    steps_completed_before_abandon: opts.stepsCompleted,
    last_step_key: opts.lastStepKey,
  });
}

// Lesson engagement

export function trackEcgLessonScrollDepth(
  base: Omit<EcgEventBase, "is_correct">,
  opts: { depthPercent: 25 | 50 | 75 | 100 },
) {
  track(ECG_EVENTS.lessonScrollDepth, {
    ...base,
    depth_percent: opts.depthPercent,
  });
}

export function trackEcgLessonRevisited(base: Omit<EcgEventBase, "is_correct">) {
  track(ECG_EVENTS.lessonRevisited, base);
}

export function trackEcgLessonCardSectionClosed(
  base: EcgEventBase,
  opts: { sectionTitle: string; timeOpenMs: number },
) {
  track(ECG_EVENTS.lessonCardSectionClosed, {
    ...base,
    section_title: opts.sectionTitle,
    time_open_ms: opts.timeOpenMs,
  });
}

// Differential confusion tracking

/**
 * CLINICALLY IMPORTANT: fired when a learner selects a wrong rhythm answer.
 * The correct_rhythm / selected_rhythm pair drives the differential confusion matrix
 * and feeds the remediation engine. High-frequency confusion pairs (e.g. VT→SVT)
 * trigger targeted side-by-side comparison lessons.
 */
export function trackEcgDifferentialConfusion(
  base: EcgEventBase & { question_id: string; is_correct: false },
  opts: {
    correctRhythm: string;
    selectedRhythm: string;
    scaffoldCompleted: boolean;
    isClinicalRiskPair: boolean;
  },
) {
  track(ECG_EVENTS.differentialConfusion, {
    ...base,
    correct_rhythm: opts.correctRhythm,
    selected_rhythm: opts.selectedRhythm,
    scaffold_completed: opts.scaffoldCompleted,
    is_clinical_risk_pair: opts.isClinicalRiskPair,
  });

  if (opts.isClinicalRiskPair) {
    track(ECG_EVENTS.clinicalRiskMiss, {
      ...base,
      correct_rhythm: opts.correctRhythm,
      selected_rhythm: opts.selectedRhythm,
      // PostHog alert fires on any ecg_clinical_risk_miss event
    });
  }
}

// Remediation analytics

export function trackEcgRemediationAccepted(
  base: Omit<EcgEventBase, "is_correct">,
  opts: { remediationTopicId: string; triggerRhythm: string },
) {
  track(ECG_EVENTS.remediationAccepted, {
    ...base,
    remediation_topic_id: opts.remediationTopicId,
    trigger_rhythm: opts.triggerRhythm,
  });
}

export function trackEcgRemediationCompleted(
  base: Omit<EcgEventBase, "is_correct">,
  opts: { remediationTopicId: string; improvedScore: boolean },
) {
  track(ECG_EVENTS.remediationCompleted, {
    ...base,
    remediation_topic_id: opts.remediationTopicId,
    improved_score: opts.improvedScore,
  });
}

export function trackEcgRemediationRejected(
  base: Omit<EcgEventBase, "is_correct">,
  opts: { remediationTopicId: string },
) {
  track(ECG_EVENTS.remediationRejected, {
    ...base,
    remediation_topic_id: opts.remediationTopicId,
  });
}

// ─── Interpretation quality events (Part 1 — measurement accuracy) ────────────

/**
 * Fired when the learner submits a numerical rate measurement via EcgRateEntry.
 * Separates measurement behavior from MCQ answer behavior in analytics.
 *
 * PostHog Insights usage:
 *   - Filter by scaffold_completed=true to see interpretation-engaged cohort
 *   - Compare measurement_method distribution vs accuracy to identify which
 *     method (300-rule vs ×6 count) produces better downstream MCQ accuracy
 */
export function trackEcgRateMeasurementCompleted(
  base: EcgEventBase,
  opts: {
    measuredBpm: number;
    method: "rule_of_300" | "six_second_count";
    intermediateValue: number;
  },
) {
  track(ECG_EVENTS.rateMeasurementCompleted, {
    ...base,
    measured_bpm: opts.measuredBpm,
    measurement_method: opts.method,
    intermediate_value: opts.intermediateValue,
  });
}

/**
 * Fired after the answer result arrives, scoring the rate measurement.
 * correctBpm is known from the question metadata or curriculum unit parameters.
 *
 * Alert threshold: avg measurement_accuracy < 0.6 for any rhythmTag → P2
 * (indicates the strip presentation or hint text is misleading learners)
 */
export function trackEcgRateMeasurementAccuracy(
  base: EcgEventBase & { question_id: string },
  opts: {
    measuredBpm: number;
    correctBpm: number;
    measurementAccuracy: number;  // [0–1] from scoreEcgRateMeasurement()
    method: "rule_of_300" | "six_second_count";
  },
) {
  track(ECG_EVENTS.rateMeasurementAccuracy, {
    ...base,
    measured_bpm: opts.measuredBpm,
    correct_bpm: opts.correctBpm,
    measurement_accuracy: opts.measurementAccuracy,
    measurement_method: opts.method,
  });
}

/**
 * Fired at the end of a question with the full interpretation score.
 * Only fired when scaffold was completed — not fired for skipped scaffolds.
 *
 * This is the PRIMARY signal for true interpretive competency.
 * High mcq_correct + low interpretation_score = unverified correct (pattern matching)
 * High mcq_correct + high interpretation_score = confirmed competency
 */
export function trackEcgScaffoldInterpretationScore(
  base: EcgEventBase & { question_id: string; is_correct: boolean },
  opts: {
    interpretationScore: number;       // [0–1] weighted scaffold accuracy
    mcqCorrect: boolean;
    confirmedCompetent: boolean;
    weakestStepKey: string | null;     // The step with the lowest score
  },
) {
  track(ECG_EVENTS.scaffoldInterpretationScore, {
    ...base,
    interpretation_score: opts.interpretationScore,
    mcq_correct: opts.mcqCorrect,
    confirmed_competent: opts.confirmedCompetent,
    weakest_step_key: opts.weakestStepKey ?? "none",
  });

  if (opts.mcqCorrect && !opts.confirmedCompetent) {
    // Unverified correct — high MCQ but low scaffold quality
    track(ECG_EVENTS.competencyGapDetected, {
      ...base,
      interpretation_score: opts.interpretationScore,
      weakest_step_key: opts.weakestStepKey ?? "none",
    });
  }

  if (opts.confirmedCompetent) {
    track(ECG_EVENTS.confirmedCompetency, { ...base });
  }
}

// ─── Mastery state transition events ─────────────────────────────────────────

/**
 * Fired when a topic transitions between mastery states.
 * Drives the learner-facing progress indicators and spaced-repetition queue.
 *
 * PostHog Insights usage:
 *   - Funnel: not_started → learning → proficient → mastered per rhythmTag
 *   - Monitor: struggling → learning transition rate per domain (low = content problem)
 */
export function trackEcgMasteryStateChanged(
  opts: {
    userId: string;
    topicId: string;
    rhythmTag: string;
    previousState: string;
    newState: string;
    accuracyRate: number;
    attemptCount: number;
  },
) {
  track(ECG_EVENTS.masteryStateChanged, {
    rhythm_tag: opts.rhythmTag,
    level: "",
    mode: "",
    topic_id: opts.topicId,
    previous_state: opts.previousState,
    new_state: opts.newState,
    accuracy_rate: opts.accuracyRate,
    attempt_count: opts.attemptCount,
  });
}

/**
 * Fired when ACLS-readiness threshold is crossed (true → false or false → true).
 * High-value event for graduation and certification tracking dashboards.
 */
export function trackEcgAclsReadinessChanged(
  opts: { userId: string; isNowReady: boolean; overallScore: number },
) {
  track(ECG_EVENTS.aclsReadinessChanged, {
    rhythm_tag: "",
    level: "",
    mode: "",
    is_now_ready: opts.isNowReady,
    overall_score: opts.overallScore,
  });
}

// Strip render failure

export function trackEcgStripRenderFailed(
  base: Omit<EcgEventBase, "is_correct">,
  opts: { errorMessage?: string; rhythmKey: string },
) {
  track(ECG_EVENTS.stripRenderFailed, {
    ...base,
    error_message: opts.errorMessage,
    rhythm_key: opts.rhythmKey,
  });
}
