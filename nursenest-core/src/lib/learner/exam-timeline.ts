import type { ExamDatePlanType } from "@prisma/client";

export type ExamUrgency = "far" | "moderate" | "near" | "final_stretch";

/** Days from today (UTC date) until exam day; null if no date or past exam day. */
export function daysUntilExamUtc(examDate: Date | null | undefined): number | null {
  if (!examDate) return null;
  const delta = daysDeltaToExamUtc(examDate);
  if (delta == null || delta < 0) return null;
  return delta;
}

/**
 * Signed whole days until exam (UTC date-only): negative if the exam date is in the past (overdue).
 */
export function daysDeltaToExamUtc(examDate: Date | null | undefined): number | null {
  if (!examDate) return null;
  const today = utcDateOnly(new Date());
  const target = utcDateOnly(examDate);
  return Math.floor((target.getTime() - today.getTime()) / 86400000);
}

function utcDateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function weeksRemainingRounded(days: number | null): number | null {
  if (days == null) return null;
  return Math.max(1, Math.ceil(days / 7));
}

export function urgencyFromDays(days: number | null): ExamUrgency | null {
  if (days == null) return null;
  if (days > 42) return "far";
  if (days > 14) return "moderate";
  if (days > 6) return "near";
  return "final_stretch";
}

export type CountdownCopy = {
  primary: string;
  secondary: string | null;
  daysRemaining: number | null;
  weeksRemaining: number | null;
  urgency: ExamUrgency | null;
  /** Human label for pill UI */
  urgencyLabel: string | null;
};

export function buildCountdownCopy(args: {
  examDatePlanType: ExamDatePlanType | null | undefined;
  examDate: Date | null | undefined;
}): CountdownCopy {
  const t = args.examDatePlanType;
  const date = args.examDate;

  if (!t || t === "UNSURE") {
    return {
      primary: "No exam date set",
      secondary: "Set a date when you can — it unlocks pacing tailored to your timeline.",
      daysRemaining: null,
      weeksRemaining: null,
      urgency: null,
      urgencyLabel: null,
    };
  }

  if (!date) {
    return {
      primary: "Add your exam date",
      secondary: "Choose proposed or confirmed and pick a calendar day to enable countdown and pacing.",
      daysRemaining: null,
      weeksRemaining: null,
      urgency: null,
      urgencyLabel: null,
    };
  }

  const days = daysUntilExamUtc(date);
  const urgency = urgencyFromDays(days);

  if (days == null) {
    const label = t === "PROPOSED" ? "Proposed exam date" : "Exam date";
    return {
      primary: `${label} has passed — update your plan`,
      secondary: "Adjust your exam date so pacing and countdown stay accurate.",
      daysRemaining: null,
      weeksRemaining: null,
      urgency: null,
      urgencyLabel: "Update date",
    };
  }

  const weeks = weeksRemainingRounded(days);
  const dateLabel = t === "PROPOSED" ? "Proposed exam date" : "Exam date";
  const primary =
    days === 0
      ? `${dateLabel}: today`
      : `${days} day${days === 1 ? "" : "s"} until your exam`;

  const secondaryParts: string[] = [];
  if (weeks != null && days > 0) {
    secondaryParts.push(`About ${weeks} week${weeks === 1 ? "" : "s"} remaining`);
  }
  if (urgency === "far") secondaryParts.push("Plenty of runway — build fundamentals steadily.");
  else if (urgency === "moderate") secondaryParts.push("Good window to tighten weak topics.");
  else if (urgency === "near") secondaryParts.push("A focused review stretch — prioritize high-yield gaps.");
  else secondaryParts.push("Final review phase — short sessions, strong sleep, and targeted drills.");

  const urgencyLabel =
    urgency === "far"
      ? "Long horizon"
      : urgency === "moderate"
        ? "Steady prep"
        : urgency === "near"
          ? "Closing in"
          : "Final stretch";

  return {
    primary,
    secondary: secondaryParts.length ? secondaryParts.join(" · ") : null,
    daysRemaining: days,
    weeksRemaining: weeks,
    urgency,
    urgencyLabel,
  };
}
