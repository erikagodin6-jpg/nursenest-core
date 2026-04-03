import type { ExamDatePlanType } from "@prisma/client";
import type { ReadinessBand, ReadinessResult } from "@/lib/learner/readiness-score";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { AdaptiveTeachingLoopRecommendation } from "@/lib/learner/adaptive-teaching-loop";
import {
  assessPlanTrack,
  buildExamPlanMilestones,
  buildRecoveryRecommendations,
  buildWeeklyStudyPlan,
  cadenceLabel,
  type ExamPlanMilestone,
  type PlanTrackAssessment,
  type RecoveryRecommendation,
  type WeeklyStudyPlan,
} from "@/lib/learner/exam-plan-engine";
import {
  buildCountdownCopy,
  daysDeltaToExamUtc,
  daysUntilExamUtc,
  urgencyFromDays,
  weeksRemainingRounded,
  type ExamUrgency,
} from "@/lib/learner/exam-timeline";

export type PaceStatus = "on_pace" | "slightly_behind" | "behind_weak_review" | "final_review";

export type TrajectoryStatus =
  | "building_foundation"
  | "improving"
  | "on_track"
  | "needs_focused_review"
  | "final_review";

export type NextAction = {
  title: string;
  href: string;
  reason: string;
  kind: "lesson" | "quiz" | "mock" | "cat" | "review" | "continue" | "settings" | "exams";
};

export type AdaptiveLearnerRecommendations = {
  countdown: ReturnType<typeof buildCountdownCopy>;
  paceStatus: PaceStatus;
  trajectory: TrajectoryStatus;
  trajectoryLines: string[];
  primaryNext: NextAction;
  secondary: NextAction[];
  weakTop3: string[];
  /** Factors most limiting readiness (from blended score). */
  holdingBackLabels: string[];
  weeklyPriorities: string[];
  todayFocus: string[];
  /** Honest combined line for readiness + time — no pass guarantees. */
  readinessTimelineLine: string | null;
  /** Calm exam-plan pacing — preferred for dashboard copy. */
  planTrack: PlanTrackAssessment;
  /** Cadence-aware weekly targets (lessons, questions, flashcards, mock timing). */
  weeklyPlan: WeeklyStudyPlan;
  /** Supportive recovery paths for common risk patterns. */
  recovery: RecoveryRecommendation[];
  milestones: ExamPlanMilestone[];
  /** Human label for active cadence (or default). */
  cadenceDisplay: string;
  /** Raw stored preference — light | steady | intensive | null */
  studyCadencePreference: string | null;
  /** Client-updated adaptive teaching loop (performance + teaching + image). */
  adaptiveLoop: AdaptiveTeachingLoopRecommendation | null;
};

function encodeTopic(topic: string): string {
  return encodeURIComponent(topic);
}

function paceFromSignals(args: {
  urgency: ExamUrgency | null;
  readinessBand: ReadinessBand;
  weakTopicCount: number;
}): PaceStatus {
  if (args.urgency === "final_stretch") return "final_review";
  if (args.urgency === "near" && (args.readinessBand === "not_ready" || args.weakTopicCount >= 3)) {
    return "behind_weak_review";
  }
  if (args.readinessBand === "not_ready" && args.urgency && args.urgency !== "far") {
    return "slightly_behind";
  }
  return "on_pace";
}

function trajectoryFromSignals(args: {
  lessonPct: number;
  readinessBand: ReadinessBand;
  urgency: ExamUrgency | null;
  weakTopicCount: number;
}): TrajectoryStatus {
  if (args.urgency === "final_stretch") return "final_review";
  if (args.lessonPct < 30 || args.readinessBand === "insufficient_data") return "building_foundation";
  if (args.readinessBand === "not_ready" && args.weakTopicCount >= 2) return "needs_focused_review";
  if (args.readinessBand === "improving") return "improving";
  if (args.readinessBand === "near_ready" || args.readinessBand === "ready") return "on_track";
  return "improving";
}

function explainTrajectory(args: {
  readiness: ReadinessResult;
  weakTop3: string[];
  lessonPct: number;
  days: number | null;
}): string[] {
  const lines: string[] = [];
  if (args.readiness.summary) {
    lines.push(`Exam readiness: ${args.readiness.summary}`);
  }
  if (args.days != null) {
    lines.push(
      args.days > 30
        ? "With your current timeline, steady blocks beat cramming."
        : args.days > 14
          ? "Time remaining supports focused weak-topic work each week."
          : "Shorter horizon. Prioritize gaps that move your readiness the most.",
    );
  } else {
    lines.push("Without a target date, we use mastery-style pacing; add a date anytime for tighter timing.");
  }
  if (args.weakTop3.length) {
    lines.push(`Topics to watch: ${args.weakTop3.slice(0, 3).join(", ")}.`);
  }
  if (args.lessonPct < 50) {
    lines.push(`Lesson completion is about ${args.lessonPct}% of your visible plan. Finishing modules lifts readiness inputs.`);
  }
  return lines.slice(0, 4);
}

