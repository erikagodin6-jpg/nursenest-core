import Link from "next/link";
import type { ReactNode } from "react";
import { Activity, ArrowRight, BookOpen, Crosshair, LayoutList, Target, Zap } from "lucide-react";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { readinessBandLabel } from "@/lib/learner/readiness-score";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { WeakAreaInsight, WeaknessTier } from "@/lib/insights/types";
import type { RecentLearnerNoteSummary } from "@/components/student/premium-learner-hub";
import { resolveStudyLoopCatDestination } from "@/lib/exam-pathways/study-loop-cat-routing";

function tierClass(tier: WeaknessTier): string {
  switch (tier) {
    case "critical":
      return "border-[color-mix(in_srgb,var(--semantic-danger)_38%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger-contrast)]";
    case "weak":
      return "border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] text-[var(--semantic-warning-contrast)]";
    case "moderate":
      return "border-[color-mix(in_srgb,var(--semantic-info)_32%,var(--semantic-border-soft))] bg-[var(--semantic-info-soft)] text-[var(--semantic-info-contrast)]";
    case "strong":
      return "border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] text-[var(--semantic-success-contrast)]";
    default:
      return "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-primary)]";
  }
}

function weakTierLabel(t: LearnerMarketingT, tier: WeaknessTier): string {
  switch (tier) {
    case "critical":
      return t("learner.dashboard.insight.tier.critical");
    case "weak":
      return t("learner.dashboard.insight.tier.weak");
    case "moderate":
      return t("learner.dashboard.insight.tier.moderate");
    case "strong":
      return t("learner.dashboard.insight.tier.strong");
    default:
      return tier;
  }
}

type ActivityRow = { id: string; atMs: number; node: ReactNode };

