import Link from "next/link";
import { CalendarClock, ChevronRight, Sparkles, Target } from "lucide-react";
import type { AdaptiveLearnerRecommendations } from "@/lib/learner/adaptive-recommendations";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import { readinessBandLabel } from "@/lib/learner/readiness-score";

function trajectoryShort(t: AdaptiveLearnerRecommendations["trajectory"]): string {
  switch (t) {
    case "building_foundation":
      return "Building foundation";
    case "improving":
      return "Improving";
    case "on_track":
      return "On track";
    case "needs_focused_review":
      return "Needs focus";
    case "final_review":
      return "Final stretch";
    default:
      return "—";
  }
}

export function LearnerDashboardHero({
  adaptive,
  readiness,
  practice,
  overallLessons,
  streakDays,
  flashcardReviews,
  weakTopicTitles,
  continueLesson,
}: {
  adaptive: AdaptiveLearnerRecommendations;
  readiness: ReadinessResult;
  practice: { gradedTotal: number; accuracyPct: number | null; sessionCount: number };
  overallLessons: { completed: number; total: number; pct: number };
  streakDays: number;
  flashcardReviews: number | null;
  weakTopicTitles: string[];
  /** Next incomplete lesson in scope — takes priority for the primary CTA. */
  continueLesson: { title: string; href: string } | null;
}) {
  const { countdown, primaryNext } = adaptive;
  const primaryHref = continueLesson?.href ?? primaryNext.href;
  const primaryTitle = continueLesson ? `Continue: ${continueLesson.title}` : primaryNext.title;
  const primaryReason = continueLesson
    ? "Resume your pathway where you stopped—structured content before drills keeps gaps from compounding."
    : primaryNext.reason;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-[var(--theme-card-bg)] to-[var(--theme-page-bg)] p-5 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_minmax(0,280px)] lg:items-start lg:gap-10">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Your next best step
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-3xl">
              {countdown.primary}
            </h2>
            {countdown.secondary ? (
              <p className="mt-1.5 text-sm text-muted-foreground">{countdown.secondary}</p>
            ) : null}
            {countdown.daysRemaining != null ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                <CalendarClock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {countdown.daysRemaining} day{countdown.daysRemaining === 1 ? "" : "s"} on the calendar
                {countdown.weeksRemaining != null
                  ? ` · ~${countdown.weeksRemaining} week${countdown.weeksRemaining === 1 ? "" : "s"} left`
                  : null}
              </p>
            ) : !countdown.secondary ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Add a target exam date in settings for time-aware pacing—we’ll still guide you on mastery until then.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${
                adaptive.planTrack.status === "at_risk" || adaptive.planTrack.status === "overdue"
                  ? "border-amber-500/35 bg-amber-500/[0.09] text-amber-950 dark:text-amber-100"
                  : adaptive.planTrack.status === "slightly_behind"
                    ? "border-border/80 bg-background/80 font-medium text-foreground"
                    : "border-emerald-500/30 bg-emerald-500/[0.07] font-medium text-foreground"
              }`}
            >
              {adaptive.planTrack.label}
            </span>
            <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
              {trajectoryShort(adaptive.trajectory)}
            </span>
            {countdown.urgencyLabel ? (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                {countdown.urgencyLabel}
              </span>
            ) : null}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{adaptive.planTrack.headline}</p>

          {weakTopicTitles.length > 0 ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Focus here next</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {weakTopicTitles.slice(0, 4).map((t) => (
                  <Link
                    key={t}
                    href={`/app/questions?topic=${encodeURIComponent(t)}`}
                    className="rounded-full border border-rose-500/25 bg-rose-500/[0.08] px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Answer more graded questions—your topic ledger will highlight where to drill.
            </p>
          )}

          <Link
            href={primaryHref}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:brightness-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Target className="h-4 w-4 shrink-0" aria-hidden />
            {primaryTitle}
            <ChevronRight className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          </Link>
          <p className="max-w-xl text-xs text-muted-foreground">{primaryReason}</p>
        </div>

        <aside className="rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur-sm dark:bg-slate-950/40">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Exam readiness</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums tracking-tight text-[var(--theme-heading-text)]">
              {readiness.score != null ? readiness.score : "—"}
            </span>
            {readiness.score != null ? (
              <span className="text-lg font-semibold text-muted-foreground">/100</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">{readinessBandLabel(readiness.band)}</p>
          {readiness.calibratedPreview ? (
            <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">Conservative calibration active</p>
          ) : null}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Confidence: <span className="font-medium text-foreground">{readiness.confidence}</span>
          </p>
          <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-muted-foreground">{readiness.summary}</p>
        </aside>
      </div>

      <div className="relative mt-8 grid gap-3 border-t border-border/50 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/40 bg-background/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Lessons</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
            {overallLessons.total > 0 ? `${overallLessons.pct}%` : "—"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {overallLessons.total > 0 ? `${overallLessons.completed} / ${overallLessons.total}` : "Pool loading"}
          </p>
        </div>
        <div className="rounded-xl border border-border/40 bg-background/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Scored items</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
            {practice.gradedTotal > 0 ? `${practice.accuracyPct ?? 0}%` : "—"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {practice.gradedTotal > 0
              ? `${practice.gradedTotal} graded · ${practice.sessionCount} session(s)`
              : "Finish a session to chart"}
          </p>
        </div>
        <div className="rounded-xl border border-border/40 bg-background/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Streak</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{streakDays > 0 ? streakDays : "—"}</p>
          <p className="text-[11px] text-muted-foreground">Days with activity</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-background/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Flashcards</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
            {flashcardReviews != null ? flashcardReviews : "—"}
          </p>
          <p className="text-[11px] text-muted-foreground">Reviews logged</p>
        </div>
      </div>
    </section>
  );
}
