import type { ExamDatePlanType } from "@prisma/client";
import type { ReadinessBand, ReadinessResult } from "@/lib/learner/readiness-score";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { daysDeltaToExamUtc, daysUntilExamUtc, urgencyFromDays, type ExamUrgency } from "@/lib/learner/exam-timeline";

/** Learner-selected study load — drives weekly volume multipliers when set. */
export type StudyCadence = "light" | "steady" | "intensive";

/** Calm, non-alarmist pacing vs calendar + readiness. */
export type PlanTrackStatus = "on_track" | "slightly_behind" | "at_risk" | "overdue";

export type PlanTrackAssessment = {
  status: PlanTrackStatus;
  /** Short label for pills */
  label: string;
  /** One supportive sentence */
  headline: string;
  /** Optional second line — concrete, still calm */
  detail: string | null;
};

export type WeeklyStudyPlan = {
  /** Approximate lesson modules to complete this week (whole numbers). */
  lessonsToFinish: number;
  /** Scored question items to aim for this week (bank / drills). */
  questionVolume: number;
  /** Short flashcard review sessions (e.g. 10–15 min blocks). */
  flashcardSessions: number;
  /** When to schedule a mock relative to the week. */
  mockTiming: string;
  /** Why these numbers (cadence + horizon). */
  rationale: string;
};

export type RecoveryRecommendation = {
  id: string;
  title: string;
  body: string;
  href: string;
};

export type ExamPlanMilestone = {
  id: string;
  title: string;
  description: string;
  complete: boolean;
  href: string;
};

export function cadenceMultiplier(cadence: string | null | undefined): number {
  const c = cadence?.toLowerCase();
  if (c === "light") return 0.72;
  if (c === "intensive") return 1.42;
  return 1;
}

export function cadenceLabel(cadence: string | null | undefined): string {
  const c = cadence?.toLowerCase();
  if (c === "light") return "Light cadence";
  if (c === "intensive") return "Intensive cadence";
  if (c === "steady") return "Steady cadence";
  return "Default pacing";
}

/**
 * On-track / slightly behind / at risk / overdue — supportive copy only.
 */
export function assessPlanTrack(args: {
  examDatePlanType: ExamDatePlanType | null | undefined;
  examDate: Date | null | undefined;
  readinessBand: ReadinessBand;
  weakTopicCount: number;
  streakDays: number;
  mockCount: number;
  lessonPct: number;
  practiceSessionCount: number;
}): PlanTrackAssessment {
  const delta = daysDeltaToExamUtc(args.examDate ?? null);
  const days = daysUntilExamUtc(args.examDate ?? null);
  const urgency = urgencyFromDays(days);

  if (args.examDate && delta != null && delta < 0) {
    return {
      status: "overdue",
      label: "Date needs refresh",
      headline: "Your saved exam date is in the past. Update it when you can so pacing stays kind and accurate.",
      detail: "This does not reset your progress; it only recalibrates reminders and weekly targets.",
    };
  }

  const inactive = args.streakDays === 0 && args.practiceSessionCount + args.mockCount > 0;
  const lowReadinessNear =
    (urgency === "near" || urgency === "final_stretch") &&
    (args.readinessBand === "not_ready" || args.readinessBand === "insufficient_data");

  const weakHeavy =
    args.weakTopicCount >= 3 && (urgency === "near" || urgency === "final_stretch" || urgency === "moderate");

  const mocksThinNear =
    (urgency === "near" || urgency === "final_stretch") && args.mockCount < 1 && days != null && days <= 21;

  if (lowReadinessNear || weakHeavy || mocksThinNear) {
    return {
      status: "at_risk",
      label: "Worth extra focus",
      headline:
        "You still have moves to make. Short, consistent sessions usually beat cramming, especially close to test day.",
      detail: lowReadinessNear
        ? "Readiness has room to climb; prioritize one weak area per day plus one mock-style block this week."
        : mocksThinNear
          ? "A full mock or long timed block will sharpen pacing and show where to shore up."
          : "A little more targeted review on your flagged topics will go a long way.",
    };
  }

  if (
    args.readinessBand === "not_ready" &&
    (urgency === "moderate" || urgency === "near") &&
    args.lessonPct < 55
  ) {
    return {
      status: "slightly_behind",
      label: "Room to grow",
      headline: "You are building. Add one more structured lesson block and a short quiz set this week to tighten the arc.",
      detail: inactive
        ? "Jumping back in today, even briefly, keeps the plan from feeling heavier later."
        : null,
    };
  }

  if (inactive && (urgency === "near" || urgency === "final_stretch")) {
    return {
      status: "slightly_behind",
      label: "Gentle nudge",
      headline: "A little activity today makes the next session easier. Even fifteen minutes counts.",
      detail: null,
    };
  }

  return {
    status: "on_track",
    label: "On track",
    headline: "Your plan and practice patterns look workable for the timeline you shared. Stay steady and adjust if life gets noisy.",
    detail:
      args.readinessBand === "ready" || args.readinessBand === "near_ready"
        ? "Strong foundation. Keep mixing review with fresh items so skills stay exam-sharp."
        : "Keep alternating lessons, questions, and occasional mocks so readiness can keep climbing.",
  };
}