export function buildAdaptiveRecommendations(args: {
  examDatePlanType: ExamDatePlanType | null | undefined;
  examDate: Date | null | undefined;
  readiness: ReadinessResult;
  weakTopics: WeakTopicRow[];
  /** Optional momentum lines — fold into weekly priorities when present. */
  topicTrends?: TopicTrendRow[];
  streakDays: number;
  lessonPct: number;
  /** Completed / total lessons in scope — drives weekly lesson targets. */
  lessonsCompleted: number;
  lessonsTotal: number;
  studyCadencePreference: string | null | undefined;
  continueLesson: { title: string; href: string } | null;
  recommendedQuizTopic: string | null;
  mockCount: number;
  practiceSessionCount: number;
}): AdaptiveLearnerRecommendations {
  const countdown = buildCountdownCopy({
    examDatePlanType: args.examDatePlanType,
    examDate: args.examDate,
  });

  const days = daysUntilExamUtc(args.examDate ?? null);
  const daysDelta = daysDeltaToExamUtc(args.examDate ?? null);
  const weeksRem = weeksRemainingRounded(days);
  const urgency = urgencyFromDays(days);
  const weakTop3 = args.weakTopics
    .slice(0, 3)
    .map((w) => w.topic)
    .filter(Boolean);

  const paceStatus = paceFromSignals({
    urgency,
    readinessBand: args.readiness.band,
    weakTopicCount: args.weakTopics.length,
  });

  const planTrack = assessPlanTrack({
    examDatePlanType: args.examDatePlanType,
    examDate: args.examDate,
    readinessBand: args.readiness.band,
    weakTopicCount: args.weakTopics.length,
    streakDays: args.streakDays,
    mockCount: args.mockCount,
    lessonPct: args.lessonPct,
    practiceSessionCount: args.practiceSessionCount,
  });

  const weeklyPlan = buildWeeklyStudyPlan({
    daysRemaining: days,
    weeksRemaining: weeksRem,
    urgency,
    cadence: args.studyCadencePreference,
    lessonPct: args.lessonPct,
    lessonsCompleted: args.lessonsCompleted,
    lessonsTotal: args.lessonsTotal,
  });

  const recovery = buildRecoveryRecommendations({
    daysRemaining: days,
    daysDelta,
    urgency,
    readiness: args.readiness,
    mockCount: args.mockCount,
    streakDays: args.streakDays,
    weakTopics: args.weakTopics,
    lessonPct: args.lessonPct,
  });

  const milestones = buildExamPlanMilestones({
    lessonPct: args.lessonPct,
    mockCount: args.mockCount,
    readiness: args.readiness,
    weakestTopic: weakTop3[0] ?? null,
    examDatePlanType: args.examDatePlanType,
  });

  const trajectory = trajectoryFromSignals({
    lessonPct: args.lessonPct,
    readinessBand: args.readiness.band,
    urgency,
    weakTopicCount: args.weakTopics.length,
  });

  const trajectoryLines = explainTrajectory({
    readiness: args.readiness,
    weakTop3,
    lessonPct: args.lessonPct,
    days,
  });

  const topic = args.recommendedQuizTopic ?? weakTop3[0] ?? null;
  const quizHref = topic
    ? `/app/questions?preset=topic_drill&topic=${encodeTopic(topic)}`
    : "/app/questions";

  const primaryNext: NextAction = (() => {
    if (args.streakDays === 0 && args.practiceSessionCount + args.mockCount > 0) {
      return {
        title: "Pick up where you left off",
        href: args.continueLesson?.href ?? "/app/questions",
        reason: "A short session today keeps your streak and signals moving again.",
        kind: args.continueLesson ? "continue" : "quiz",
      };
    }
    if (args.continueLesson && args.lessonPct < 55) {
      return {
        title: `Continue: ${args.continueLesson.title}`,
        href: args.continueLesson.href,
        reason: "Lesson-first work builds context before heavy question volume.",
        kind: "lesson",
      };
    }
    if (urgency === "final_stretch" && args.mockCount < 2) {
      return {
        title: "Run a timed practice exam",
        href: "/app/exams",
        reason: "Near your date. Rehearsal under time mirrors test day.",
        kind: "exams",
      };
    }
    if (topic) {
      return {
        title: `Targeted quiz: ${topic}`,
        href: quizHref,
        reason: "Your recent pattern points here. Short sets beat marathon cramming.",
        kind: "quiz",
      };
    }
    if (args.lessonPct < 40) {
      return {
        title: "Complete a lesson module",
        href: "/app/lessons",
        reason: "Foundation still opening up. Lessons anchor the bank work.",
        kind: "lesson",
      };
    }
    return {
      title: "10-question mixed review",
      href: "/app/questions",
      reason: "Balanced practice keeps strengths sharp while we learn more weak signals.",
      kind: "quiz",
    };
  })();

  const secondary: NextAction[] = [];
  if (primaryNext.kind !== "lesson" && args.continueLesson) {
    secondary.push({
      title: `Lesson: ${args.continueLesson.title}`,
      href: args.continueLesson.href,
      reason: "Alternate reading with questions for retention.",
      kind: "lesson",
    });
  }
  if (primaryNext.kind !== "quiz" && topic) {
    secondary.push({
      title: `Drill ${topic}`,
      href: quizHref,
      reason: "Narrow misses on this topic.",
      kind: "quiz",
    });
  }
  secondary.push({
    title: "Weak-area study mode (bank)",
    href: "/app/questions?studyMode=weak",
    reason: "Prioritizes topics your ledger flags. Less random-only drilling.",
    kind: "quiz",
  });
  if (urgency === "near" || urgency === "final_stretch") {
    secondary.push({
      title: "Adaptive (CAT) practice test",
      href: "/app/practice-tests",
      reason: "CAT adjusts difficulty. Useful when the exam is close.",
      kind: "cat",
    });
  } else {
    secondary.push({
      title: "Timed mock exam",
      href: "/app/exams",
      reason: "Mocks show pacing and stamina. Use occasionally even early on.",
      kind: "mock",
    });
  }
  secondary.push({
    title: "Weak-topic flashcards",
    href: "/app/flashcards/weak-areas",
    reason: "Ties missed bank concepts to short spaced-repetition reps.",
    kind: "review",
  });

  const seenHref = new Set<string>([primaryNext.href]);
  const dedupedSecondary: NextAction[] = [];
  for (const a of secondary) {
    if (seenHref.has(a.href)) continue;
    seenHref.add(a.href);
    dedupedSecondary.push(a);
  }

  const weeklyPriorities: string[] = [];
  weeklyPriorities.push(
    `This week: ~${weeklyPlan.questionVolume} scored questions, ${weeklyPlan.lessonsToFinish} lesson module(s), ${weeklyPlan.flashcardSessions} short flashcard session(s)`,
  );
  weeklyPriorities.push(weeklyPlan.mockTiming);
  if (weakTop3.length) {
    weeklyPriorities.push(`Tackle weak signals: ${weakTop3.slice(0, 2).join(", ")}`);
  }
  const trends = args.topicTrends ?? [];
  const declining = trends.filter((t) => t.momentum === "declining").slice(0, 2);
  const improving = trends.filter((t) => t.momentum === "improving").slice(0, 2);
  if (declining.length) {
    weeklyPriorities.push(`Stabilize: ${declining.map((t) => t.topic).join(", ")} (recent misses)`);
  }
  if (improving.length && weeklyPriorities.length < 4) {
    weeklyPriorities.push(`Keep momentum on: ${improving.map((t) => t.topic).join(", ")}`);
  }
  if (args.mockCount < 2 && (urgency === "near" || urgency === "final_stretch")) {
    weeklyPriorities.push("Schedule at least one full mock-style attempt this week");
  } else if (args.mockCount < 1) {
    weeklyPriorities.push("Log a mock or long timed block to anchor readiness");
  }
  if (args.lessonPct < 80) {
    weeklyPriorities.push("Advance one lesson pathway module you have not finished");
  }
  if (!weeklyPriorities.length) {
    weeklyPriorities.push("Rotate question bank, one mock, and one weak-topic drill");
  }

  const todayFocus: string[] = [];
  if (primaryNext.title) todayFocus.push(primaryNext.title);
  if (weakTop3[0]) todayFocus.push(`Short block on ${weakTop3[0]}`);
  if (args.streakDays < 3) todayFocus.push("15–25 minutes to extend your study streak");
  else todayFocus.push("One timed segment plus rationales review");
  todayFocus.push(`${cadenceLabel(args.studyCadencePreference)}. ${weeklyPlan.rationale}`);

  const readinessTimelineLine =
    args.readiness.score != null && days != null
      ? `Readiness score ${args.readiness.score}/100 with ${days} day${days === 1 ? "" : "s"} on the calendar. Trajectory depends on consistent practice, not a single number.`
      : args.readiness.score != null
        ? `Readiness score ${args.readiness.score}/100. Add an exam date for time-aware pacing.`
        : null;

  return {
    countdown,
    paceStatus,
    trajectory,
    trajectoryLines,
    primaryNext,
    secondary: dedupedSecondary.slice(0, 3),
    weakTop3,
    holdingBackLabels: args.readiness.holdingBack ?? [],
    weeklyPriorities: weeklyPriorities.slice(0, 6),
    todayFocus: todayFocus.slice(0, 5),
    readinessTimelineLine,
    planTrack,
    weeklyPlan,
    recovery,
    milestones,
    cadenceDisplay: cadenceLabel(args.studyCadencePreference),
    studyCadencePreference:
      args.studyCadencePreference === "light" || args.studyCadencePreference === "steady" || args.studyCadencePreference === "intensive"
        ? args.studyCadencePreference
        : null,
    adaptiveLoop: null,
  };
}
