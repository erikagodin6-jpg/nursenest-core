/**
 * Recovery Planner
 *
 * Generates a concrete, prioritised catch-up plan when a learner is
 * "slightly_behind" or "at_risk" relative to their exam timeline.
 *
 * Beyond the existing `buildRecoveryRecommendations` (which surfaces
 * situational recommendations), this module computes:
 *
 *   1. How many sessions were likely missed (based on cadence + recency).
 *   2. A concrete redistribution schedule to recover them.
 *   3. Specific quiz-frequency adjustments (+N questions/day).
 *   4. Ranked highest-yield weak areas to prioritise.
 *   5. Low-value activities to reduce first (to create recovery headroom).
 *
 * Pure functions — no DB access, fully deterministic and testable.
 *
 * Design principle: always supportive, never shame-inducing.
 * The plan is framed as "here's a workable path" not "you fell behind".
 */

import type { PlanTrackStatus, WeeklyStudyPlan } from "@/lib/learner/exam-plan-engine";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CatchUpStrategy =
  | "redistribute"   // spread missed sessions across upcoming days
  | "quiz_boost"     // add extra questions per day
  | "weak_focus"     // concentrate time on highest-yield weak areas
  | "cut_low_value"; // drop or reduce low-priority activities

export type RecoveryPriority = "highest_impact" | "secondary" | "optional";

export type RecoveryAction = {
  id: string;
  strategy: CatchUpStrategy;
  priority: RecoveryPriority;
  /** Short, direct label. */
  label: string;
  /** 1–2 supportive sentences explaining the why. */
  rationale: string;
  /** Short computed explanation for why this action is ranked here. */
  evidence: string | null;
  /** Concrete target or change, e.g. "+25 questions/day" or "–1 flashcard session/wk". */
  concreteTarget: string | null;
  /** Direct link to act now. */
  href: string;
  /** Short action-oriented CTA label. */
  ctaLabel: string;
};

export type RecoveryPlan = {
  status: PlanTrackStatus;
  /** Supportive opening sentence. */
  headline: string;
  /** What happens if nothing changes — stated gently. */
  consequence: string | null;
  /** Prioritised action list (highest impact first). */
  actions: RecoveryAction[];
  /** True if the learner should reduce any activity to make room. */
  requiresReduction: boolean;
  /** Low-value activities to trim (may be empty). */
  reductions: { label: string; rationale: string }[];
  /** Approximate extra minutes/day needed to catch up. */
  extraMinutesPerDay: number | null;
};

export type PaceForecastState = "no_date" | "ahead" | "on_pace" | "behind";

export type PaceForecast = {
  state: PaceForecastState;
  summary: string;
  detail: string;
  calendarBufferDays: number | null;
  studyDayDelta: number | null;
};

// ── Input ─────────────────────────────────────────────────────────────────────