export function LearnerStudentDashboard({
  snapshot,
  studySnap,
  recentNotes,
  t,
}: {
  snapshot: PremiumDashboardSnapshot;
  studySnap: LearnerStudySnapshot | null;
  recentNotes: RecentLearnerNoteSummary[];
  t: LearnerMarketingT;
}) {
  const { readiness, recentMocks, studyStreakDays, insights, momentumMessages, examReadyHeadline, continueLesson } =
    snapshot;

  const scorePct = readiness.score != null ? Math.min(100, Math.max(0, readiness.score)) : null;

  const weakInsights: WeakAreaInsight[] = insights?.weakAreas.slice(0, 5) ?? [];
  const weakFallback =
    weakInsights.length === 0 && studySnap?.weakTopics.length
      ? studySnap.weakTopics.slice(0, 5).map((w) => w.topic)
      : [];

  const streakBanner =
    studyStreakDays >= 2 ? (
      <div className="mb-3 flex items-start justify-between gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2.5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.dashboard.student.momentumLine")}</p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{t("learner.dashboard.student.activityStreak", { n: studyStreakDays })}</p>
        </div>
        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      </div>
    ) : null;

  const activityRows: ActivityRow[] = [];

  for (const m of recentMocks.slice(0, 3)) {
    const atMs = new Date(m.at).getTime();
    activityRows.push({
      id: `mock-${m.id}`,
      atMs,
      node: (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 py-2.5 last:border-0">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.dashboard.student.activityMock")}
            </p>
            <p className="font-medium text-foreground">{m.examTitle}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(m.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="tabular-nums text-sm text-muted-foreground">
              {m.pct}% <span className="text-xs">({m.score}/{m.total})</span>
            </span>
            <Link href={`/app/exams/attempts/${m.id}`} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              {t("learner.dashboard.insight.viewReport")}
            </Link>
          </div>
        </div>
      ),
    });
  }

  for (const n of recentNotes.slice(0, 3)) {
    const atMs = new Date(n.updatedAt).getTime();
    activityRows.push({
      id: `note-${n.scope}-${n.contextId}`,
      atMs,
      node: (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 py-2.5 last:border-0">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.dashboard.student.activityNote")} · {n.scopeLabel}
            </p>
            <p className="font-medium text-foreground">{n.title?.trim() || t("learner.dashboard.student.activityNote")}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(n.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <Link href={n.href} className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline">
              {t("learner.dashboard.student.openNote")}
            </Link>
        </div>
      ),
    });
  }

  activityRows.sort((a, b) => b.atMs - a.atMs);
  const sortedActivity = activityRows.slice(0, 5);

  const lessonsHref = continueLesson?.href ?? "/app/lessons";
  const preferredPathwayId = snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? snapshot.pathways[0]?.pathwayId ?? null;
  const catStart = resolveStudyLoopCatDestination({
    authState: "signed_in",
    pathwayId: preferredPathwayId,
    availablePathwayIds: snapshot.pathways.map((p) => p.pathwayId),
    intent: "start",
  });

  return (
    <div className="space-y-5">
      {/* Readiness */}
      <section
        className="relative overflow-hidden rounded-2xl border border-role-premium-border bg-gradient-to-br from-role-premium-surface via-[var(--theme-card-bg)] to-primary/[0.06] p-5 shadow-sm sm:p-6"
        aria-label={t("learner.dashboard.insight.readinessTitle")}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-role-premium-glow blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-role-premium-border bg-card/80 shadow-sm">
              <Target className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-[var(--theme-heading-text)]">
                {t("learner.dashboard.insight.readinessTitle")}
              </h2>
              <p className="text-xs text-muted-foreground">{t("learner.dashboard.insight.readinessSubtitle")}</p>
              {examReadyHeadline ? (
                <p className="mt-2 text-sm font-medium text-foreground">{examReadyHeadline}</p>
              ) : null}
              <p className="mt-2 inline-flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md bg-black/5 px-2 py-0.5 dark:bg-white/10">
                  {readinessBandLabel(readiness.band)}
                </span>
                {readiness.calibratedPreview ? (
                  <span className="text-xs font-medium text-role-warning">{t("learner.dashboard.insight.calibrated")}</span>
                ) : null}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            {scorePct != null ? (
              <p className="text-4xl font-bold tabular-nums tracking-tight text-primary sm:text-5xl">{scorePct}</p>
            ) : (
              <p className="max-w-[14rem] text-sm text-muted-foreground sm:ml-auto sm:text-right">{t("learner.dashboard.insight.scorePending")}</p>
            )}
            {scorePct != null ? (
              <p className="text-xs font-medium text-muted-foreground">{t("learner.dashboard.insight.scoreSuffix")}</p>
            ) : null}
          </div>
        </div>

        {scorePct != null ? (
          <div className="relative mt-5 space-y-2">
            <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
              <span>{t("learner.dashboard.insight.scoreMeterLabel")}</span>
              <span className="tabular-nums">{scorePct}%</span>
            </div>
            <div
              className="nn-progress-track-semantic nn-progress-track-semantic--lg"
              role="progressbar"
              aria-valuenow={scorePct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full nn-progress-fill-semantic-readiness transition-[width] duration-500 ease-out"
                style={{ width: `${scorePct}%` }}
              />
            </div>
          </div>
        ) : null}

        <p className="relative mt-4 text-sm text-muted-foreground">{readiness.summary}</p>

        <div className="relative mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/app/account/readiness"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t("learner.dashboard.student.readinessCta")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {momentumMessages[0] ? (
        <p className="rounded-xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-foreground/90">{momentumMessages[0]}</p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent activity */}
        <section className="nn-card flex flex-col p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" aria-hidden />
            <div>
              <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.dashboard.student.activityTitle")}</h3>
              <p className="text-xs text-muted-foreground">{t("learner.dashboard.student.activityHint")}</p>
            </div>
          </div>
          {streakBanner || sortedActivity.length > 0 ? (
            <div className="mt-4 flex min-h-[120px] flex-1 flex-col">
              {streakBanner}
              {sortedActivity.map((r) => (
                <div key={r.id}>{r.node}</div>
              ))}
            </div>
          ) : (
            <p className="mt-4 flex-1 text-sm text-muted-foreground">{t("learner.dashboard.student.activityEmpty")}</p>
          )}
        </section>

        {/* Weak areas */}
        <section className="nn-card p-5">
          <div className="flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-role-warning-text" aria-hidden />
            <div>
              <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.dashboard.insight.weakTitle")}</h3>
              <p className="text-xs text-muted-foreground">{t("learner.dashboard.insight.weakHint")}</p>
            </div>
          </div>
          {weakInsights.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {weakInsights.map((w) => (
                <li key={`${w.topic}-${w.tier}`} className="rounded-lg border border-border/50 bg-muted/10 px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{w.topic}</span>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tierClass(w.tier)}`}
                    >
                      {weakTierLabel(t, w.tier)}
                    </span>
                  </div>
                  {w.why ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{w.why}</p> : null}
                </li>
              ))}
            </ul>
          ) : weakFallback.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {weakFallback.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-border/60 bg-muted/15 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {topic}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{t("learner.dashboard.insight.weakEmpty")}</p>
          )}
        </section>

        {/* Quick actions */}
        <section className="nn-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <LayoutList className="h-4 w-4 text-primary" aria-hidden />
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.dashboard.student.quickTitle")}</h3>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                href="/app/questions"
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/5 px-3 py-3 transition-colors hover:bg-muted/20"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{t("learner.dashboard.student.quick.continueQuestions")}</p>
                  <p className="text-xs text-muted-foreground">{t("learner.dashboard.student.quick.continueQuestionsSub")}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
            <li>
              <Link
                href={lessonsHref}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/5 px-3 py-3 transition-colors hover:bg-muted/20"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{t("learner.dashboard.student.quick.reviewLessons")}</p>
                  <p className="text-xs text-muted-foreground">{t("learner.dashboard.student.quick.reviewLessonsSub")}</p>
                  {continueLesson ? (
                    <p className="mt-1 truncate text-[11px] text-primary/90">{t("learner.dashboard.student.quick.resumeHint", { title: continueLesson.title })}</p>
                  ) : null}
                </div>
                <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              </Link>
            </li>
            <li>
              <Link
                href={catStart.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/5 px-3 py-3 transition-colors hover:bg-muted/20"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{t("learner.dashboard.student.quick.cat")}</p>
                  <p className="text-xs text-muted-foreground">{t("learner.dashboard.student.quick.catSub")}</p>
                  {catStart.kind === "generic_chooser" ? (
                    <p className="mt-1 text-[10px] text-muted-foreground">Multiple tracks? You’ll choose the pathway next.</p>
                  ) : null}
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
