/**
 * MyExamPlanHero
 *
 * Top hero for the "My Exam Plan" dashboard page.
 *
 * Adaptive subtitle responds to: trajectory, exam proximity, readiness band.
 * CTA cluster: Start today's plan (primary), Review weak areas, Take a CAT.
 *
 * Surface: --surface-emphasis with soft inner chips
 */

import Link from "next/link";
import type { CoachPageData } from "@/lib/study/coach-page-data";
import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";
import type { ReadinessResult } from "@/lib/learner/readiness-score";

// ── Adaptive subtitle ─────────────────────────────────────────────────────────

function buildSubtitle(
  trajectory: AdaptiveLearnerRecommendations["trajectory"],
  readiness: ReadinessResult,
  daysUntilExam: number | null,
  weakTop3: string[],
): string {
  if (daysUntilExam !== null && daysUntilExam <= 14) {
    return "Your exam is close. This plan prioritizes practice, review, and CAT repetition.";
  }
  if (daysUntilExam !== null && daysUntilExam <= 30) {
    return "Focused remediation time. This plan emphasizes weak areas, smart review, and adaptive practice.";
  }
  if (trajectory === "final_review") {
    return "Your exam is approaching. This plan keeps you sharp with targeted review and exam-style practice.";
  }
  if (trajectory === "needs_focused_review") {
    const focus = weakTop3.slice(0, 2).join(" and ");
    return focus
      ? `This plan is focused on the topics most affecting your readiness: ${focus}.`
      : "This plan targets the weak areas most affecting your readiness score.";
  }
  if (readiness.band === "ready" || readiness.band === "near_ready") {
    return "You are approaching exam readiness. Maintain consistency and keep reviewing weak areas.";
  }
  if (trajectory === "improving") {
    return "You are improving. This plan keeps building momentum toward exam readiness.";
  }
  return "Your personalized study plan adapts to your strengths, weak areas, and exam timeline.";
}

function examLabel(daysUntilExam: number | null, examDate: string | null): string {
  if (!examDate) return "No exam date set";
  if (daysUntilExam === null) return "Exam date set";
  if (daysUntilExam <= 0) return "Exam date reached";
  if (daysUntilExam === 1) return "Exam tomorrow";
  if (daysUntilExam < 7) return `Exam in ${daysUntilExam} days`;
  const weeks = Math.round(daysUntilExam / 7);
  return `Exam in ${weeks} week${weeks !== 1 ? "s" : ""} (${daysUntilExam} days)`;
}

// ── Stat chip ─────────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl px-3 py-2 text-center"
      style={{
        background: "color-mix(in srgb, var(--semantic-surface) 70%, transparent)",
        border: "1px solid color-mix(in srgb, var(--semantic-brand) 15%, transparent)",
        backdropFilter: "blur(4px)",
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 text-sm font-bold tabular-nums"
        style={{ color: "var(--semantic-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function MyExamPlanHero({
  readiness,
  adaptive,
  daysUntilExam,
  examDate,
  streakDays,
  overallAccuracyPct,
}: Pick<CoachPageData, "readiness" | "adaptive" | "daysUntilExam" | "examDate" | "streakDays" | "overallAccuracyPct">) {
  const subtitle = buildSubtitle(
    adaptive.trajectory,
    readiness,
    daysUntilExam,
    adaptive.weakTop3,
  );

  const BAND_ACCENT: Record<ReadinessResult["band"], string> = {
    insufficient_data: "var(--semantic-text-muted)",
    not_ready: "var(--semantic-danger)",
    improving: "var(--semantic-warning)",
    near_ready: "var(--semantic-info)",
    ready: "var(--semantic-success)",
  };

  const BAND_LABELS: Record<ReadinessResult["band"], string> = {
    insufficient_data: "Gathering Data",
    not_ready: "Building Foundation",
    improving: "Improving",
    near_ready: "Approaching Ready",
    ready: "Exam Ready",
  };

  const accent = BAND_ACCENT[readiness.band];
  const bandLabel = BAND_LABELS[readiness.band];

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{
        background: "var(--surface-emphasis, color-mix(in srgb, var(--theme-primary) 8%, var(--bg-page)))",
        border: "1px solid color-mix(in srgb, var(--semantic-brand) 15%, transparent)",
      }}
    >
      {/* Decorative radial glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle at center, ${accent}, transparent 70%)`,
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      <div className="relative space-y-5">
        {/* Title row */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              NurseNest
            </p>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{
                background: `color-mix(in srgb, ${accent} 12%, var(--semantic-surface))`,
                color: accent,
                border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
              }}
            >
              {bandLabel}
            </span>
          </div>
          <h1
            className="mt-1.5 text-2xl font-bold sm:text-3xl"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            My Exam Plan
          </h1>
          <p
            className="mt-1.5 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--semantic-text-secondary)" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Quick stats chips */}
        <div className="flex flex-wrap gap-2">
          <StatChip label="Readiness" value={readiness.score != null ? `${readiness.score}` : "—"} />
          <StatChip label="Exam" value={examLabel(daysUntilExam, examDate)} />
          {streakDays > 0 && <StatChip label="Streak" value={`${streakDays}d`} />}
          {overallAccuracyPct != null && (
            <StatChip label="Accuracy" value={`${overallAccuracyPct}%`} />
          )}
        </div>

        {/* CTA cluster */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="#today-plan"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-90"
            style={{
              background: "var(--semantic-brand)",
              color: "var(--semantic-surface)",
            }}
          >
            Start today&apos;s plan
          </Link>
          <Link
            href="#weak-areas"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
            style={{
              border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
              background: "color-mix(in srgb, var(--semantic-surface) 60%, transparent)",
              color: "var(--semantic-text-primary)",
              backdropFilter: "blur(4px)",
            }}
          >
            Review weak areas
          </Link>
          <Link
            href="/app/exams"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
            style={{
              border: "1px solid var(--semantic-border-soft)",
              background: "color-mix(in srgb, var(--semantic-surface) 60%, transparent)",
              color: "var(--semantic-text-muted)",
              backdropFilter: "blur(4px)",
            }}
          >
            Take a CAT
          </Link>
        </div>
      </div>
    </div>
  );
}
