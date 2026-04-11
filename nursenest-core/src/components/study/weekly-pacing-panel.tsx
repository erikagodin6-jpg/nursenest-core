/**
 * WeeklyPacingPanel
 *
 * Premium day-by-day pacing grid for the exam countdown system.
 * NOT a dry table — each day is a visual column with activity type indicators,
 * today highlighted, catch-up days marked, and a weekly summary row.
 *
 * Server component — all data is computed from weekly plan targets
 * and the plan track status. No client state.
 *
 * Activity colours follow semantic token system:
 *   Lesson     → info
 *   Practice   → accent-primary
 *   Review     → warning
 *   Flashcard  → success
 *   Rest       → muted/soft
 *   Catch-up   → danger (marked with ▲)
 */

import Link from "next/link";
import type { WeeklyStudyPlan, PlanTrackAssessment } from "@/lib/learner/exam-plan-engine";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActivityType = "lesson" | "practice" | "review" | "flashcard" | "mock" | "rest";

type DayPlan = {
  dayLabel: string;       // "Mon", "Tue", …
  isToday: boolean;
  isCatchUp: boolean;     // extra session needed due to missed days
  isRest: boolean;
  activities: ActivityType[];
};

// ── Layout helpers ────────────────────────────────────────────────────────────

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  lesson:   "var(--semantic-info)",
  practice: "var(--accent-primary)",
  review:   "var(--semantic-warning)",
  flashcard:"var(--semantic-success)",
  mock:     "var(--semantic-chart-3, var(--semantic-info))",
  rest:     "var(--semantic-border-soft)",
};

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  lesson:   "L",
  practice: "P",
  review:   "R",
  flashcard:"F",
  mock:     "M",
  rest:     "–",
};

const ACTIVITY_FULL: Record<ActivityType, string> = {
  lesson:   "Lesson",
  practice: "Practice",
  review:   "Review",
  flashcard:"Flashcard",
  mock:     "Mock",
  rest:     "Rest",
};

// ── Week builder ──────────────────────────────────────────────────────────────

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildWeekPlan(
  plan: WeeklyStudyPlan,
  track: PlanTrackAssessment,
  daysUntilExam: number | null,
): DayPlan[] {
  // Determine today's day-of-week (0 = Mon, 6 = Sun)
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7; // JS: 0=Sun → shift to 0=Mon

  // Determine rest day(s) — always at least Sunday for "light", both Sat+Sun for ultra-light
  const daysPerWeek = track.status === "at_risk" ? 7 : plan.lessonsToFinish > 3 ? 6 : 5;
  const restDays = new Set<number>();
  if (daysPerWeek <= 6) restDays.add(6); // Sunday
  if (daysPerWeek <= 5) restDays.add(5); // Saturday

  // Mock day: mid-week (Wednesday = 2)
  const includeMock = plan.questionVolume >= 140;
  const mockDay = 2;

  // Catch-up days: after missing sessions, first N non-rest days
  const isBehind = track.status !== "on_track";
  const catchUpDays = new Set<number>();
  if (isBehind) {
    let catchUpCount = 2;
    for (let d = todayDow; d < 7 && catchUpCount > 0; d++) {
      if (!restDays.has(d)) {
        catchUpDays.add(d);
        catchUpCount--;
      }
    }
  }

  const plans: DayPlan[] = DAY_LABELS.map((label, i) => {
    const isRest = restDays.has(i);
    const isToday = i === todayDow;
    const isCatchUp = catchUpDays.has(i) && !isRest;

    if (isRest) {
      return { dayLabel: label, isToday, isCatchUp: false, isRest: true, activities: ["rest"] };
    }

    const activities: ActivityType[] = [];

    // Always practice
    activities.push("practice");

    // Review on alternating days
    if (i % 2 === 0 || isBehind) activities.push("review");

    // Flashcard most days
    if (i !== 3 || daysUntilExam == null || daysUntilExam > 7) activities.push("flashcard");

    // Lesson: first 3 active days of week (Mon/Tue/Thu)
    if (plan.lessonsToFinish > 0 && (i === 0 || i === 1 || i === 3)) activities.push("lesson");

    // Mock: mid-week
    if (includeMock && i === mockDay) activities.push("mock");

    return {
      dayLabel: label,
      isToday,
      isCatchUp,
      isRest: false,
      activities,
    };
  });

  return plans;
}

