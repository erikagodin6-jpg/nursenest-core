import { CalendarClock, Flame, Sparkles, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { PrimaryActionCard } from "@/components/student/dashboard/primary-action-card";
import { LearnerKpiStatCard, type LearnerKpiTrend } from "@/components/student/dashboard/learner-kpi-stat-card";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { NextBestAction } from "@/lib/learner/next-best-action";
import type { ReadinessResult, ReadinessTrend } from "@/lib/learner/readiness-score";
import { readinessBandLabel, readinessBandProgressFillClass } from "@/lib/learner/readiness-score";
import type { CountdownCopy } from "@/lib/learner/exam-timeline";
import type { BenchmarkData } from "@/lib/learner/benchmark-engine";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

function mapReadinessTrend(trend: ReadinessTrend | null): { trend: LearnerKpiTrend; label: string } | null {
  if (!trend) return null;
  if (trend === "improving") return { trend: "up", label: "Improving" };
  if (trend === "declining") return { trend: "down", label: "Needs focus" };
  return { trend: "flat", label: "Holding steady" };
}

/**
 * Premium priority band: next action + readiness KPI grid + weak/strong signals.
 * Responsive auto-fit grid — no narrow sidebar rail that compresses KPI text.
 */
export function LearnerDashboardReadinessNextStrip({
  t,
  priorityEyebrowKey,
  nextAction,
  readiness,
  countdown,
  studyStreakDays,
  weakTopicsPreview,
  strongTopicsPreview,
  benchmark,
}: {
  t: LearnerMarketingT;
  priorityEyebrowKey: string;
  nextAction: NextBestAction;
  readiness: ReadinessResult;
  countdown: CountdownCopy;
  studyStreakDays: number;
  weakTopicsPreview: WeakTopicRow[];
  strongTopicsPreview: WeakTopicRow[];
  benchmark: BenchmarkData | null;
}) {
  const showExamTile = countdown.daysRemaining != null;
  const showStreakTile = studyStreakDays > 0;
  const scorePct = readiness.score != null ? Math.min(100, Math.max(0, readiness.score)) : null;
  const fillClass = readinessBandProgressFillClass(readiness.band);
  const trajectoryFill = semanticFillClassForAccuracyPct(scorePct);
  const weakList = weakTopicsPreview.slice(0, 4);
  const strongList = strongTopicsPreview.slice(0, 4);
  const readinessTrend = mapReadinessTrend(readiness.trend);

  return (
    <section
      id="study-priority"
      className="nn-dash-band nn-dash-band--priority nn-dash-band--stack-tight nn-dash-band--hero-readiness-strip nn-cockpit-readiness-strip nn-dash-hub-priority-matrix"
      aria-label={t("learner.studyHome.sectionPriorityTitle")}
      data-testid="learner-dashboard-readiness-strip"
    >
      <div className="mb-1 min-w-0 min-h-0">
        <p className="nn-dash-report-eyebrow text-[color-mix(in_srgb,var(--semantic-brand)_88%,var(--semantic-text-muted))]">
          {t(priorityEyebrowKey)}
        </p>
        <h2 className="nn-dash-report-section-title mt-1 text-[var(--semantic-text-primary)]">
          {t("learner.studyHome.sectionPriorityTitle")}
        </h2>
      </div>

      <div className="nn-dashboard-report-layout mt-4 min-w-0 min-h-0">
        <div className="nn-dashboard-report-layout__primary min-w-0 min-h-0">
          <PrimaryActionCard action={nextAction} t={t} />
        </div>

        <div className="nn-dashboard-report-layout__kpi nn-dashboard-kpi-grid min-w-0 min-h-0">
          <LearnerKpiStatCard
            eyebrow={readinessBandLabel(readiness.band)}
            title={t("learner.dashboard.insight.readinessTitle")}
            score={scorePct ?? "—"}
            scoreSuffix={scorePct != null ? "/ 100" : undefined}
            interpretation={readiness.summary}
            href="/app/account/readiness"
            hrefLabel={t("learner.studyHome.outlookEyebrow")}
            trend={readinessTrend?.trend ?? null}
            trendLabel={readinessTrend?.label}
            accentVar="var(--semantic-info)"
            icon={<Target className="h-5 w-5" />}
            progress={
              scorePct != null ? (
                <div className="nn-progress-track-semantic flex h-2.5 min-w-0 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)]">
                  <div
                    className={`${fillClass} h-full rounded-full motion-reduce:transition-none`}
                    style={{ width: `${scorePct}%` }}
                  />
                </div>
              ) : undefined
            }
          />

          <LearnerKpiStatCard
            eyebrow={t("learner.studyHome.outlookEyebrow")}
            title={t("learner.studyHome.outlookTitle")}
            score={scorePct ?? "—"}
            scoreSuffix={scorePct != null ? "%" : undefined}
            interpretation={
              benchmark?.hasEnoughData && benchmark.percentile != null
                ? t("learner.studyHome.outlookPeerLine", { pct: benchmark.percentile })
                : t("learner.studyHome.outlookNoPeer")
            }
            accentVar="var(--semantic-chart-2)"
            icon={<TrendingUp className="h-5 w-5" />}
            progress={
              scorePct != null ? (
                <div className="nn-progress-track-semantic flex h-2.5 min-w-0 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)]">
                  <div
                    className={`${trajectoryFill} h-full rounded-full motion-reduce:transition-none`}
                    style={{ width: `${scorePct}%` }}
                  />
                </div>
              ) : undefined
            }
            footer={
              <p className="text-[11px] leading-snug text-[var(--semantic-text-muted)]">
                {t("learner.studyHome.outlookDisclaimer")}
              </p>
            }
          />

          {showExamTile ? (
            <LearnerKpiStatCard
              eyebrow={t("learner.dailyGoal.signal.exam")}
              title={countdown.primary}
              score={countdown.daysRemaining != null ? String(countdown.daysRemaining) : "—"}
              scoreSuffix={countdown.daysRemaining != null ? "days" : undefined}
              interpretation={countdown.secondary ?? undefined}
              accentVar="var(--semantic-chart-4)"
              icon={<CalendarClock className="h-5 w-5" />}
            />
          ) : null}

          {showStreakTile ? (
            <LearnerKpiStatCard
              eyebrow={t("learner.dashboard.commandCenter.streak")}
              title={t("learner.dashboard.commandCenter.streakHint")}
              score={studyStreakDays}
              scoreSuffix="days"
              accentVar="var(--semantic-success)"
              icon={<Flame className="h-5 w-5" />}
            />
          ) : null}
        </div>

        <div className="nn-dashboard-report-layout__signals nn-dashboard-signal-grid min-w-0 min-h-0">
          <LearnerSurfaceCard variant="minimal" className="min-h-0 min-w-0 p-4 sm:p-5">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] text-[var(--semantic-warning)]"
                aria-hidden
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="nn-dash-report-eyebrow text-[var(--semantic-warning)]">
                  {t("learner.studyHome.priorityWeakEyebrow")}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {t("learner.studyHome.priorityWeakTitle")}
                </p>
                {weakList.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                    {weakList.map((w) => (
                      <li key={w.topic} className="flex items-baseline gap-2 min-w-0">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-warning)]" aria-hidden />
                        <span className="min-w-0">
                          <span className="font-medium text-[var(--semantic-text-primary)]">{w.topic}</span>
                          {w.attempted > 0 ? (
                            <span className="ml-1.5 tabular-nums text-[var(--semantic-text-muted)]">
                              {t("learner.studyHome.priorityWeakMiss", {
                                miss: Math.round(w.missRate * 100),
                              })}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="nn-dash-report-copy mt-2 text-[var(--semantic-text-secondary)]">
                    {t("learner.studyHome.priorityWeakEmpty")}
                  </p>
                )}
              </div>
            </div>
          </LearnerSurfaceCard>

          <LearnerSurfaceCard variant="minimal" className="min-h-0 min-w-0 p-4 sm:p-5">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-3)_92%,var(--semantic-text-primary))]"
                aria-hidden
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="nn-dash-report-eyebrow text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))]">
                  {t("learner.studyHome.priorityStrongEyebrow")}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {t("learner.studyHome.priorityStrongTitle")}
                </p>
                {strongList.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-xs text-[var(--semantic-text-secondary)]">
                    {strongList.map((s) => (
                      <li key={s.topic} className="flex min-w-0 items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-3)]" aria-hidden />
                        <span className="min-w-0">{s.topic}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="nn-dash-report-copy mt-2 text-[var(--semantic-text-secondary)]">
                    {t("learner.studyHome.priorityStrongEmpty")}
                  </p>
                )}
              </div>
            </div>
          </LearnerSurfaceCard>
        </div>
      </div>
    </section>
  );
}
