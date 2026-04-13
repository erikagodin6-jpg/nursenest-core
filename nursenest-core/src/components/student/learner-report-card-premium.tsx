import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Clock, LineChart, Target } from "lucide-react";
import type { ReportCardData, MockWeeklyTrendPoint } from "@/lib/learner/load-report-card-data";
import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";
import { TrackedStudyLoopCatLink } from "@/components/student/tracked-study-loop-cat-link";
import { remediationCatPracticeHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import { readinessBandLabel, readinessBandProgressFillClass } from "@/lib/learner/readiness-score";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { PeerComparisonPanel } from "@/components/study/peer-comparison-panel";
import { LearnerSurface } from "@/components/learner-ui/learner-surface";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import {
  LearnerReportCardSection,
  LearnerReportInset,
  LearnerReportOutcomeStatStrip,
  LearnerReportPercentileSlot,
  type LearnerReportOutcomeTile,
} from "@/components/student/learner-report-card-primitives";

function pctBar(pct: number | null, label: string) {
  const v = pct == null ? 0 : Math.min(100, Math.max(0, pct));
  const fillClass = pct == null ? "nn-progress-fill-semantic-muted" : semanticFillClassForAccuracyPct(pct);
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-3 text-xs text-[var(--semantic-text-secondary)]">
        <span className="min-w-0 font-medium">{label}</span>
        <span className="shrink-0 tabular-nums text-[var(--semantic-text-primary)]">{pct == null ? "—" : `${pct}%`}</span>
      </div>
      <div
        className="nn-progress-track-semantic nn-progress-track-semantic--md"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full ${fillClass} transition-[width] duration-500`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

function Na({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--semantic-text-muted)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_65%,var(--semantic-surface))] px-5 py-8 text-center">
      <p className="text-sm leading-relaxed text-[var(--semantic-text-muted)]">{children}</p>
    </div>
  );
}

function mockWeekOverWeekHint(points: MockWeeklyTrendPoint[]): string | null {
  const active = points.filter((p) => p.attempts > 0);
  if (active.length < 2) return null;
  const prev = active[active.length - 2]!;
  const last = active[active.length - 1]!;
  if (last.avgPct > prev.avgPct + 2) return `↑ ${last.avgPct}% vs ${prev.avgPct}% (recent active weeks)`;
  if (last.avgPct < prev.avgPct - 2) return `↓ ${last.avgPct}% vs ${prev.avgPct}% (recent active weeks)`;
  return `~ ${last.avgPct}% (similar to prior active week)`;
}

function heroTiles(data: ReportCardData, t: LearnerMarketingT): LearnerReportOutcomeTile[] {
  const readinessValue =
    data.readiness.band === "insufficient_data" || data.readiness.score == null ? (
      <span className="text-xl">—</span>
    ) : (
      <span className="tabular-nums">{data.readiness.score}</span>
    );
  const readinessHint =
    data.readiness.band === "insufficient_data" || data.readiness.score == null
      ? t("learner.reportCard.readiness.insufficientTitle")
      : `${readinessBandLabel(data.readiness.band)} · ${t("learner.reportCard.readiness.confidence", { level: data.readiness.confidence })}`;

  const bankHint =
    data.bankGraded.total > 0
      ? t("learner.reportCard.bankSessionsDetail", {
          correct: data.bankGraded.correct,
          total: data.bankGraded.total,
          sessions: data.bankGraded.sessionCount,
        })
      : t("learner.reportCard.bankSessionsNa");

  const mockHint =
    data.mockAggregate.sumTotal > 0
      ? [t("learner.reportCard.mockDetail", { attempts: data.mockAggregate.attempts, items: data.mockAggregate.sumTotal }), mockWeekOverWeekHint(data.mockWeeklyTrend)]
          .filter(Boolean)
          .join(" · ")
      : t("learner.reportCard.mockNa");

  const lastWeek = data.mockWeeklyTrend[data.mockWeeklyTrend.length - 1];
  const pacingHint = lastWeek
    ? `${t("learner.reportCard.trendAttempts", { n: lastWeek.attempts })} · ${t("learner.reportCard.bankSessionsLabel")}: ${data.bankGraded.sessionCount}`
    : t("learner.reportCard.trendNa");

  return [
    { icon: Target, label: t("learner.reportCard.readiness.scoreLabel"), value: readinessValue, hint: readinessHint, accent: "c1" },
    { icon: BookOpen, label: t("learner.reportCard.bankSessionsLabel"), value: data.bankGraded.accuracyPct == null ? "—" : `${data.bankGraded.accuracyPct}%`, hint: bankHint, accent: "c2" },
    {
      icon: LineChart,
      label: t("learner.reportCard.mockExamsLabel"),
      value: data.mockAggregate.accuracyPct == null ? "—" : `${data.mockAggregate.accuracyPct}%`,
      hint: mockHint,
      accent: "c3",
    },
    { icon: Clock, label: t("learner.reportCard.section.mockTrend"), value: data.trendEligible && lastWeek ? `${lastWeek.avgPct}%` : "—", hint: pacingHint, accent: "c4" },
  ];
}

export function LearnerReportCardPremium({
  data,
  t,
  localeTag,
}: {
  data: ReportCardData;
  t: LearnerMarketingT;
  localeTag: string;
}) {
  const scopeBits = [data.scopeTier, data.scopeCountry].filter(Boolean).join(" · ");
  const primaryTopic = data.recommendedQuizTopic?.trim() || data.weakTopics[0]?.topic?.trim() || "";
  const preferredPathwayId =
    data.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? data.pathways[0]?.pathwayId ?? null;
  const catStartHref = resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId: preferredPathwayId,
    availablePathwayIds: data.pathways.map((p) => p.pathwayId),
    intent: "start",
  });

  const tiles = heroTiles(data, t);

  return (
    <div className="nn-rc-page">
      {scopeBits ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
          {t("learner.reportCard.scopeLabel", { scope: scopeBits })}
        </p>
      ) : null}

      <LearnerSurface tone="primary" padding="lg" accentTop className="overflow-hidden shadow-[var(--semantic-shadow-soft)]">
        <header className="max-w-3xl space-y-3">
          <p className="nn-ls-kicker">{t("learner.account.reportCard.title")}</p>
          <p className="text-sm leading-relaxed text-[var(--semantic-text-muted)]">{t("learner.account.reportCard.intro")}</p>
        </header>
        <div className="mt-8">
          <LearnerReportOutcomeStatStrip tiles={tiles} />
        </div>
      </LearnerSurface>

      <LearnerReportPercentileSlot
        eyebrow={t("learner.reportCard.percentileSlot.eyebrow")}
        title={t("learner.reportCard.percentileSlot.title")}
        body={t("learner.reportCard.percentileSlot.body")}
      />

      <LearnerReportCardSection
        id="rc-readiness"
        eyebrow={t("learner.reportCard.section.readinessSub")}
        title={t("learner.reportCard.section.readiness")}
        intro={null}
        tone="supportive"
      >
        {data.readiness.band === "insufficient_data" || data.readiness.score == null ? (
          <div className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--semantic-surface))] px-6 py-8 text-center">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{t("learner.reportCard.readiness.insufficientTitle")}</p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[var(--semantic-text-muted)]">{t("learner.reportCard.readiness.insufficientBody")}</p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 xs:flex-row xs:flex-wrap xs:items-center">
              <Link
                href="/app/questions"
                className="inline-flex justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-sm transition hover:opacity-95"
              >
                {t("learner.reportCard.readiness.ctaQuestions")}
              </Link>
              <Link
                href="/app/exams"
                className="inline-flex justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-brand))] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[var(--semantic-panel-muted)]"
              >
                {t("learner.reportCard.readiness.ctaMocks")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <LearnerReportInset tone="secondary">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-extrabold tabular-nums text-[var(--theme-heading-text)]"
                    style={{
                      background: `conic-gradient(var(--semantic-success) ${data.readiness.score}%, color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface)) 0)`,
                    }}
                    aria-label={`Readiness score: ${data.readiness.score} out of 100`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--semantic-surface)] text-base font-bold">
                      {data.readiness.score}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{t("learner.reportCard.readiness.scoreLabel")}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--theme-heading-text)]">{readinessBandLabel(data.readiness.band)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t("learner.reportCard.readiness.confidence", { level: data.readiness.confidence })}</p>
                  </div>
                </div>
                <div
                  className="nn-progress-track-semantic nn-progress-track-semantic--md mt-4"
                  role="progressbar"
                  aria-valuenow={data.readiness.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t("learner.reportCard.readiness.scoreLabel")}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-700 ${readinessBandProgressFillClass(data.readiness.band)}`}
                    style={{ width: `${data.readiness.score}%` }}
                  />
                </div>
                {data.readiness.summary ? <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{data.readiness.summary}</p> : null}
              </LearnerReportInset>
            </div>
            <LearnerReportInset tone="secondary">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.reportCard.readiness.factorsLabel")}</p>
              <div className="mt-3 flex flex-col gap-2">
                {data.readiness.factors.map((f) => {
                  const pct = f.maxPoints > 0 ? Math.round((f.points / f.maxPoints) * 100) : null;
                  return (
                    <div key={f.id} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 truncate text-xs text-muted-foreground">{f.label}</span>
                      <div className="flex-1">
                        {pct != null ? (
                          <div
                            className="nn-progress-track-semantic nn-progress-track-semantic--xs"
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className={`h-full rounded-full transition-[width] duration-500 ${readinessBandProgressFillClass(data.readiness.band)}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                      <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                        {f.points}/{f.maxPoints}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <Link href="/app/account/readiness" className="text-xs font-semibold text-primary underline-offset-2 hover:underline">
                  {t("learner.reportCard.readiness.fullLink")}
                </Link>
              </div>
            </LearnerReportInset>
          </div>
        )}
      </LearnerReportCardSection>

      <LearnerReportCardSection
        id="rc-performance"
        eyebrow={t("learner.reportCard.section.overallSub")}
        title={t("learner.reportCard.section.overall")}
        intro={null}
        tone="secondary"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <LearnerReportInset>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{t("learner.reportCard.bankSessionsLabel")}</p>
            {data.bankGraded.total > 0 ? (
              <>
                {pctBar(data.bankGraded.accuracyPct, t("learner.reportCard.accuracy"))}
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("learner.reportCard.bankSessionsDetail", {
                    correct: data.bankGraded.correct,
                    total: data.bankGraded.total,
                    sessions: data.bankGraded.sessionCount,
                  })}
                </p>
              </>
            ) : (
              <Na>{t("learner.reportCard.bankSessionsNa")}</Na>
            )}
          </LearnerReportInset>
          <LearnerReportInset>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{t("learner.reportCard.mockExamsLabel")}</p>
            {data.mockAggregate.sumTotal > 0 ? (
              <>
                {pctBar(data.mockAggregate.accuracyPct, t("learner.reportCard.accuracy"))}
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("learner.reportCard.mockDetail", {
                    attempts: data.mockAggregate.attempts,
                    items: data.mockAggregate.sumTotal,
                  })}
                </p>
              </>
            ) : (
              <Na>{t("learner.reportCard.mockNa")}</Na>
            )}
          </LearnerReportInset>
        </div>
        {data.bankGraded.total === 0 && data.mockAggregate.sumTotal === 0 ? (
          <p className="mt-4 text-xs text-muted-foreground">{t("learner.reportCard.overallEmptyHint")}</p>
        ) : null}
      </LearnerReportCardSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <LearnerReportCardSection
          id="rc-pathways"
          eyebrow={t("learner.reportCard.section.pathwaysSub")}
          title={t("learner.reportCard.section.pathways")}
          intro={null}
          tone="warm"
        >
          {data.pathways.some((p) => p.lessonsTotal > 0) ? (
            <ul className="space-y-4">
              {data.pathways
                .filter((p) => p.lessonsTotal > 0)
                .map((p) => (
                  <li key={p.pathwayId}>
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="font-medium text-foreground">{p.shortLabel}</span>
                      <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                        {p.lessonsCompleted}/{p.lessonsTotal}
                      </span>
                    </div>
                    {pctBar(p.lessonsPct, t("learner.reportCard.lessonsComplete"))}
                  </li>
                ))}
            </ul>
          ) : (
            <Na>{t("learner.reportCard.pathwaysNa")}</Na>
          )}
        </LearnerReportCardSection>

        <LearnerReportCardSection
          id="rc-question-tier"
          eyebrow={t("learner.reportCard.section.questionTierSub")}
          title={t("learner.reportCard.section.questionTier")}
          intro={null}
          tone="secondary"
        >
          {data.byQuestionTier.length > 0 ? (
            <ul className="space-y-4">
              {data.byQuestionTier.map((b) => (
                <li key={b.tierKey}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium text-foreground">{b.displayLabel}</span>
                    <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                      {b.correct}/{b.total}
                    </span>
                  </div>
                  {pctBar(b.accuracyPct, t("learner.reportCard.accuracy"))}
                </li>
              ))}
            </ul>
          ) : (
            <Na>{t("learner.reportCard.questionTierNa")}</Na>
          )}
        </LearnerReportCardSection>
      </div>

      <LearnerReportCardSection
        id="rc-mock-tier"
        eyebrow={t("learner.reportCard.section.mockTierSub")}
        title={t("learner.reportCard.section.mockTier")}
        intro={null}
        tone="supportive"
      >
        {data.mockByExamTier.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {data.mockByExamTier.map((m) => (
              <li key={m.tierKey}>
                <LearnerReportInset>
                  <p className="text-sm font-medium text-foreground">{m.displayLabel}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.mockTierAttempts", { n: m.attempts })}</p>
                  {pctBar(m.accuracyPct, t("learner.reportCard.accuracy"))}
                </LearnerReportInset>
              </li>
            ))}
          </ul>
        ) : (
          <Na>{t("learner.reportCard.mockTierNa")}</Na>
        )}
      </LearnerReportCardSection>

      <LearnerReportCardSection
        id="rc-topic-signals"
        eyebrow={t("learner.reportCard.section.weakTopicsSub")}
        title={t("learner.reportCard.section.weakTopics")}
        intro={null}
        tone="warm"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            {data.weakTopics.length > 0 ? (
              <ul className="space-y-2">
                {data.weakTopics.map((w) => (
                  <li
                    key={w.normalizedTopic ?? w.topic}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_55%,var(--semantic-surface))] px-3 py-2.5 text-sm"
                  >
                    <span className="font-medium text-foreground">{w.topic}</span>
                    <span className="tabular-nums text-xs text-muted-foreground">
                      {w.attempted > 0 ? t("learner.reportCard.topicMissRate", { rate: Math.round(w.missRate) }) : t("learner.common.notAvailable")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Na>{t("learner.reportCard.weakNa")}</Na>
            )}
          </div>
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_35%,var(--semantic-surface))] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-success)]">{t("learner.reportCard.section.strongTopics")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.strongTopicsSub")}</p>
            {data.strongTopics.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {data.strongTopics.map((s) => (
                  <li
                    key={s.normalizedTopic ?? s.topic}
                    className="rounded-full border border-[color-mix(in_srgb,var(--role-success)_22%,transparent)] bg-role-success-soft px-3 py-1 text-xs font-medium text-role-success-text"
                  >
                    {s.topic}
                    {s.attempted > 0 ? <span className="ml-1 tabular-nums opacity-80">{Math.round(100 - s.missRate)}%</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <Na>{t("learner.reportCard.strongNa")}</Na>
            )}
          </div>
        </div>
      </LearnerReportCardSection>

      {data.topicTrends.length > 0 ? (
        <LearnerReportCardSection
          id="rc-topic-trends"
          eyebrow={t("learner.reportCard.section.trendsSub")}
          title={t("learner.reportCard.section.trends")}
          intro={null}
          tone="supportive"
        >
          <ul className="space-y-3">
            {data.topicTrends.map((tr) => (
              <li key={tr.topic} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 text-sm shadow-[var(--semantic-shadow-soft)]">
                <span className="font-medium text-foreground">{tr.topic}</span>
                <span className="ml-2 text-xs text-[var(--semantic-chart-3)]">· {tr.momentum}</span>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{tr.summary}</p>
              </li>
            ))}
          </ul>
        </LearnerReportCardSection>
      ) : null}

      <LearnerReportCardSection
        id="rc-mock-trend"
        eyebrow={t("learner.reportCard.section.mockTrendSub")}
        title={t("learner.reportCard.section.mockTrend")}
        intro={null}
        tone="secondary"
      >
        {data.trendEligible ? (
          <div className="space-y-3">
            {data.mockWeeklyTrend.map((pt) => (
              <div key={pt.weekStart} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 tabular-nums text-xs text-muted-foreground">
                  {new Date(pt.weekStart + "T12:00:00.000Z").toLocaleDateString(localeTag, { month: "short", day: "numeric" })}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{t("learner.reportCard.trendAttempts", { n: pt.attempts })}</span>
                    <span className="tabular-nums font-medium text-foreground">{pt.avgPct}%</span>
                  </div>
                  <div className="nn-progress-track-semantic">
                    <div
                      className="h-full rounded-full nn-progress-fill-semantic-readiness transition-[width] duration-300"
                      style={{ width: `${pt.avgPct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Na>{t("learner.reportCard.trendNa")}</Na>
        )}
      </LearnerReportCardSection>

      <LearnerReportCardSection
        id="rc-sessions"
        eyebrow={`${t("learner.reportCard.section.recentBankSub")} · ${t("learner.reportCard.section.practiceTestsSub")}`}
        title={`${t("learner.reportCard.section.recentBank")} · ${t("learner.reportCard.section.practiceTests")}`}
        intro={null}
        tone="secondary"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <LearnerReportInset>
            <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{t("learner.reportCard.section.recentBank")}</p>
            {data.recentBankSessions.some((s) => s.total > 0) ? (
              <ul className="mt-3 divide-y divide-border/50">
                {data.recentBankSessions
                  .filter((s) => s.total > 0)
                  .map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{s.examTitle ?? t("learner.reportCard.sessionUntitled")}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {s.examMode === "cat" ? "CAT" : s.examMode} · {s.updatedAt.toLocaleDateString(localeTag)}
                        </p>
                      </div>
                      <span className="shrink-0 tabular-nums text-sm text-muted-foreground">
                        {s.accuracyPct != null ? `${s.accuracyPct}%` : "—"} ({s.correct}/{s.total})
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <Na>{t("learner.reportCard.recentBankNa")}</Na>
            )}
          </LearnerReportInset>
          <LearnerReportInset>
            <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{t("learner.reportCard.section.practiceTests")}</p>
            {data.recentPracticeTests.length > 0 ? (
              <ul className="mt-3 divide-y divide-border/50">
                {data.recentPracticeTests.map((pt) => (
                  <li key={pt.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {pt.title?.trim() || t("learner.reportCard.practiceTestUntitled")}
                        {pt.isCat ? (
                          <span className="ml-2 rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">CAT</span>
                        ) : null}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {pt.completedAt.toLocaleDateString(localeTag)}
                        {pt.pathwayLabel ? ` · ${pt.pathwayLabel}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 tabular-nums text-sm text-muted-foreground">
                      {pt.accuracyPct != null ? `${pt.accuracyPct}%` : "—"}
                      {pt.scoreTotal > 0 ? ` · ${pt.scoreTotal} items` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Na>{t("learner.reportCard.practiceTestsNa")}</Na>
            )}
          </LearnerReportInset>
        </div>
      </LearnerReportCardSection>

      {data.peerBenchmark && data.peerBenchmark.activationState !== "unavailable" ? (
        <div data-nn-report-peer-benchmark="">
          <PeerComparisonPanel result={data.peerBenchmark} variant="full" />
        </div>
      ) : null}

      <LearnerReportCardSection
        id="rc-next"
        eyebrow={t("learner.reportCard.section.nextStepsSub")}
        title={t("learner.reportCard.section.nextSteps")}
        intro={null}
        tone="success"
      >
        <LearnerSurface tone="success" padding="md" radius="lg" shadow={false} className="mb-6 border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))]">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-success)]">{t("learner.reportCard.next.questions")}</p>
          {primaryTopic ? (
            <Link
              href={remediationTopicDrillHref(primaryTopic, preferredPathwayId)}
              className="mt-2 block text-base font-semibold text-[var(--semantic-text-primary)] underline-offset-2 hover:underline"
            >
              {t("learner.reportCard.next.questionsTopic", { topic: primaryTopic })}
            </Link>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{t("learner.reportCard.next.questionsNa")}</p>
          )}
          <Link href="/app/questions" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
            {t("learner.reportCard.next.questionsOpen")}
          </Link>
        </LearnerSurface>
        <div className="grid gap-4 md:grid-cols-2">
          <LearnerReportInset>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.reportCard.next.lessons")}</p>
            {data.continueLesson ? (
              <Link href={data.continueLesson.href} className="mt-2 block text-sm font-medium text-foreground underline-offset-2 hover:underline">
                {data.continueLesson.title}
              </Link>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{t("learner.reportCard.next.lessonsNa")}</p>
            )}
            <Link href="/app/lessons" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
              {t("learner.reportCard.next.lessonsBrowse")}
            </Link>
          </LearnerReportInset>
          <LearnerReportInset>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.reportCard.next.cat")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("learner.reportCard.next.catBody")}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/app/exams" className="inline-flex text-xs font-semibold text-primary hover:underline">
                {t("learner.reportCard.next.catMocks")}
              </Link>
              <Link href={remediationCatPracticeHref(primaryTopic || undefined, preferredPathwayId)} className="inline-flex text-xs font-semibold text-primary hover:underline">
                {t("learner.reportCard.next.catBuilder")}
              </Link>
            </div>
          </LearnerReportInset>
        </div>
      </LearnerReportCardSection>

      <LearnerReportCardSection
        id="rc-mock-log"
        eyebrow={t("learner.reportCard.mockLogSub")}
        title={t("learner.reportCard.mockLogHeading")}
        intro={null}
        tone="secondary"
      >
        <div className="overflow-x-auto rounded-xl border border-[var(--semantic-border-soft)]">
          <table className="w-full min-w-[24rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">{t("learner.account.reportCard.colExam")}</th>
                <th className="px-4 py-3 font-medium">{t("learner.account.reportCard.colScore")}</th>
                <th className="px-4 py-3 font-medium">{t("learner.account.reportCard.colDate")}</th>
                <th className="px-4 py-3 font-medium text-right">{t("learner.reportCard.mockLogColActions")}</th>
              </tr>
            </thead>
            <tbody>
              {data.mockLog.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    {t("learner.account.reportCard.empty")}
                  </td>
                </tr>
              ) : (
                data.mockLog.map((a) => (
                  <tr key={a.id} className="border-b border-border/40 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{a.examTitle}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {a.pct}% ({a.score}/{a.total})
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.createdAt.toLocaleDateString(localeTag)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/app/exams/attempts/${a.id}`} className="font-semibold text-primary underline-offset-4 hover:underline">
                        {t("learner.dashboard.insight.viewReport")}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </LearnerReportCardSection>

      <aside className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">{t("learner.exams.page.reportCardTitle")}</p>
        <p className="mt-2 leading-relaxed">{t("learner.exams.page.reportCardBody")}</p>
      </aside>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/exams" className="inline-flex rounded-full bg-role-cta px-4 py-2.5 text-sm font-semibold text-role-cta-foreground">
          {t("learner.account.reportCard.ctaExams")}
        </Link>
        <Link href="/app/questions" className="inline-flex rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/80">
          {t("learner.profile.quickLinks.questionBank")}
        </Link>
        <TrackedStudyLoopCatLink
          href={catStartHref}
          sourceSurface="report_card_summary"
          pathwayId={preferredPathwayId}
          className="inline-flex rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/80"
        >
          {t("learner.profile.quickLinks.catPractice")}
        </TrackedStudyLoopCatLink>
      </div>
    </div>
  );
}
