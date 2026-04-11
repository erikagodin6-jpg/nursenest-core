/**
 * ReadinessSummaryRow
 *
 * 4-card row directly below the hero. Each card uses a distinct coordinated surface.
 *
 * Card 1 — Exam Countdown   → soft info/accent tint
 * Card 2 — Readiness Score  → soft emphasis tint
 * Card 3 — Pass Forecast    → soft success/building tint
 * Card 4 — Today's Priority → soft warning tint
 *
 * Server component. No client state.
 */

import Link from "next/link";
import type { CoachPageData } from "@/lib/study/coach-page-data";
import type { PassReadinessForecast } from "@/lib/study/pass-readiness-forecast";

// ── Summary card shell ────────────────────────────────────────────────────────

function SummaryCard({
  children,
  surface,
  border,
}: {
  children: React.ReactNode;
  surface: string;
  border: string;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-2xl p-5"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-bold uppercase tracking-widest"
      style={{ color: "var(--semantic-text-muted)" }}
    >
      {children}
    </p>
  );
}

// ── Card 1: Exam Countdown ────────────────────────────────────────────────────

function ExamCountdownCard({
  daysUntilExam,
  examDate,
}: {
  daysUntilExam: number | null;
  examDate: string | null;
}) {
  const surface = "color-mix(in srgb, var(--semantic-info) 8%, var(--bg-page))";
  const border = "color-mix(in srgb, var(--semantic-info) 20%, transparent)";
  const accent = "var(--semantic-info)";

  if (!examDate) {
    return (
      <SummaryCard surface={surface} border={border}>
        <CardLabel>Exam countdown</CardLabel>
        <p className="text-base font-bold" style={{ color: "var(--semantic-text-primary)" }}>
          No exam date set
        </p>
        <Link
          href="/app/coach#exam-date"
          className="mt-1 w-fit rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90"
          style={{
            background: `color-mix(in srgb, ${accent} 12%, var(--semantic-surface))`,
            color: accent,
            border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
          }}
        >
          Add exam date
        </Link>
      </SummaryCard>
    );
  }

  const dateLabel = new Date(examDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  let countdownText: string;
  let urgency = false;
  if (daysUntilExam === null || daysUntilExam < 0) {
    countdownText = "Exam date passed";
  } else if (daysUntilExam === 0) {
    countdownText = "Exam today";
    urgency = true;
  } else if (daysUntilExam === 1) {
    countdownText = "Exam tomorrow";
    urgency = true;
  } else {
    countdownText = `${daysUntilExam} days`;
    urgency = daysUntilExam <= 7;
  }

  return (
    <SummaryCard
      surface={urgency ? "color-mix(in srgb, var(--semantic-warning) 8%, var(--bg-page))" : surface}
      border={urgency ? "color-mix(in srgb, var(--semantic-warning) 20%, transparent)" : border}
    >
      <CardLabel>Exam countdown</CardLabel>
      <p
        className="text-2xl font-bold tabular-nums"
        style={{ color: urgency ? "var(--semantic-warning)" : accent }}
      >
        {countdownText}
      </p>
      <p className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
        {dateLabel}
      </p>
      <Link
        href="/app/coach#exam-date"
        className="mt-1 w-fit text-xs font-medium underline underline-offset-2"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        Edit date
      </Link>
    </SummaryCard>
  );
}

// ── Card 2: Readiness Score ───────────────────────────────────────────────────

const BAND_DISPLAY = {
  insufficient_data: { label: "Gathering Data", accent: "var(--semantic-text-muted)" },
  not_ready: { label: "Building Foundation", accent: "var(--semantic-danger)" },
  improving: { label: "Improving", accent: "var(--semantic-warning)" },
  near_ready: { label: "Approaching Ready", accent: "var(--semantic-info)" },
  ready: { label: "Exam Ready", accent: "var(--semantic-success)" },
} as const;

function ReadinessScoreCard({
  score,
  band,
}: {
  score: number | null;
  band: keyof typeof BAND_DISPLAY;
}) {
  const { label, accent } = BAND_DISPLAY[band];
  return (
    <SummaryCard
      surface={`color-mix(in srgb, ${accent} 8%, var(--bg-page))`}
      border={`color-mix(in srgb, ${accent} 20%, transparent)`}
    >
      <CardLabel>Readiness score</CardLabel>
      <div className="flex items-baseline gap-2">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ color: accent }}
        >
          {score ?? "—"}
        </span>
        <span className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
          / 100
        </span>
      </div>
      <p className="text-xs font-semibold" style={{ color: accent }}>
        {label}
      </p>
      <Link
        href="/app/account/report-card"
        className="mt-1 w-fit text-xs font-medium underline underline-offset-2"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        View report card
      </Link>
    </SummaryCard>
  );
}

