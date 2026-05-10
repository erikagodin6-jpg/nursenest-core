import Link from "next/link";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { DimensionStat } from "@/lib/learner/exam-attempt-dimension-breakdown";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import { LearnerStudySurfaceSection, LearnerSurface } from "@/components/learner-ui";

const CHART_VARS = [
  "var(--semantic-chart-1)",
  "var(--semantic-chart-2)",
  "var(--semantic-chart-3)",
  "var(--semantic-chart-4)",
  "var(--semantic-chart-5)",
] as const;

function dimRows(stats: DimensionStat[], max = 6): DimensionStat[] {
  return [...stats].sort((a, b) => a.accuracyPct - b.accuracyPct).slice(0, max);
}

/**
 * Multi-hue horizontal bars for one analytics column (body system, cognitive, etc.).
 */
export function PremiumNursingDimensionBands({
  title,
  stats,
  emptyHint,
  accuracyLabel,
}: {
  title: string;
  stats: DimensionStat[];
  emptyHint: string;
  accuracyLabel: string;
}) {
  const rows = dimRows(stats, 8);
  if (rows.length === 0) {
    return (
      <LearnerSurface tone="secondary" padding="md" radius="lg" shadow={false} className="min-h-[120px]">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{emptyHint}</p>
      </LearnerSurface>
    );
  }
  return (
    <LearnerSurface tone="secondary" padding="md" radius="lg" shadow={false} className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{title}</p>
      <ul className="mt-3 space-y-3" aria-label={title}>
        {rows.map((row, i) => {
          const fill = semanticFillClassForAccuracyPct(row.accuracyPct);
          const barTint = CHART_VARS[i % CHART_VARS.length]!;
          return (
            <li key={`${title}-${row.label}`} className="min-w-0">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-semibold text-[var(--semantic-text-primary)]">{row.label}</span>
                <span className="shrink-0 tabular-nums font-semibold text-[var(--semantic-text-secondary)]">
                  {row.accuracyPct}% · {row.correct}/{row.total}
                </span>
              </div>
              <div
                className="nn-progress-track-semantic mt-1.5 flex h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-border-soft)_75%,transparent)]"
                role="progressbar"
                aria-valuenow={row.accuracyPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${row.label}: ${accuracyLabel} ${row.accuracyPct}%`}
              >
                <div
                  className={`h-full rounded-full ${fill} transition-[width] duration-500 ease-out`}
                  style={{
                    width: `${row.accuracyPct}%`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${barTint} 35%, transparent)`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </LearnerSurface>
  );
}

function MockSparkline({ mocks, title, emptyLabel }: { mocks: PremiumDashboardSnapshot["recentMocks"]; title: string; emptyLabel: string }) {
  const pts = mocks
    .filter((m) => m.total > 0)
    .slice(0, 8)
    .map((m) => ({ pct: Math.round((m.score / m.total) * 100), id: m.at + String(m.score) }));
  if (pts.length === 0) {
    return (
      <LearnerSurface tone="supportive" padding="md" radius="lg" shadow={false}>
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-warning)]">{title}</p>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{emptyLabel}</p>
      </LearnerSurface>
    );
  }
  const maxPct = Math.max(...pts.map((p) => p.pct), 1);
  return (
    <LearnerSurface tone="supportive" padding="md" radius="lg" shadow={false}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-warning)]">{title}</p>
      <div className="mt-4 flex h-28 items-end justify-between gap-1.5 sm:gap-2" role="img" aria-label={title}>
        {pts.map((p) => {
          const h = Math.round((p.pct / maxPct) * 100);
          const fill = semanticFillClassForAccuracyPct(p.pct);
          return (
            <div key={p.id} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end justify-center">
                <div
                  className={`w-full max-w-[2.5rem] rounded-t-md ${fill} opacity-95`}
                  style={{ height: `${Math.max(12, h)}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold tabular-nums text-[var(--semantic-text-muted)]">{p.pct}%</span>
            </div>
          );
        })}
      </div>
    </LearnerSurface>
  );
}

/**
 * Premium nursing exam analytics band for `/app` dashboard.
 *
 * **Pass probability:** NurseNest does not expose a modeled NCLEX pass rate in APIs or loaders.
 * This surface documents that honestly and points learners to the readiness workspace.
 */
export function LearnerPremiumNursingAnalyticsSection({
  snapshot,
  studySnap,
  t,
}: {
  snapshot: PremiumDashboardSnapshot;
  studySnap: LearnerStudySnapshot | null;
  t: LearnerMarketingT;
}) {
  const dims = snapshot.examDimensions;
  const insights = snapshot.insights;
  const remediation = (insights?.readiness?.whatToImprove ?? snapshot.readiness.whatToImprove).slice(0, 5);
  const continuations = snapshot.lessonContinuations.slice(0, 3);
  const daily = insights?.dailyPlan;
  const trends = (studySnap?.topicTrends ?? []).slice(0, 5);

  return (
    <LearnerStudySurfaceSection
      id="study-nursing-analytics"
      eyebrow={t("learner.premiumNursingAnalytics.sectionEyebrow")}
      title={t("learner.premiumNursingAnalytics.title")}
      intro={t("learner.premiumNursingAnalytics.intro")}
      tone="primary"
      surfacePadding="md"
      className="nn-dash-band nn-dash-band--nursing-analytics nn-dash-band--stack-tight"
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <LearnerSurface tone="secondary" padding="md" radius="lg" shadow={false} className="min-w-0 xl:col-span-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-brand)]">
            {t("learner.premiumNursingAnalytics.passProbTitle")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.premiumNursingAnalytics.passProbBody")}</p>
          <Link
            href="/app/account/readiness"
            className="mt-4 inline-flex min-h-11 items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] px-4 text-sm font-semibold text-[var(--semantic-brand)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]"
          >
            {t("learner.premiumNursingAnalytics.passProbCta")}
          </Link>
        </LearnerSurface>

        <div className="min-w-0 lg:col-span-1 xl:col-span-2">
          <MockSparkline mocks={snapshot.recentMocks} title={t("learner.premiumNursingAnalytics.mockSparkTitle")} emptyLabel={t("learner.premiumNursingAnalytics.mockSparkEmpty")} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-4">
        <PremiumNursingDimensionBands
          title={t("learner.premiumNursingAnalytics.dimension.bodySystems")}
          stats={dims.byBodySystem}
          emptyHint={t("learner.premiumNursingAnalytics.dimension.empty")}
          accuracyLabel={t("learner.premiumNursingAnalytics.dimension.accuracy")}
        />
        <PremiumNursingDimensionBands
          title={t("learner.premiumNursingAnalytics.dimension.cognitive")}
          stats={dims.byCognitiveLevel}
          emptyHint={t("learner.premiumNursingAnalytics.dimension.empty")}
          accuracyLabel={t("learner.premiumNursingAnalytics.dimension.accuracy")}
        />
        <PremiumNursingDimensionBands
          title={t("learner.premiumNursingAnalytics.dimension.clientNeeds")}
          stats={dims.byClientNeeds}
          emptyHint={t("learner.premiumNursingAnalytics.dimension.empty")}
          accuracyLabel={t("learner.premiumNursingAnalytics.dimension.accuracy")}
        />
        <PremiumNursingDimensionBands
          title={t("learner.premiumNursingAnalytics.dimension.questionTypes")}
          stats={dims.byQuestionType}
          emptyHint={t("learner.premiumNursingAnalytics.dimension.empty")}
          accuracyLabel={t("learner.premiumNursingAnalytics.dimension.accuracy")}
        />
      </div>

      <div className="mt-5 grid gap-4 min-[900px]:grid-cols-2">
        <LearnerSurface tone="warm" padding="md" radius="lg" shadow={false}>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-chart-4)]">
            {t("learner.premiumNursingAnalytics.remediationTitle")}
          </p>
          {remediation.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-[var(--semantic-text-secondary)]">
              {remediation.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">{t("learner.premiumNursingAnalytics.dimension.empty")}</p>
          )}
        </LearnerSurface>

        <LearnerSurface tone="success" padding="md" radius="lg" shadow={false}>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-success)]">
            {t("learner.premiumNursingAnalytics.nextLessonsTitle")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {snapshot.continueLesson ? (
              <li>
                <Link href={snapshot.continueLesson.href} className="font-semibold text-[var(--semantic-brand)] hover:underline">
                  {snapshot.continueLesson.title}
                </Link>
              </li>
            ) : null}
            {continuations.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)] hover:underline">
                  {c.title}
                </Link>
              </li>
            ))}
            {!snapshot.continueLesson && continuations.length === 0 ? (
              <li className="text-[var(--semantic-text-muted)]">{t("learner.premiumNursingAnalytics.dimension.empty")}</li>
            ) : null}
          </ul>
          <Link
            href="/app/account/report"
            className="mt-4 inline-flex text-xs font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
          >
            {t("learner.premiumNursingAnalytics.viewFullReport")}
          </Link>
        </LearnerSurface>
      </div>

      <div className="mt-5 grid gap-4 min-[900px]:grid-cols-2">
        {daily && (daily.todayTasks.length > 0 || daily.weeklyPriorities.length > 0) ? (
          <LearnerSurface tone="primary" padding="md" radius="lg" shadow={false}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">
              {t("learner.premiumNursingAnalytics.adaptivePlanTitle")}
            </p>
            {daily.todayTasks.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                {daily.todayTasks.map((task, idx) => (
                  <li key={`${task.label}-${idx}`}>
                    <Link href={task.href} className="font-semibold text-[var(--semantic-text-primary)] hover:text-[var(--semantic-brand)]">
                      {task.label}
                    </Link>
                    <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">{task.reason}</p>
                  </li>
                ))}
              </ul>
            ) : null}
            {daily.weeklyPriorities.length > 0 ? (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-[var(--semantic-text-secondary)]">
                {daily.weeklyPriorities.slice(0, 5).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : null}
          </LearnerSurface>
        ) : (
          <LearnerSurface tone="secondary" padding="md" radius="lg" shadow={false}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              {t("learner.premiumNursingAnalytics.adaptivePlanTitle")}
            </p>
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.premiumNursingAnalytics.dimension.empty")}</p>
          </LearnerSurface>
        )}
        <LearnerSurface tone="secondary" padding="md" radius="lg" shadow={false}>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {t("learner.premiumNursingAnalytics.activityTitle")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
            {snapshot.momentumMessages.slice(0, 4).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </LearnerSurface>
      </div>

      {trends.length > 0 ? (
        <LearnerSurface tone="primary" padding="md" radius="lg" shadow={false} className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-chart-2)]">
            {t("learner.premiumNursingAnalytics.topicTrendsTitle")}
          </p>
          <ul className="mt-3 grid gap-3 min-[720px]:grid-cols-2">
            {trends.map((tr) => (
              <li key={`trend-${tr.topic}`} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))] p-3">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{tr.topic}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{tr.summary}</p>
              </li>
            ))}
          </ul>
        </LearnerSurface>
      ) : null}
    </LearnerStudySurfaceSection>
  );
}
