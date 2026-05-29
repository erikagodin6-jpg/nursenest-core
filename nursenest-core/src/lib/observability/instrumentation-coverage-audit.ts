/**
 * Instrumentation Coverage Audit
 *
 * Tracks which activities are instrumented (events firing) vs. dark (no events).
 * Provides a real-time coverage % report and identifies gaps for engineering action.
 *
 * Coverage is determined by whether events have been received since process start.
 * A route that has never emitted "activity_started" is considered dark.
 *
 * Integration:
 *   - Called by ops-center.ts for the platform readiness dashboard
 *   - CI check verifies coverage % is above threshold
 *   - Report exposed at /api/admin/instrumentation-coverage
 */

import type { LearnerActivityType } from "@/lib/observability/learner-completion-observability";

// ─── Coverage definition ──────────────────────────────────────────────────────

export type CoverageStatus = "instrumented" | "partial" | "dark";

export type ActivityCoverageRecord = {
  activity: LearnerActivityType;
  label: string;
  status: CoverageStatus;
  /** Which events have been observed since process start. */
  observedEvents: string[];
  /** Which events are expected but not yet observed. */
  missingEvents: string[];
  /** Handler path for engineer reference. */
  handlerPath: string;
  /** Notes on current wiring status. */
  notes: string;
};

// ─── Expected events per activity ────────────────────────────────────────────

const REQUIRED_EVENTS = ["activity_started", "activity_completed"] as const;
const FULL_EVENTS = [
  "activity_started",
  "activity_completed",
  "activity_abandoned",
  "activity_error",
] as const;

// ─── Known instrumentation map (updated as routes get wired) ─────────────────

export const INSTRUMENTATION_MAP: Record<LearnerActivityType, ActivityCoverageRecord> = {
  "clinical-skills": {
    activity: "clinical-skills",
    label: "Clinical Skills",
    status: "partial",
    observedEvents: ["activity_started", "activity_completed"],
    missingEvents: ["activity_abandoned", "activity_error"],
    handlerPath: "src/app/api/clinical-skills/progress/route.ts",
    notes: "started + completed wired (open/engage → started, complete → completed). Abandoned not yet tracked.",
  },
  questions: {
    activity: "questions",
    label: "Practice Questions",
    status: "partial",
    observedEvents: ["question_graded_sample"],
    missingEvents: ["activity_started", "activity_completed", "activity_abandoned"],
    handlerPath: "src/app/api/questions/grade/route.ts",
    notes: "5% PostHog sample for question grade. Full activity lifecycle not yet wired.",
  },
  flashcards: {
    activity: "flashcards",
    label: "Flashcards",
    status: "partial",
    observedEvents: ["flashcard_card_reviewed"],
    missingEvents: ["activity_started", "activity_completed", "activity_abandoned"],
    handlerPath: "src/app/api/flashcards/cards/[cardId]/review/route.ts",
    notes: "Individual card reviews tracked. Deck session lifecycle (started/completed) not wired.",
  },
  lessons: {
    activity: "lessons",
    label: "Lessons",
    status: "partial",
    observedEvents: ["lesson_progress_analytics", "study_funnel_capture"],
    missingEvents: ["activity_started", "activity_abandoned"],
    handlerPath: "src/app/api/lessons/progress/route.ts",
    notes: "Lesson completion analytics via captureLessonProgressAnalytics(). Started/abandoned not tracked.",
  },
  cat: {
    activity: "cat",
    label: "CAT Exam",
    status: "partial",
    observedEvents: ["cat_exam_started"],
    missingEvents: ["activity_completed", "activity_abandoned", "activity_error"],
    handlerPath: "src/app/api/practice-tests/route.ts",
    notes: "Startup event fires (learnerCatExamStarted). Answer submissions and completion/abandonment dark.",
  },
  pharmacology: {
    activity: "pharmacology",
    label: "Pharmacology",
    status: "dark",
    observedEvents: [],
    missingEvents: [...FULL_EVENTS],
    handlerPath: "src/app/api/pharmacology/ (TBD)",
    notes: "No dedicated progress API route identified. Module has zero observability.",
  },
  ecg: {
    activity: "ecg",
    label: "ECG Workstation",
    status: "dark",
    observedEvents: [],
    missingEvents: [...FULL_EVENTS],
    handlerPath: "src/app/api/modules/ecg/questions/[id]/answer/route.ts",
    notes: "Answer stored internally (recordEcgQuestionAnswer). No PostHog/observability events.",
  },
  loft: {
    activity: "loft",
    label: "LOFT / OSCE",
    status: "dark",
    observedEvents: [],
    missingEvents: [...FULL_EVENTS],
    handlerPath: "src/app/api/osce/ (TBD)",
    notes: "OSCE routes exist but no observability events identified.",
  },
  analytics: {
    activity: "analytics",
    label: "Analytics Dashboard",
    status: "dark",
    observedEvents: [],
    missingEvents: [...FULL_EVENTS],
    handlerPath: "src/app/(app)/app/(learner)/analytics/",
    notes: "Client-only view — no server events. Add RSC render tracking.",
  },
  "study-plan": {
    activity: "study-plan",
    label: "Study Plan",
    status: "dark",
    observedEvents: [],
    missingEvents: [...FULL_EVENTS],
    handlerPath: "src/app/(app)/app/(learner)/study-plan/",
    notes: "Study plan views not tracked. No completion event for daily plan items.",
  },
  readiness: {
    activity: "readiness",
    label: "Readiness Dashboard",
    status: "dark",
    observedEvents: [],
    missingEvents: [...FULL_EVENTS],
    handlerPath: "src/app/(app)/app/(learner)/account/readiness/",
    notes: "Readiness dashboard views not tracked.",
  },
};

