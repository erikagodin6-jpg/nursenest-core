import Link from "next/link";
import { CalendarClock, Flame, Target } from "lucide-react";
import { PrimaryActionCard } from "@/components/student/dashboard/primary-action-card";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { NextBestAction } from "@/lib/learner/next-best-action";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import {
  readinessBandLabel,
  readinessBandProgressFillClass,
} from "@/lib/learner/readiness-score";
import type { CountdownCopy } from "@/lib/learner/exam-timeline";

/**
 * Phase 1 dashboard strip: real readiness summary + optional exam/streak tiles + primary next action.
 * No fabricated metrics — exam and streak tiles render only when backing fields are present.
 */
export function LearnerDashboardReadinessNextStrip({
  t,
  priorityEyebrowKey,
  nextAction,
  readiness,
  countdown,
  studyStreakDays,
}: {
  t: LearnerMarketingT;
  priorityEyebrowKey: string;
  nextAction: NextBestAction;
  readiness: ReadinessResult;
  countdown: CountdownCopy;
  studyStreakDays: number;
}) {
  const showExamTile = countdown.daysRemaining != null;
  const showStreakTile = studyStreakDays > 0;
  const scorePct = readiness.score != null ? Math.min(100, Math.max(0, readiness.score)) : null;
  const fillClass = readinessBandProgressFillClass(readiness.band);

  return (
    <section
      id="study-priority"
      className="nn-dash-band nn-dash-band--priority nn-dash-band--stack-tight nn-dash-band--hero-readiness-strip nn-cockpit-readiness-strip"
      aria-label={t("learner.studyHome.sectionPriorityTitle")}
      data-testid="learner-dashboard-readiness-strip"
    >
      <div className="mb-1 min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-brand)_88%,var(--semantic-text-muted))]">
          {t(priorityEyebrowKey)}
        </p>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-xl">
          {t("learner.studyHome.sectionPriorityTitle")}
        </h2>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <PrimaryActionCard action={nextAction} t={t} />
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <LearnerSurfaceCard variant="secondary" className="flex min-h-0 min-w-0 flex-col p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-info)]"
                aria-hidden
              >
                <Target className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-info)]">
                  {readinessBandLabel(readiness.band)}
                </p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {readiness.summary}
                </p>
                {scorePct != null ? (
                  <div className="mt-3">
                    <div className="nn-progress-track-semantic flex h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)]">
                      <div
                        className={`${fillClass} h-full rounded-full transition-[width] duration-700 ease-out`}
                        style={{ width: `${scorePct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs font-semibold tabular-nums text-[var(--semantic-text-primary)]">
                      {scorePct}
                      <span className="font-medium text-[var(--semantic-text-muted)]"> / 100</span>
                    </p>
                  </div>
                ) : null}
                <Link
                  href="/app/account/readiness"
                  className="mt-3 inline-flex text-xs font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                >
                  {t("learner.dashboard.insight.readinessTitle")}
                </Link>
              </div>
            </div>
          </LearnerSurfaceCard>

          {showExamTile ? (
            <LearnerSurfaceCard variant="minimal" className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))] text-[var(--semantic-chart-4)]"
                  aria-hidden
                >
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[color-mix(in_srgb,var(--semantic-chart-4)_90%,var(--semantic-text-primary))]">
                    {t("learner.dailyGoal.signal.exam")}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">
                    {countdown.primary}
                  </p>
                  {countdown.secondary ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                      {countdown.secondary}
                    </p>
                  ) : null}
                </div>
              </div>
            </LearnerSurfaceCard>
          ) : null}

          {showStreakTile ? (
            <LearnerSurfaceCard variant="minimal" className="flex min-w-0 items-start gap-3 p-4 sm:p-5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-success)]"
                aria-hidden
              >
                <Flame className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-success)]">
                  {t("learner.dashboard.commandCenter.streak")}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">{studyStreakDays}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                  {t("learner.dashboard.commandCenter.streakHint")}
                </p>
              </div>
            </LearnerSurfaceCard>
          ) : null}
        </div>
      </div>
    </section>
  );
}
