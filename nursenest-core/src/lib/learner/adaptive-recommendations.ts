import type { ExamDatePlanType } from "@prisma/client";
import type { ReadinessBand, ReadinessResult } from "@/lib/learner/readiness-score";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { buildCountdownCopy, daysUntilExamUtc, urgencyFromDays, type ExamUrgency } from "@/lib/learner/exam-timeline";

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
  weeklyPriorities: string[];
  todayFocus: string[];
  /** Honest combined line for readiness + time — no pass guarantees. */
  readinessTimelineLine: string | null;
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
          : "Shorter horizon — prioritize gaps that move your readiness the most.",
    );
  } else {
    lines.push("Without a target date, we use mastery-style pacing; add a date anytime for tighter timing.");
  }
  if (args.weakTop3.length) {
    lines.push(`Topics to watch: ${args.weakTop3.slice(0, 3).join(", ")}.`);
  }
  if (args.lessonPct < 50) {
    lines.push(`Lesson completion is about ${args.lessonPct}% of your visible plan — finishing modules lifts readiness inputs.`);
  }
  return lines.slice(0, 4);
}

export function buildAdaptiveRecommendations(args: {
  examDatePlanType: ExamDatePlanType | null | undefined;
  examDate: Date | null | undefined;
  readiness: ReadinessResult;
  weakTopics: WeakTopicRow[];
  streakDays: number;
  lessonPct: number;
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
  const quizHref = topic ? `/app/questions?topic=${encodeTopic(topic)}` : "/app/questions";

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
        reason: "Near your date — rehearsal under time mirrors test day.",
        kind: "exams",
      };
    }
    if (topic) {
      return {
        title: `Targeted quiz: ${topic}`,
        href: quizHref,
        reason: "Your recent pattern points here — short sets beat marathon cramming.",
        kind: "quiz",
      };
    }
    if (args.lessonPct < 40) {
      return {
        title: "Complete a lesson module",
        href: "/app/lessons",
        reason: "Foundation still opening up — lessons anchor the bank work.",
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
  if (urgency === "near" || urgency === "final_stretch") {
    secondary.push({
      title: "Adaptive (CAT) practice test",
      href: "/app/practice-tests",
      reason: "CAT adjusts difficulty — useful when the exam is close.",
      kind: "cat",
    });
  } else {
    secondary.push({
      title: "Timed mock exam",
      href: "/app/exams",
      reason: "Mocks show pacing and stamina — use occasionally even early on.",
      kind: "mock",
    });
  }
  if (secondary.length < 3) {
    secondary.push({
      title: "Review flashcards",
      href: "/app/flashcards",
      reason: "Light spaced repetition between heavier blocks.",
      kind: "review",
    });
  }

  const weeklyPriorities: string[] = [];
  if (weakTop3.length) {
    weeklyPriorities.push(`Tackle weak signals: ${weakTop3.slice(0, 2).join(", ")}`);
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

  const readinessTimelineLine =
    args.readiness.score != null && days != null
      ? `Readiness score ${args.readiness.score}/100 with ${days} day${days === 1 ? "" : "s"} on the calendar — trajectory depends on consistent practice, not a single number.`
      : args.readiness.score != null
        ? `Readiness score ${args.readiness.score}/100 — add an exam date for time-aware pacing.`
        : null;

  return {
    countdown,
    paceStatus,
    trajectory,
    trajectoryLines,
    primaryNext,
    secondary: secondary.slice(0, 3),
    weakTop3,
    weeklyPriorities: weeklyPriorities.slice(0, 4),
    todayFocus: todayFocus.slice(0, 4),
    readinessTimelineLine,
  };
}