export type RecoveryPlannerInput = {
  status: PlanTrackStatus;
  daysUntilExam: number | null;
  /** Current daily study minutes from user setting. */
  dailyStudyMinutes: number | null;
  /** Study cadence preference. */
  cadence: string | null | undefined;
  /** Current overall accuracy percentage (0–100). */
  overallAccuracyPct: number | null;
  /** Top weak topics (ranked worst first). */
  weakTopics: string[];
  /** How many consecutive days without any study activity (0 = studied today). */
  inactiveDays: number;
  /** Number of completed mock/CAT sessions. */
  mockCount: number;
  /** Lesson completion percentage. */
  lessonPct: number;
  /** Current readiness band. */
  readinessBand: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function defaultDailyMinutes(cadence: string | null | undefined): number {
  const c = cadence?.toLowerCase();
  if (c === "light") return 30;
  if (c === "intensive") return 90;
  return 60;
}

function extraMinutesForCatchUp(inactiveDays: number, daysUntilExam: number | null): number {
  if (inactiveDays === 0) return 0;
  // Spread the backlog over the smaller of: remaining days, 2×inactive days
  const recoveryDays = daysUntilExam != null
    ? Math.min(Math.max(3, inactiveDays * 2), daysUntilExam)
    : Math.max(3, inactiveDays * 2);
  // Each missed day ≈ 60 min of study; redistribute over recovery window
  const totalBacklogMinutes = inactiveDays * 60;
  return Math.min(60, Math.round(totalBacklogMinutes / recoveryDays));
}

function quizBoostPerDay(status: PlanTrackStatus, overallAccuracyPct: number | null): number {
  const base = status === "at_risk" ? 30 : 20;
  // If accuracy is high, more questions is efficient; if low, slow down and review
  if (overallAccuracyPct != null && overallAccuracyPct >= 70) return base + 10;
  if (overallAccuracyPct != null && overallAccuracyPct < 50) return Math.round(base * 0.7);
  return base;
}

function activeStudyDaysPerWeek(
  status: PlanTrackStatus,
  weeklyPlan: Pick<WeeklyStudyPlan, "lessonsToFinish" | "questionVolume">,
): number {
  if (status === "at_risk" || status === "overdue") return 7;
  if (weeklyPlan.questionVolume >= 160 || weeklyPlan.lessonsToFinish > 3) return 6;
  return 5;
}

export function buildPaceForecast(args: {
  daysUntilExam: number | null;
  examDate: string | null;
  planTrack: PlanTrackStatus;
  weeklyPlan: WeeklyStudyPlan;
  lessonsCompleted: number;
  lessonsTotal: number;
  milestonesCompleted: number;
  milestonesTotal: number;
}): PaceForecast {
  if (!args.examDate || args.daysUntilExam == null || args.daysUntilExam < 0) {
    return {
      state: "no_date",
      summary: "Set an exam date to unlock pacing forecasts.",
      detail: "Forecasts use your remaining lesson load, milestone status, and current weekly targets.",
      calendarBufferDays: null,
      studyDayDelta: null,
    };
  }

  const lessonsRemaining = Math.max(0, args.lessonsTotal - args.lessonsCompleted);
  const weeklyLessonRate = Math.max(1, args.weeklyPlan.lessonsToFinish || 1);
  const lessonCalendarDays = lessonsRemaining === 0
    ? 0
    : Math.ceil((lessonsRemaining / weeklyLessonRate) * 7);
  const incompleteMilestones = Math.max(0, args.milestonesTotal - args.milestonesCompleted);
  const strategicDays = Math.max(
    0,
    incompleteMilestones - (lessonsRemaining > 0 ? 1 : 0),
  ) * 2;
  const calendarDaysNeeded = lessonCalendarDays + strategicDays;
  const calendarBufferDays = args.daysUntilExam - calendarDaysNeeded;
  const activeDays = activeStudyDaysPerWeek(args.planTrack, args.weeklyPlan);

  if (calendarBufferDays >= 5) {
    return {
      state: "ahead",
      summary: `At this pace, you are likely to finish ${calendarBufferDays} day${calendarBufferDays === 1 ? "" : "s"} early`,
      detail: "Based on remaining lesson modules, incomplete milestones, and current weekly targets.",
      calendarBufferDays,
      studyDayDelta: Math.max(1, Math.round((calendarBufferDays * activeDays) / 7)),
    };
  }

  if (calendarBufferDays >= 0) {
    return {
      state: "on_pace",
      summary: "At this pace, you are on track to finish before your exam date",
      detail: "Based on remaining lesson modules, incomplete milestones, and current weekly targets.",
      calendarBufferDays,
      studyDayDelta: 0,
    };
  }

  const studyDayShortfall = Math.max(
    1,
    Math.ceil((Math.abs(calendarBufferDays) * activeDays) / 7),
  );

  return {
    state: "behind",
    summary: `At this pace, you may fall short by about ${studyDayShortfall} study day${studyDayShortfall === 1 ? "" : "s"}`,
    detail: "Based on remaining lesson modules, incomplete milestones, and current weekly targets.",
    calendarBufferDays,
    studyDayDelta: -studyDayShortfall,
  };
}

// ── Low-value activity reductions ─────────────────────────────────────────────

function buildReductions(
  status: PlanTrackStatus,
  lessonPct: number,
  daysUntilExam: number | null,
  mockCount: number,
): RecoveryPlan["reductions"] {
  const reductions: RecoveryPlan["reductions"] = [];
  const isClose = daysUntilExam != null && daysUntilExam <= 30;

  if (status === "at_risk" || status === "overdue") {
    if (isClose && lessonPct >= 60) {
      reductions.push({
        label: "Reduce new lesson content",
        rationale:
          "You've covered a solid foundation. With limited time left, scored questions and review return more readiness per hour than new lesson modules.",
      });
    }
    if (mockCount >= 3 && isClose) {
      reductions.push({
        label: "Pause additional full mocks",
        rationale:
          "You have mock baseline. Shorter timed drills (10–20 Q) are more efficient for identifying remaining gaps than another full-length attempt.",
      });
    }
    reductions.push({
      label: "Skip passive reading for now",
      rationale:
        "Re-reading notes without active recall is the lowest-yield study mode. Replace with flashcard review or rationale-drill on recent misses.",
    });
  } else if (status === "slightly_behind") {
    if (lessonPct >= 70 && isClose) {
      reductions.push({
        label: "Limit new lesson modules to 1/week",
        rationale: "Foundation is in place. Your time is better spent on practice and rationale review right now.",
      });
    }
  }

  return reductions.slice(0, 3);
}

// ── Action builders ───────────────────────────────────────────────────────────

function buildRedistributeAction(
  inactiveDays: number,
  extraMin: number,
): RecoveryAction | null {
  if (inactiveDays === 0 || extraMin === 0) return null;
  return {
    id: "redistribute_sessions",
    strategy: "redistribute",
    priority: "highest_impact",
    label: "Redistribute missed sessions",
    rationale:
      inactiveDays === 1
        ? "One missed day is easy to absorb. Adding a short catch-up block today re-syncs the plan without disruption."
        : `You have ${inactiveDays} days to catch up. Spreading sessions across the next few days keeps the load manageable — no need for long cramming blocks.`,
    evidence: "Closes the largest share of recent missed study time.",
    concreteTarget: `+${extraMin} min/day for ${Math.max(2, inactiveDays)} days`,
    href: "/app/questions?studyMode=weak",
    ctaLabel: "Start catch-up block",
  };
}

function buildQuizBoostAction(
  boost: number,
  status: PlanTrackStatus,
  overallAccuracyPct: number | null,
): RecoveryAction {
  return {
    id: "quiz_frequency",
    strategy: "quiz_boost",
    priority: status === "at_risk" ? "highest_impact" : "secondary",
    label: "Increase daily question volume",
    rationale:
      "Scored practice questions are the highest-signal activity for both readiness growth and gap identification. A small daily increase compounds quickly.",
    evidence:
      overallAccuracyPct != null && overallAccuracyPct >= 70
        ? "Adds efficient volume because current accuracy can support a larger block."
        : "Closes missed practice volume without overloading review time.",
    concreteTarget: `+${boost} questions/day`,
    href: "/app/questions",
    ctaLabel: "Start scored block",
  };
}

function buildWeakFocusAction(weakTopics: string[], status: PlanTrackStatus): RecoveryAction {
  const topTopic = weakTopics[0];
  const href = topTopic
    ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(topTopic)}`
    : "/app/questions?studyMode=weak";
  const topicsText =
    weakTopics.length > 0
      ? `${weakTopics.slice(0, 2).join(" and ")}${weakTopics.length > 2 ? " (and others)" : ""}`
      : "your flagged topics";

  return {
    id: "weak_focus",
    strategy: "weak_focus",
    priority: "highest_impact",
    label: "Prioritise highest-yield weak areas",
    rationale:
      `Closing gaps on ${topicsText} will have the most direct impact on readiness. ` +
      (status === "at_risk"
        ? "With limited time, one focused topic per session beats broad unfocused practice."
        : "Targeted drills on your worst areas outperform general review sessions."),
    concreteTarget: topTopic ? `Start with: ${topTopic}` : "Use weak-area filter",
    href,
    evidence: topTopic
      ? "Best next topic based on weak-area yield."
      : "Uses the current weak-area filter to prioritize review.",
    ctaLabel: topTopic ? `Drill ${topTopic.toLowerCase()} now` : "Review weak-topic set",
  };
}

function buildMockAction(daysUntilExam: number | null, mockCount: number): RecoveryAction | null {
  if (mockCount >= 2) return null;
  if (daysUntilExam != null && daysUntilExam > 45) return null; // not urgent yet
  return {
    id: "add_mock",
    strategy: "quiz_boost",
    priority: "secondary",
    label: "Schedule at least one timed mock",
    rationale:
      mockCount === 0
        ? "You haven't done a full timed attempt yet. Mocks build pacing instinct and surface gaps that drills don't. Even one session changes how the plan reads."
        : "Another mock-style block will sharpen pacing and show where to concentrate remaining effort.",
    evidence: "Adds pacing data before the exam window gets tighter.",
    concreteTarget: "1 timed session this week",
    href: "/app/exams",
    ctaLabel: "Schedule next mock",
  };
}

function buildFlashcardAction(status: PlanTrackStatus): RecoveryAction {
  return {
    id: "flashcard_review",
    strategy: "weak_focus",
    priority: "secondary",
    label: "Add daily spaced-repetition review",
    rationale:
      status === "at_risk"
        ? "15 minutes of flashcard review each morning surfaces what slipped overnight and costs no extra study time."
        : "A daily flashcard habit ensures key concepts stay active — especially for topics you haven't drilled recently.",
    evidence: "Protects retention while question volume increases.",
    concreteTarget: "15 min/day",
    href: "/app/flashcards",
    ctaLabel: "Review flashcards now",
  };
}

function buildLessonCutAction(lessonPct: number, daysUntilExam: number | null): RecoveryAction | null {
  if (lessonPct < 50 || (daysUntilExam != null && daysUntilExam > 45)) return null;
  return {
    id: "cut_lessons",
    strategy: "cut_low_value",
    priority: "optional",
    label: "Replace passive lesson reading with active recall",
    rationale:
      "With a solid lesson foundation, reading new modules delivers diminishing returns. Swap one lesson session per day for a targeted drill on that module's topic.",
    evidence: "Prioritize review before adding more new content.",
    concreteTarget: "–30 min lesson / +30 min drill",
    href: "/app/questions",
    ctaLabel: "Open lesson-linked drill",
  };
}

// ── Headline / consequence copy ───────────────────────────────────────────────

function buildHeadlineCopy(
  status: PlanTrackStatus,
  inactiveDays: number,
): { headline: string; consequence: string | null } {
  if (status === "at_risk" || status === "overdue") {
    return {
      headline:
        inactiveDays >= 3
          ? "You haven't studied in a few days — here's a clear path back."
          : "A little more focus will close the gap. The plan below shows you where to put it.",
      consequence:
        "Without adjustment, the remaining content may feel compressed closer to exam day. These are small changes with measurable impact.",
    };
  }
  return {
    headline:
      inactiveDays >= 2
        ? "Easy to recover — here's how to smooth the path forward."
        : "You're slightly off pace this week. A focused day or two puts you back on track.",
    consequence: null,
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Builds a full, prioritised recovery plan.
 * Returns null when status is "on_track" (no recovery needed).
 */
export function buildRecoveryPlan(input: RecoveryPlannerInput): RecoveryPlan | null {
  if (input.status === "on_track") return null;

  const extraMin = extraMinutesForCatchUp(input.inactiveDays, input.daysUntilExam);
  const boost = quizBoostPerDay(input.status, input.overallAccuracyPct);
  const reductions = buildReductions(
    input.status,
    input.lessonPct,
    input.daysUntilExam,
    input.mockCount,
  );
  const { headline, consequence } = buildHeadlineCopy(input.status, input.inactiveDays);

  const rawActions: Array<RecoveryAction | null> = [
    buildWeakFocusAction(input.weakTopics, input.status),
    buildRedistributeAction(input.inactiveDays, extraMin),
    buildQuizBoostAction(boost, input.status, input.overallAccuracyPct),
    buildMockAction(input.daysUntilExam, input.mockCount),
    buildFlashcardAction(input.status),
    buildLessonCutAction(input.lessonPct, input.daysUntilExam),
  ];

  const priorityOrder: Record<RecoveryPriority, number> = {
    highest_impact: 0,
    secondary: 1,
    optional: 2,
  };

  const actions = rawActions
    .filter((a): a is RecoveryAction => a !== null)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 5);

  return {
    status: input.status,
    headline,
    consequence,
    actions,
    requiresReduction: reductions.length > 0,
    reductions,
    extraMinutesPerDay: extraMin > 0 ? extraMin : null,
  };
}