export function buildWeeklyStudyPlan(args: {
  daysRemaining: number | null;
  weeksRemaining: number | null;
  urgency: ExamUrgency | null;
  cadence: string | null | undefined;
  lessonPct: number;
  lessonsCompleted: number;
  lessonsTotal: number;
}): WeeklyStudyPlan {
  const mult = cadenceMultiplier(args.cadence);
  const weeks = Math.max(1, args.weeksRemaining ?? (args.daysRemaining != null ? Math.ceil(args.daysRemaining / 7) : 8));
  const lessonsLeft = Math.max(0, args.lessonsTotal - args.lessonsCompleted);

  /** Spread remaining lessons across horizon, capped per week. */
  const rawLessons = lessonsLeft > 0 ? Math.ceil(lessonsLeft / Math.min(weeks, 12)) : 0;
  const lessonsToFinish = Math.max(0, Math.min(rawLessons, 5));

  /** Base weekly question volume — scales down with more time, up with intensity. */
  let baseQuestions = 120;
  if (args.urgency === "final_stretch") baseQuestions = 220;
  else if (args.urgency === "near") baseQuestions = 180;
  else if (args.urgency === "moderate") baseQuestions = 140;
  else if (args.urgency === "far") baseQuestions = 100;

  baseQuestions = Math.round(baseQuestions * mult);
  /** Don't over-assign if exam is far and light cadence. */
  if (weeks > 10 && mult < 1) baseQuestions = Math.round(baseQuestions * 0.85);

  const flashcardSessions = Math.max(2, Math.min(8, Math.round(3 * mult + (args.urgency === "final_stretch" ? 2 : 0))));

  let mockTiming =
    args.urgency === "final_stretch"
      ? "Schedule one mock early this week. Short walk, then review misses."
      : args.urgency === "near"
        ? "One timed mock mid-week; use the back half for weak-topic drills."
        : "If you have not mocked recently, reserve a quiet block before the weekend.";

  if (args.daysRemaining != null && args.daysRemaining <= 3) {
    mockTiming = "Skip new heavy mocks if you are days out. Light review and one short timed block if it helps you feel settled.";
  }

  const rationale = `${cadenceLabel(args.cadence)} · ~${weeks} week(s) on the calendar. Targets scale with cadence and horizon.`;

  return {
    lessonsToFinish,
    questionVolume: baseQuestions,
    flashcardSessions,
    mockTiming,
    rationale,
  };
}

