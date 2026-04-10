import type { ReactNode } from "react";
import Link from "next/link";
import type { ReportCardData } from "@/lib/learner/load-report-card-data";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";
import { readinessBandLabel, readinessBandProgressFillClass } from "@/lib/learner/readiness-score";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

function pctBar(pct: number | null, label: string) {
  const v = pct == null ? 0 : Math.min(100, Math.max(0, pct));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums font-medium text-foreground">{pct == null ? "—" : `${pct}%`}</span>
      </div>
      <div
        className="nn-progress-track-semantic"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full nn-progress-fill-semantic-success transition-[width] duration-500"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

function Na({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border/70 bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
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

  return (
    <div className="space-y-8">
      {scopeBits ? (
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("learner.reportCard.scopeLabel", { scope: scopeBits })}
        </p>
      ) : null}

      {/* Readiness summary */}
      <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)]">
        <div className="nn-section-header-learner px-5 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--theme-heading-text)]">
            {t("learner.reportCard.section.readiness")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.readinessSub")}</p>
        </div>
        <div className="p-5">
          {data.readiness.band === "insufficient_data" || data.readiness.score == null ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 px-5 py-6 text-center">
              <p className="text-sm font-medium text-[var(--theme-heading-text)]">{t("learner.reportCard.readiness.insufficientTitle")}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{t("learner.reportCard.readiness.insufficientBody")}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link href="/app/questions" className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                  {t("learner.reportCard.readiness.ctaQuestions")}
                </Link>
                <Link href="/app/exams" className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80">
                  {t("learner.reportCard.readiness.ctaMocks")}
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Score + band */}
              <div className="flex flex-col gap-3">
                <div className="nn-semantic-inset flex items-center gap-4 p-4">
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
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {t("learner.reportCard.readiness.scoreLabel")}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--theme-heading-text)]">
                      {readinessBandLabel(data.readiness.band)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t("learner.reportCard.readiness.confidence", { level: data.readiness.confidence })}
                    </p>
                  </div>
                </div>
                <div
                  className="nn-progress-track-semantic nn-progress-track-semantic--md"
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
                {data.readiness.summary ? (
                  <p className="text-xs leading-relaxed text-muted-foreground">{data.readiness.summary}</p>
                ) : null}
              </div>

              {/* Factors */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("learner.reportCard.readiness.factorsLabel")}
                </p>
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
                <div className="mt-2">
                  <Link href="/app/account/readiness" className="text-xs font-semibold text-primary underline-offset-2 hover:underline">
                    {t("learner.reportCard.readiness.fullLink")}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Overall */}
      <section className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
        <div className="nn-section-header-learner px-5 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--theme-heading-text)]">
            {t("learner.reportCard.section.overall")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.overallSub")}</p>
        </div>
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          <div className="nn-semantic-inset p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {t("learner.reportCard.bankSessionsLabel")}
            </p>
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
          </div>
          <div className="nn-semantic-inset p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {t("learner.reportCard.mockExamsLabel")}
            </p>
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
          </div>
        </div>
        {data.bankGraded.total === 0 && data.mockAggregate.sumTotal === 0 ? (
          <p className="border-t border-border/40 px-5 py-3 text-xs text-muted-foreground">{t("learner.reportCard.overallEmptyHint")}</p>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pathway lesson completion */}
        <section className="rounded-2xl border border-border/60 p-5">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.pathways")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.pathwaysSub")}</p>
          {data.pathways.some((p) => p.lessonsTotal > 0) ? (
            <ul className="mt-4 space-y-4">
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
            <div className="mt-4">
              <Na>{t("learner.reportCard.pathwaysNa")}</Na>
            </div>
          )}
        </section>

        {/* Question tier accuracy (bank / sessions) */}
        <section className="rounded-2xl border border-border/60 p-5">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.questionTier")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.questionTierSub")}</p>
          {data.byQuestionTier.length > 0 ? (
            <ul className="mt-4 space-y-4">
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
            <div className="mt-4">
              <Na>{t("learner.reportCard.questionTierNa")}</Na>
            </div>
          )}
        </section>
      </div>

      {/* Mock accuracy by exam tier */}
      <section className="rounded-2xl border border-border/60 p-5">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.mockTier")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.mockTierSub")}</p>
        {data.mockByExamTier.length > 0 ? (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {data.mockByExamTier.map((m) => (
              <li key={m.tierKey} className="nn-semantic-inset p-4">
                <p className="text-sm font-medium text-foreground">{m.displayLabel}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("learner.reportCard.mockTierAttempts", { n: m.attempts })}
                </p>
                {pctBar(m.accuracyPct, t("learner.reportCard.accuracy"))}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <Na>{t("learner.reportCard.mockTierNa")}</Na>
          </div>
        )}
      </section>

      {/* Topic performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/60 p-5">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.weakTopics")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.weakTopicsSub")}</p>
          {data.weakTopics.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {data.weakTopics.map((w) => (
                <li
                  key={w.normalizedTopic ?? w.topic}
                  className="flex flex-wrap items-center justify-between gap-2 nn-semantic-inset--risk px-3 py-2.5 text-sm"
                >
                  <span className="font-medium text-foreground">{w.topic}</span>
                  <span className="tabular-nums text-xs text-muted-foreground">
                    {w.attempted > 0
                      ? t("learner.reportCard.topicMissRate", { rate: Math.round(w.missRate) })
                      : t("learner.common.notAvailable")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <Na>{t("learner.reportCard.weakNa")}</Na>
            </div>
          )}
        </section>
        <section className="rounded-2xl border border-border/60 p-5">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.strongTopics")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.strongTopicsSub")}</p>
          {data.strongTopics.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.strongTopics.map((s) => (
                <li
                  key={s.normalizedTopic ?? s.topic}
                  className="rounded-full border border-[color-mix(in_srgb,var(--role-success)_22%,transparent)] bg-role-success-soft px-3 py-1 text-xs font-medium text-role-success-text"
                >
                  {s.topic}
                  {s.attempted > 0 ? (
                    <span className="ml-1 tabular-nums opacity-80">{Math.round(100 - s.missRate)}%</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <Na>{t("learner.reportCard.strongNa")}</Na>
            </div>
          )}
        </section>
      </div>

      {/* Topic trends */}
      {data.topicTrends.length > 0 ? (
        <section className="rounded-2xl border border-border/60 p-5">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.trends")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.trendsSub")}</p>
          <ul className="mt-4 space-y-3">
            {data.topicTrends.map((tr) => (
              <li key={tr.topic} className="nn-semantic-inset px-3 py-2 text-sm">
                <span className="font-medium text-foreground">{tr.topic}</span>
                <span className="ml-2 text-xs text-muted-foreground">· {tr.momentum}</span>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{tr.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Mock trend over time */}
      <section className="rounded-2xl border border-border/60 p-5">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.mockTrend")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.mockTrendSub")}</p>
        {data.trendEligible ? (
          <div className="mt-5 space-y-3">
            {data.mockWeeklyTrend.map((pt) => (
              <div key={pt.weekStart} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0 tabular-nums text-xs text-muted-foreground">
                  {new Date(pt.weekStart + "T12:00:00.000Z").toLocaleDateString(localeTag, { month: "short", day: "numeric" })}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {t("learner.reportCard.trendAttempts", { n: pt.attempts })}
                    </span>
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
          <div className="mt-4">
            <Na>{t("learner.reportCard.trendNa")}</Na>
          </div>
        )}
      </section>

      {/* Recent bank sessions (mocks: see full log below — avoids duplicating dashboard / top of log) */}
      <section className="rounded-2xl border border-border/60 p-5">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.recentBank")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.recentBankSub")}</p>
        {data.recentBankSessions.some((s) => s.total > 0) ? (
          <ul className="mt-4 divide-y divide-border/50">
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
          <div className="mt-4">
            <Na>{t("learner.reportCard.recentBankNa")}</Na>
          </div>
        )}
      </section>

      {/* Practice tests / CAT builder */}
      <section className="rounded-2xl border border-border/60 p-5">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.practiceTests")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.practiceTestsSub")}</p>
        {data.recentPracticeTests.length > 0 ? (
          <ul className="mt-4 divide-y divide-border/50">
            {data.recentPracticeTests.map((pt) => (
              <li key={pt.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {pt.title?.trim() || t("learner.reportCard.practiceTestUntitled")}
                    {pt.isCat ? (
                      <span className="ml-2 rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                        CAT
                      </span>
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
          <div className="mt-4">
            <Na>{t("learner.reportCard.practiceTestsNa")}</Na>
          </div>
        )}
      </section>

      {/* Next steps */}
      <section className="rounded-2xl border border-role-cta/20 bg-role-cta-soft/40 p-5">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.section.nextSteps")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("learner.reportCard.section.nextStepsSub")}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-[var(--bg-card)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.reportCard.next.lessons")}</p>
            {data.continueLesson ? (
              <Link
                href={data.continueLesson.href}
                className="mt-2 block text-sm font-medium text-foreground underline-offset-2 hover:underline"
              >
                {data.continueLesson.title}
              </Link>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{t("learner.reportCard.next.lessonsNa")}</p>
            )}
            <Link href="/app/lessons" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
              {t("learner.reportCard.next.lessonsBrowse")}
            </Link>
          </div>
          <div className="rounded-xl border border-border/50 bg-[var(--bg-card)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.reportCard.next.questions")}</p>
            {primaryTopic ? (
              <Link
                href={remediationTopicDrillHref(primaryTopic)}
                className="mt-2 block text-sm font-medium text-foreground underline-offset-2 hover:underline"
              >
                {t("learner.reportCard.next.questionsTopic", { topic: primaryTopic })}
              </Link>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{t("learner.reportCard.next.questionsNa")}</p>
            )}
            <Link href="/app/questions" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
              {t("learner.reportCard.next.questionsOpen")}
            </Link>
          </div>
          <div className="rounded-xl border border-border/50 bg-[var(--bg-card)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.reportCard.next.cat")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("learner.reportCard.next.catBody")}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/app/exams" className="inline-flex text-xs font-semibold text-primary hover:underline">
                {t("learner.reportCard.next.catMocks")}
              </Link>
              <Link
                href={primaryTopic ? remediationWeakModeTestHref(primaryTopic) : "/app/practice-tests?focus=weak"}
                className="inline-flex text-xs font-semibold text-primary hover:underline"
              >
                {t("learner.reportCard.next.catBuilder")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Full mock log */}
      <section className="overflow-hidden rounded-2xl border border-border/60">
        <div className="nn-section-header-learner--muted px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.reportCard.mockLogHeading")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("learner.reportCard.mockLogSub")}</p>
        </div>
        <div className="overflow-x-auto">
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
                      <Link
                        href={`/app/exams/attempts/${a.id}`}
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {t("learner.dashboard.insight.viewReport")}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

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
        <Link href="/app/practice-tests" className="inline-flex rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/80">
          {t("learner.profile.quickLinks.catPractice")}
        </Link>
      </div>
    </div>
  );
}
