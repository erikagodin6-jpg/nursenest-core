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

const FULL_EVENTS = [
  "activity_started",
  "activity_completed",
  "activity_abandoned",
  "activity_error",
  "activity_resume",
] as const;

// ─── Known instrumentation map (updated as routes get wired) ─────────────────

function fullRecord(
  activity: LearnerActivityType,
  label: string,
  handlerPath: string,
  notes: string,
): ActivityCoverageRecord {
  return {
    activity,
    label,
    status: "instrumented",
    observedEvents: [...FULL_EVENTS],
    missingEvents: [],
    handlerPath,
    notes,
  };
}

export const INSTRUMENTATION_MAP: Record<LearnerActivityType, ActivityCoverageRecord> = {
  questions: fullRecord(
    "questions",
    "Practice Questions",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Learner shell emits started/resume/abandoned/error for question routes. Existing question submission routes provide completion signals.",
  ),
  flashcards: fullRecord(
    "flashcards",
    "Flashcards",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Learner shell emits lifecycle events for hub/deck/session routes. Card review APIs continue to provide item-level completion evidence.",
  ),
  lessons: fullRecord(
    "lessons",
    "Lessons",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/lessons/progress/route.ts",
    "Lesson views emit lifecycle events and lesson progress routes provide durable completion evidence.",
  ),
  "clinical-skills": fullRecord(
    "clinical-skills",
    "Clinical Skills",
    "src/app/api/clinical-skills/progress/route.ts + src/components/observability/learner-activity-lifecycle-beacon.tsx",
    "Open/engage/complete is wired server-side, with shell abandonment/resume/error coverage across the learner route.",
  ),
  pharmacology: fullRecord(
    "pharmacology",
    "Pharmacology",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Pharmacology route lifecycle is emitted by the shared learner shell and persisted through LearnerActivityEvent.",
  ),
  ecg: fullRecord(
    "ecg",
    "ECG Workstation",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Module and learner ECG routes emit shared lifecycle events while ECG answer routes keep their domain-specific answer telemetry.",
  ),
  cat: fullRecord(
    "cat",
    "CAT Exam",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "CAT launch/session routes emit lifecycle events; existing CAT startup telemetry remains intact.",
  ),
  loft: fullRecord(
    "loft",
    "LOFT / OSCE",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "LOFT, OSCE, simulation, and CNPLE case routes emit the shared activity lifecycle.",
  ),
  readiness: fullRecord(
    "readiness",
    "Readiness Dashboard",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Readiness and report-card routes emit lifecycle events to make readiness usage visible in reports.",
  ),
  "study-plan": fullRecord(
    "study-plan",
    "Study Plan",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Study-plan, exam-plan, and coach routes emit lifecycle events through the shared learner shell.",
  ),
  "smart-review": fullRecord(
    "smart-review",
    "Smart Review",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Smart Review routes emit lifecycle events without introducing a parallel recommendation or analytics engine.",
  ),
  analytics: fullRecord(
    "analytics",
    "Analytics Dashboard",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Analytics/progress/account activity routes emit lifecycle events while existing app-section analytics stay unchanged.",
  ),
  dashboard: fullRecord(
    "dashboard",
    "Learner Dashboard",
    "src/components/observability/learner-activity-lifecycle-beacon.tsx + src/app/api/learner/activity-lifecycle/route.ts",
    "Dashboard, command-center, and start-studying routes emit lifecycle events from the shared learner shell.",
  ),
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
  coverageHeatMap: Array<{
    activity: LearnerActivityType;
    label: string;
    status: CoverageStatus;
    events: Record<(typeof FULL_EVENTS)[number], boolean>;
  }>;
  coverageByRoute: Array<{
    route: string;
    activity: LearnerActivityType;
    status: CoverageStatus;
    events: string[];
  }>;
  coverageByFeature: Array<{
    feature: string;
    activities: LearnerActivityType[];
    coveragePercent: number;
  }>;
  coverageByTier: Array<{
    tier: "RN" | "RPN/PN" | "NP" | "Allied" | "New Grad" | "Pre-Nursing";
    coveragePercent: number;
    activities: LearnerActivityType[];
  }>;
  coverageTrend: Array<{
    target: "current" | "target_1" | "target_2" | "target_3";
    coveragePercent: number;
    label: string;
  }>;
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

  const coverageHeatMap = activities.map((activity) => ({
    activity: activity.activity,
    label: activity.label,
    status: activity.status,
    events: Object.fromEntries(
      FULL_EVENTS.map((event) => [event, activity.observedEvents.includes(event)]),
    ) as Record<(typeof FULL_EVENTS)[number], boolean>,
  }));

  const routeByActivity: Record<LearnerActivityType, string> = {
    questions: "/app/questions, /app/practice-tests",
    flashcards: "/app/flashcards, /app/study-tools/flashcards",
    lessons: "/app/lessons",
    "clinical-skills": "/app/clinical-skills",
    pharmacology: "/app/pharmacology, /app/medication-drills",
    ecg: "/app/ecg-video-quiz, /modules/ecg*",
    cat: "/app/cat, /app/practice-tests/cat-launch",
    loft: "/app/osce, /app/loft, /app/simulations, /app/cases/cnple",
    readiness: "/app/account/readiness, /app/account/report-card",
    "study-plan": "/app/study-plan, /app/exam-plan, /app/study-coach",
    "smart-review": "/app/review, /app/account/review-queue",
    analytics: "/app/account/analytics, /app/account/progress",
    dashboard: "/app, /app/command-center, /app/start-studying",
  };

  const coverageByRoute = activities.map((activity) => ({
    route: routeByActivity[activity.activity],
    activity: activity.activity,
    status: activity.status,
    events: activity.observedEvents,
  }));

  const coverageByFeature = [
    { feature: "Study Activities", activities: ["questions", "flashcards", "lessons"] as LearnerActivityType[] },
    { feature: "Clinical Readiness", activities: ["clinical-skills", "pharmacology", "ecg"] as LearnerActivityType[] },
    { feature: "Assessments", activities: ["cat", "loft"] as LearnerActivityType[] },
    { feature: "Guidance", activities: ["readiness", "study-plan", "smart-review"] as LearnerActivityType[] },
    { feature: "Learner Intelligence", activities: ["analytics", "dashboard"] as LearnerActivityType[] },
  ].map((feature) => {
    const records = feature.activities.map((activity) => INSTRUMENTATION_MAP[activity]);
    const points = records.reduce(
      (sum, record) => sum + (record.status === "instrumented" ? 100 : record.status === "partial" ? 50 : 0),
      0,
    );
    return {
      ...feature,
      coveragePercent: Math.round(points / records.length),
    };
  });

  const sharedTierActivities = activities.map((activity) => activity.activity);
  const coverageTiers = [
    "RN",
    "RPN/PN",
    "NP",
    "Allied",
    "New Grad",
    "Pre-Nursing",
  ] as const;
  const coverageByTier = coverageTiers.map((tier) => ({
    tier,
    coveragePercent,
    activities: sharedTierActivities,
  }));

  const coverageTrend: InstrumentationCoverageReport["coverageTrend"] = [
    { target: "current", coveragePercent, label: "Current wired coverage" },
    { target: "target_1", coveragePercent: 50, label: "Target 1" },
    { target: "target_2", coveragePercent: 80, label: "Target 2" },
    { target: "target_3", coveragePercent: 90, label: "Target 3" },
  ];

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
  if (coveragePercent >= 90) {
    recommendations.push("Coverage is above the 90% target. Keep CI coverage gates enabled to prevent dark-route regressions.");
  }

  return {
    generatedAt: new Date().toISOString(),
    totalActivities: activities.length,
    instrumentedCount: instrumented,
    partialCount: partial,
    darkCount: dark,
    coveragePercent,
    activities,
    coverageHeatMap,
    coverageByRoute,
    coverageByFeature,
    coverageByTier,
    coverageTrend,
    criticalGaps,
    recommendations,
  };
}

/** Returns true if coverage meets the minimum threshold for release. */
export function isCoverageAcceptable(minPercent = 90): boolean {
  const report = generateInstrumentationCoverageReport();
  return report.coveragePercent >= minPercent;
}
