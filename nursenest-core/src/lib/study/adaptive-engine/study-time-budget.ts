/**
 * Study Time Budget Calculator
 *
 * Converts `dailyStudyMinutes` + `studyCadencePreference` + exam urgency into
 * a structured per-activity time allocation for each day and week.
 *
 * Pure functions — no DB queries, fully deterministic and testable.
 *
 * Activity split rationale:
 *   Lesson     — conceptual foundation; de-emphasised when exam is close
 *   Practice   — scored questions; always the primary activity
 *   Review     — rationale + weak-area re-visit; grows near exam
 *   Flashcard  — spaced repetition; short, consistent daily habit
 */

import type { ExamUrgency } from "@/lib/learner/exam-timeline";

// ── Types ─────────────────────────────────────────────────────────────────────

export type StudyActivity = "lesson" | "practice" | "review" | "flashcard";

export type ActivityMinutes = Record<StudyActivity, number>;

export type DailyStudyBudget = {
  /** Total allocated minutes for the day. */
  totalMinutes: number;
  /** Per-activity breakdown in minutes (rounds to whole numbers, sums to totalMinutes ± 1). */
  breakdown: ActivityMinutes;
  /** Short copy describing the session shape. */
  sessionSuggestion: string;
  /** True when the user has explicitly set a value; false when using cadence default. */
  isCustom: boolean;
};

export type WeeklyStudyBudget = {
  /** Total recommended minutes across all active days this week. */
  totalMinutesPerWeek: number;
  /** Days per week the plan assumes study occurs (based on cadence). */
  daysPerWeek: number;
  /** Minutes per active day (same as daily total). */
  minutesPerDay: number;
  /** Approximate scored questions to aim for this week. */
  questionTarget: number;
  /** Lesson modules to complete this week. */
  lessonModuleTarget: number;
  /** Short flashcard review sessions (10–15 min each) to complete this week. */
  flashcardSessionTarget: number;
  /** Suggested catch-up minutes if the user misses a day. */
  catchUpMinutes: number;
};

export type StudyTimeBudget = {
  daily: DailyStudyBudget;
  weekly: WeeklyStudyBudget;
};

// ── Cadence defaults ──────────────────────────────────────────────────────────

const CADENCE_DEFAULT_MINUTES: Record<string, number> = {
  light: 30,
  steady: 60,
  intensive: 90,
};

const CADENCE_DAYS_PER_WEEK: Record<string, number> = {
  light: 4,
  steady: 6,
  intensive: 7,
};

// ── Activity split by urgency ─────────────────────────────────────────────────

type ActivitySplit = Record<StudyActivity, number>;

function activitySplitForUrgency(urgency: ExamUrgency | null): ActivitySplit {
  if (urgency === "final_stretch") {
    return { lesson: 0.05, practice: 0.58, review: 0.27, flashcard: 0.10 };
  }
  if (urgency === "near") {
    return { lesson: 0.15, practice: 0.52, review: 0.23, flashcard: 0.10 };
  }
  if (urgency === "moderate") {
    return { lesson: 0.25, practice: 0.48, review: 0.17, flashcard: 0.10 };
  }
  // "far" or no exam date — more balanced
  return { lesson: 0.35, practice: 0.42, review: 0.13, flashcard: 0.10 };
}

// ── Session suggestion copy ───────────────────────────────────────────────────

function buildSessionSuggestion(totalMinutes: number, urgency: ExamUrgency | null): string {
  if (totalMinutes <= 20) {
    return "Short focused block — even 20 minutes of targeted practice compounds over weeks.";
  }
  if (urgency === "final_stretch") {
    return "Final stretch: favour scored questions and rapid rationale review over new content.";
  }
  if (urgency === "near") {
    return "Mix scored questions with quick review of recent misses.";
  }
  if (totalMinutes >= 75) {
    return "Full session: start with a lesson block, then move to scored practice and finish with review.";
  }
  return "Start with a short lesson read, then move to 15–20 questions on your weakest topic.";
}

// ── Main export ───────────────────────────────────────────────────────────────

export function computeStudyTimeBudget(args: {
  dailyStudyMinutes: number | null | undefined;
  studyCadencePreference: string | null | undefined;
  urgency: ExamUrgency | null;
}): StudyTimeBudget {
  const cadence = args.studyCadencePreference?.toLowerCase() ?? "steady";
  const isCustom = args.dailyStudyMinutes != null;
  const totalMinutes = Math.max(
    10,
    args.dailyStudyMinutes ?? CADENCE_DEFAULT_MINUTES[cadence] ?? 60,
  );

  const split = activitySplitForUrgency(args.urgency);

  // Distribute minutes — ensure they sum to totalMinutes exactly
  const lesson = Math.round(totalMinutes * split.lesson);
  const flashcard = Math.round(totalMinutes * split.flashcard);
  const review = Math.round(totalMinutes * split.review);
  const practice = totalMinutes - lesson - flashcard - review; // absorb rounding

  const breakdown: ActivityMinutes = {
    lesson: Math.max(0, lesson),
    practice: Math.max(5, practice),
    review: Math.max(0, review),
    flashcard: Math.max(0, flashcard),
  };

  const daysPerWeek = CADENCE_DAYS_PER_WEEK[cadence] ?? 6;
  const totalMinutesPerWeek = totalMinutes * daysPerWeek;

  // ~1.4 questions per practice-minute (accounts for reading, thinking, rationale)
  const practiceMinutesPerWeek = totalMinutesPerWeek * split.practice;
  const questionTarget = Math.max(20, Math.round(practiceMinutesPerWeek / 1.4));

  const lessonModuleTarget = cadence === "light" ? 1 : cadence === "intensive" ? 4 : 2;
  const flashcardSessionTarget = Math.max(2, Math.round(daysPerWeek * 0.7));

  // Catch-up: one missed day spread across remaining active days
  const catchUpMinutes = Math.round(totalMinutes / Math.max(1, daysPerWeek - 1));

  return {
    daily: {
      totalMinutes,
      breakdown,
      sessionSuggestion: buildSessionSuggestion(totalMinutes, args.urgency),
      isCustom,
    },
    weekly: {
      totalMinutesPerWeek,
      daysPerWeek,
      minutesPerDay: totalMinutes,
      questionTarget,
      lessonModuleTarget,
      flashcardSessionTarget,
      catchUpMinutes,
    },
  };
}