// ── Activity dot ──────────────────────────────────────────────────────────────

function ActivityDot({ type }: { type: ActivityType }) {
  const color = ACTIVITY_COLORS[type];
  const label = ACTIVITY_LABELS[type];
  return (
    <span
      title={ACTIVITY_FULL[type]}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 22,
        height: 22,
        borderRadius: type === "rest" ? "50%" : "0.375rem",
        background: type === "rest"
          ? "transparent"
          : `color-mix(in srgb, ${color} 14%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, ${color} 28%, var(--border-subtle))`,
        fontSize: "0.625rem",
        fontWeight: 800,
        color: type === "rest" ? "var(--semantic-text-muted)" : color,
        userSelect: "none",
      }}
    >
      {label}
    </span>
  );
}

// ── Day column ────────────────────────────────────────────────────────────────

function DayColumn({ day }: { day: DayPlan }) {
  const accent = day.isCatchUp
    ? "var(--semantic-danger)"
    : day.isToday
      ? "var(--accent-primary)"
      : "transparent";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        flex: "1 1 0",
        minWidth: 0,
        padding: "0.625rem 0.25rem",
        borderRadius: "0.75rem",
        background: day.isToday
          ? `color-mix(in srgb, var(--accent-primary) 7%, var(--bg-card))`
          : day.isCatchUp
            ? `color-mix(in srgb, var(--semantic-danger) 5%, var(--bg-card))`
            : "transparent",
        border: `1px solid ${day.isToday || day.isCatchUp ? accent : "transparent"}`,
        transition: "background 0.2s",
        position: "relative",
      }}
    >
      {/* Catch-up indicator */}
      {day.isCatchUp && (
        <span
          aria-label="Catch-up day"
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            fontSize: "0.6rem",
            color: "var(--semantic-danger)",
            fontWeight: 800,
          }}
        >
          ▲
        </span>
      )}

      {/* Day label */}
      <span
        style={{
          fontSize: "0.6875rem",
          fontWeight: day.isToday ? 800 : 600,
          color: day.isToday
            ? "var(--accent-primary)"
            : day.isCatchUp
              ? "var(--semantic-danger)"
              : "var(--semantic-text-muted)",
          letterSpacing: "0.02em",
        }}
      >
        {day.dayLabel}
      </span>

      {/* "TODAY" tag */}
      {day.isToday && (
        <span
          style={{
            fontSize: "0.5rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--accent-primary)",
            background: `color-mix(in srgb, var(--accent-primary) 12%, var(--bg-card))`,
            border: `1px solid color-mix(in srgb, var(--accent-primary) 22%, var(--border-subtle))`,
            borderRadius: 99,
            padding: "1px 5px",
          }}
        >
          Today
        </span>
      )}

      {/* Activity dots */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "center" }}>
        {day.activities.map((a) => (
          <ActivityDot key={a} type={a} />
        ))}
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

const LEGEND_ITEMS: Array<{ type: ActivityType; href: string }> = [
  { type: "practice",  href: "/app/questions" },
  { type: "review",    href: "/app/review" },
  { type: "flashcard", href: "/app/flashcards" },
  { type: "lesson",    href: "/app/lessons" },
  { type: "mock",      href: "/app/exams" },
];

function Legend() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", alignItems: "center" }}>
      {LEGEND_ITEMS.map(({ type, href }) => {
        const color = ACTIVITY_COLORS[type];
        return (
          <Link
            key={type}
            href={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 9px",
              borderRadius: 99,
              background: `color-mix(in srgb, ${color} 8%, var(--bg-card))`,
              border: `1px solid color-mix(in srgb, ${color} 18%, var(--border-subtle))`,
              fontSize: "0.6875rem",
              fontWeight: 600,
              color,
              textDecoration: "none",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 2,
                background: color,
                flexShrink: 0,
              }}
            />
            {ACTIVITY_FULL[type]}
          </Link>
        );
      })}
      <span style={{ fontSize: "0.625rem", color: "var(--semantic-text-muted)" }}>
        · ▲ = catch-up day
      </span>
    </div>
  );
}

// ── Weekly summary row ────────────────────────────────────────────────────────