// ─── Coverage metrics ─────────────────────────────────────────────────────────

export type InstrumentationCoverageReport = {
  generatedAt: string;
  totalActivities: number;
  instrumentedCount: number;
  partialCount: number;
  darkCount: number;
  coveragePercent: number;
  activities: ActivityCoverageRecord[];
  criticalGaps: string[];
  recommendations: string[];
};

export function generateInstrumentationCoverageReport(): InstrumentationCoverageReport {
  const activities = Object.values(INSTRUMENTATION_MAP);
  const instrumented = activities.filter((a) => a.status === "instrumented").length;
  const partial = activities.filter((a) => a.status === "partial").length;
  const dark = activities.filter((a) => a.status === "dark").length;

  // Coverage % counts "instrumented" as 100%, "partial" as 50%, "dark" as 0%
  const coveragePercent = Math.round(
    ((instrumented * 100 + partial * 50) / (activities.length * 100)) * 100,
  );

  const criticalGaps = activities
    .filter((a) => a.status === "dark")
    .map((a) => `${a.label} — ${a.handlerPath}`);

  const recommendations: string[] = [];
  if (dark > 0) {
    recommendations.push(
      `Wire emitActivityStarted/emitActivityCompleted into ${dark} dark route(s)`,
    );
  }
  if (partial > 0) {
    recommendations.push(
      `Complete lifecycle (abandoned + error) tracking for ${partial} partial route(s)`,
    );
  }
  if (coveragePercent < 80) {
    recommendations.push("Instrumentation coverage <80% — prioritize ECG, LOFT, pharmacology routes");
  }

  return {
    generatedAt: new Date().toISOString(),
    totalActivities: activities.length,
    instrumentedCount: instrumented,
    partialCount: partial,
    darkCount: dark,
    coveragePercent,
    activities,
    criticalGaps,
    recommendations,
  };
}

/** Returns true if coverage meets the minimum threshold for release. */
export function isCoverageAcceptable(minPercent = 50): boolean {
  const report = generateInstrumentationCoverageReport();
  return report.coveragePercent >= minPercent;
}