export function buildRecoveryRecommendations(args: {
  daysRemaining: number | null;
  daysDelta: number | null;
  urgency: ExamUrgency | null;
  readiness: ReadinessResult;
  mockCount: number;
  streakDays: number;
  weakTopics: WeakTopicRow[];
  lessonPct: number;
}): RecoveryRecommendation[] {
  const out: RecoveryRecommendation[] = [];
  const topic = args.weakTopics[0]?.topic;
  const topicHref = topic
    ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(topic)}`
    : "/app/questions?studyMode=weak";

  if (args.daysDelta != null && args.daysDelta < 0) {
    out.push({
      id: "overdue_date",
      title: "Refresh your exam date",
      body: "Open exam plan settings and set a new target. We will re-align weekly targets without judging the slip.",
      href: "/app/study-plan#exam-plan",
    });
  }

  if (
    (args.urgency === "near" || args.urgency === "final_stretch") &&
    (args.readiness.band === "not_ready" || args.readiness.band === "insufficient_data")
  ) {
    out.push({
      id: "near_low_readiness",
      title: "Pair review with timed practice",
      body: "Close to test day with readiness still building. Alternate short drills with one mock-style block so stamina and judgment both move.",
      href: "/app/exams",
    });
  }

  if (args.streakDays === 0 && args.daysRemaining != null && args.daysRemaining <= 30 && args.daysRemaining >= 0) {
    out.push({
      id: "inactive_near",
      title: "Ease back in with one small win",
      body: "Exam window is tight. Start with a 15-minute quiz or flashcard round so momentum returns without overwhelm.",
      href: "/app/questions",
    });
  }

  if ((args.urgency === "near" || args.urgency === "final_stretch") && args.mockCount < 1) {
    out.push({
      id: "low_mocks_near",
      title: "Add a full mock when you can",
      body: "At least one long timed attempt helps pacing feel familiar. Use results to trim what you review next.",
      href: "/app/exams",
    });
  }

  if (
    args.weakTopics.length >= 3 &&
    (args.urgency === "near" || args.urgency === "final_stretch" || args.urgency === "moderate")
  ) {
    out.push({
      id: "weak_cluster",
      title: "Triage weak topics one at a time",
      body: "Several areas are signaling. Pick the top one first, clear it with focused drills, then move to the next.",
      href: topicHref,
    });
  }

  if (args.lessonPct < 40 && args.daysRemaining != null && args.daysRemaining < 45) {
    out.push({
      id: "foundation_gap",
      title: "Protect time for one lesson pathway block",
      body: "Lessons still anchor tricky concepts. One module this week can reduce noise in your question review.",
      href: "/app/lessons",
    });
  }

  return out.slice(0, 5);
}

export function buildExamPlanMilestones(args: {
  lessonPct: number;
  mockCount: number;
  readiness: ReadinessResult;
  weakestTopic: string | null;
  examDatePlanType: ExamDatePlanType | null | undefined;
}): ExamPlanMilestone[] {
  const milestones: ExamPlanMilestone[] = [];

  milestones.push({
    id: "foundation",
    title: "Finish your lesson foundation",
    description: "Work through the lesson pool for your pathway: structured context before volume.",
    complete: args.lessonPct >= 85,
    href: "/app/lessons",
  });

  milestones.push({
    id: "first_mock",
    title: "Complete your first mock",
    description: "A timed attempt shows pacing and stamina. Review rationales, not just the score.",
    complete: args.mockCount >= 1,
    href: "/app/exams",
  });

  if (args.weakestTopic) {
    milestones.push({
      id: "weakest_topic",
      title: `Lift accuracy on ${args.weakestTopic}`,
      description: "Short drills beat long marathons. Use topic drill and weak-area flashcards.",
      complete: args.readiness.band === "near_ready" || args.readiness.band === "ready",
      href: `/app/questions?preset=topic_drill&topic=${encodeURIComponent(args.weakestTopic)}`,
    });
  }

  milestones.push({
    id: "readiness_threshold",
    title: "Reach a stable readiness band",
    description: "Aim for “improving” or higher with consistent practice. Numbers track signals, not fate.",
    complete: args.readiness.band === "near_ready" || args.readiness.band === "ready",
    href: "/app/questions",
  });

  milestones.push({
    id: "exam_plan_clarity",
    title: "Confirm exam plan details",
    description: "Proposed or confirmed date + cadence unlocks weekly targets tuned to your life.",
    complete: args.examDatePlanType === "CONFIRMED" || args.examDatePlanType === "PROPOSED",
    href: "/app/study-plan#exam-plan",
  });

  return milestones;
}

export function retentionPromptHints(args: {
  planTrack: PlanTrackStatus;
  cadence: string | null | undefined;
  entitlementTier: "free" | "paid";
}): { title: string; body: string; ctaHref: string; soft: boolean } | null {
  if (args.entitlementTier !== "paid") return null;
  if (args.planTrack === "at_risk" || args.planTrack === "slightly_behind") {
    return {
      title: "Keep the full bank in reach",
      body: "Consistent access to every question, mock, and lesson lane makes recovery weeks less chaotic. Worth keeping if your window is tight.",
      ctaHref: "/pricing",
      soft: true,
    };
  }
  if (args.cadence === "intensive") {
    return {
      title: "Match intensity with depth",
      body: "Intensive cadence pairs best with full explanations and mocks. Your subscription keeps those unlocked.",
      ctaHref: "/app/exams",
      soft: true,
    };
  }
  return null;
}