// ── Card 3: Pass Forecast ─────────────────────────────────────────────────────

const FORECAST_ACCENT: Record<PassReadinessForecast["band"], string> = {
  strong: "var(--semantic-success)",
  building: "var(--semantic-info)",
  early: "var(--semantic-warning)",
  insufficient: "var(--semantic-text-muted)",
};

function PassForecastCard({ forecast }: { forecast: PassReadinessForecast }) {
  const accent = FORECAST_ACCENT[forecast.band];
  return (
    <SummaryCard
      surface={`color-mix(in srgb, ${accent} 8%, var(--bg-page))`}
      border={`color-mix(in srgb, ${accent} 20%, transparent)`}
    >
      <CardLabel>Pass readiness</CardLabel>
      <p className="text-2xl font-bold tabular-nums" style={{ color: accent }}>
        {forecast.displayRange}
      </p>
      <p className="line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
        {forecast.interpretation}
      </p>
      <p className="mt-1 text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
        Estimate only · not a guarantee
      </p>
    </SummaryCard>
  );
}

// ── Card 4: Today's Priority ──────────────────────────────────────────────────

function TodaysPriorityCard({
  weakTop3,
  primaryNextTitle,
}: {
  weakTop3: string[];
  primaryNextTitle: string;
}) {
  const accent = "var(--semantic-warning)";
  const priorityLabel = weakTop3.length > 0
    ? weakTop3.slice(0, 2).join(" · ")
    : primaryNextTitle;

  return (
    <SummaryCard
      surface="color-mix(in srgb, var(--semantic-warning) 8%, var(--bg-page))"
      border="color-mix(in srgb, var(--semantic-warning) 20%, transparent)"
    >
      <CardLabel>Today&apos;s priority</CardLabel>
      <p className="text-sm font-bold leading-snug" style={{ color: "var(--semantic-text-primary)" }}>
        {priorityLabel || "Review and practice"}
      </p>
      {weakTop3.length > 0 && (
        <p className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
          Highest-impact weak areas
        </p>
      )}
      <Link
        href="#today-plan"
        className="mt-1 w-fit rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90"
        style={{
          background: `color-mix(in srgb, ${accent} 12%, var(--semantic-surface))`,
          color: accent,
          border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
        }}
      >
        See today&apos;s plan
      </Link>
    </SummaryCard>
  );
}

// ── Composed row ──────────────────────────────────────────────────────────────

export function ReadinessSummaryRow({
  daysUntilExam,
  examDate,
  readiness,
  passReadiness,
  weakTop3,
  primaryNextTitle,
}: {
  daysUntilExam: number | null;
  examDate: string | null;
  readiness: CoachPageData["readiness"];
  passReadiness: CoachPageData["passReadiness"];
  weakTop3: string[];
  primaryNextTitle: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Exam plan summary">
      <ExamCountdownCard daysUntilExam={daysUntilExam} examDate={examDate} />
      <ReadinessScoreCard score={readiness.score} band={readiness.band} />
      <PassForecastCard forecast={passReadiness} />
      <TodaysPriorityCard weakTop3={weakTop3} primaryNextTitle={primaryNextTitle} />
    </div>
  );
}