function WeeklySummaryRow({
  plan,
  track,
}: {
  plan: WeeklyStudyPlan;
  track: PlanTrackAssessment;
}) {
  const behind = track.status !== "on_track";
  const qTarget = behind ? Math.round(plan.questionVolume * 1.15) : plan.questionVolume;
  const lTarget = behind && plan.lessonsToFinish > 0
    ? Math.max(1, plan.lessonsToFinish - 1)
    : plan.lessonsToFinish;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        paddingTop: "0.875rem",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {[
        { label: "Questions", value: `${qTarget}/wk`, color: "var(--accent-primary)", href: "/app/questions" },
        { label: "Lessons", value: `${lTarget}/wk`, color: "var(--semantic-info)", href: "/app/lessons" },
        { label: "Flash sessions", value: `${plan.flashcardSessions}/wk`, color: "var(--semantic-success)", href: "/app/flashcards" },
      ].map(({ label, value, color, href }) => (
        <Link
          key={label}
          href={href}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "7px 13px",
            borderRadius: "0.625rem",
            background: `color-mix(in srgb, ${color} 7%, var(--bg-card))`,
            border: `1px solid color-mix(in srgb, ${color} 16%, var(--border-subtle))`,
            flex: "1 1 80px",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--semantic-text-muted)" }}>
            {label}
          </span>
          <span style={{ fontSize: "1.125rem", fontWeight: 900, lineHeight: 1.15, color }}>
            {value}
          </span>
          {behind && label === "Questions" && (
            <span style={{ fontSize: "0.6rem", color: "var(--semantic-danger)", fontWeight: 600, marginTop: 1 }}>
              +15% (catch-up)
            </span>
          )}
        </Link>
      ))}

      {/* Mock timing note */}
      <div
        style={{
          flex: "2 1 200px",
          padding: "7px 13px",
          borderRadius: "0.625rem",
          background: `color-mix(in srgb, var(--semantic-text-muted) 5%, var(--bg-card))`,
          border: "1px solid var(--border-subtle)",
        }}
      >
        <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--semantic-text-muted)", display: "block", marginBottom: 2 }}>
          Mock / CAT timing
        </span>
        <span style={{ fontSize: "0.8125rem", color: "var(--semantic-text-secondary)", lineHeight: 1.5 }}>
          {plan.mockTiming}
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface WeeklyPacingPanelProps {
  plan: WeeklyStudyPlan;
  planTrack: PlanTrackAssessment;
  daysUntilExam: number | null;
}

export function WeeklyPacingPanel({ plan, planTrack, daysUntilExam }: WeeklyPacingPanelProps) {
  const weekDays = buildWeekPlan(plan, planTrack, daysUntilExam);
  const isBehind = planTrack.status !== "on_track";

  return (
    <div
      style={{
        borderRadius: "1rem",
        border: `1px solid color-mix(in srgb, var(--accent-primary) 14%, var(--border-subtle))`,
        background: `color-mix(in srgb, var(--accent-primary) 4%, var(--bg-card))`,
        boxShadow: "var(--shadow-card, 0 2px 8px rgb(0 0 0 / 0.04))",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: `1px solid color-mix(in srgb, var(--accent-primary) 12%, var(--border-subtle))`,
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "var(--theme-heading-text, var(--semantic-text-primary))",
            }}
          >
            This Week&apos;s Pacing
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--semantic-text-muted)" }}>
            {plan.rationale}
          </p>
        </div>
        {isBehind && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 99,
              background: "color-mix(in srgb, var(--semantic-warning) 10%, var(--bg-card))",
              border: "1px solid color-mix(in srgb, var(--semantic-warning) 22%, var(--border-subtle))",
              fontSize: "0.6875rem",
              fontWeight: 700,
              color: "var(--semantic-warning)",
            }}
          >
            ▲ Adjusted for catch-up
          </span>
        )}
      </div>

      {/* Day grid */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        <div style={{ display: "flex", gap: "0.375rem" }}>
          {weekDays.map((day) => (
            <DayColumn key={day.dayLabel} day={day} />
          ))}
        </div>

        {/* Legend */}
        <Legend />

        {/* Weekly targets */}
        <WeeklySummaryRow plan={plan} track={planTrack} />
      </div>
    </div>
  );
}
