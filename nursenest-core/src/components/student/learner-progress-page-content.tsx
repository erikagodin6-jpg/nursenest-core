import Link from "next/link";
import type { PathwayProgressTrackKey, ProgressPagePayload } from "@/lib/learner/load-progress-page-payload";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import {
  PathwayLessonCard,
  ProgressCardShell,
  ProgressMeter,
  ResponsiveStatRow,
  StatBlock,
} from "@/components/student/progress/progress-cards";

function trackTitle(key: PathwayProgressTrackKey, t: LearnerMarketingT): string {
  switch (key) {
    case "rn":
      return t("learner.progressPage.track.rn");
    case "rpn_lpn":
      return t("learner.progressPage.track.rpn_lpn");
    case "np":
      return t("learner.progressPage.track.np");
    case "allied":
      return t("learner.progressPage.track.allied");
    default:
      return t("learner.progressPage.track.other");
  }
}

function unreliableHint(active: boolean): string | undefined {
  return active
    ? "This number could not be verified right now — it may not reflect your real activity. Refresh to retry."
    : undefined;
}

export function LearnerProgressPageContent({
  data,
  t,
  localeTag,
}: {
  data: ProgressPagePayload;
  t: LearnerMarketingT;
  localeTag: string;
}) {
  const { lessonsPool, pathways, questionBank, exams, continueLesson, segmentReliability } = data;
  const continueBlockTrusted =
    segmentReliability.incompleteLessonProgressLookup && segmentReliability.continueLessonHrefResolution;
  const poolUnreliable =
    !segmentReliability.contentLessonInventoryCount ||
    !segmentReliability.pathwaySummaries ||
    !segmentReliability.scopedLessonProgress;
  const lessonPoolPct =
    lessonsPool.available > 0 ? Math.round((lessonsPool.completed / lessonsPool.available) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {data.loadOutcome === "error" ? (
        <section
          className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-muted/10 p-4 sm:p-5"
          data-testid="progress-load-error-banner"
        >
          <p className="font-medium text-foreground">We could not load your progress aggregates</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Numbers below may be placeholders. This is a load failure — not proof you have no activity.{" "}
            <Link href="/app/account/progress" className="font-semibold text-primary underline-offset-2 hover:underline">
              Retry
            </Link>
            {" · "}
            <Link href="/contact" className="font-semibold text-primary underline-offset-2 hover:underline">
              {t("learner.account.personal.contactLink")}
            </Link>
          </p>
        </section>
      ) : null}
      {continueLesson ? (
        <section className="rounded-2xl border border-role-cta/25 bg-role-cta-soft/50 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.progressPage.continueTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.progressPage.continueSub")}</p>
          <Link
            href={continueLesson.href}
            className="mt-3 inline-flex w-full max-w-md items-center justify-center rounded-full bg-role-cta px-4 py-3 text-sm font-semibold text-role-cta-foreground sm:w-auto"
          >
            {continueLesson.title}
          </Link>
        </section>
      ) : !continueBlockTrusted ? (
        <section
          className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-muted/10 p-4 text-sm text-muted-foreground sm:p-5"
          data-testid="progress-continue-degraded"
        >
          <p className="font-medium text-foreground">We couldn’t verify your in-progress lesson link</p>
          <p className="mt-2">
            This is not the same as having nothing to continue — refresh the page or open your lesson library to pick up
            where you left off.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/app/account/progress"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Refresh progress
            </Link>
            <Link href="/app/lessons" className="font-semibold text-primary underline-offset-2 hover:underline">
              {t("learner.progressPage.openLessons")}
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-border/70 bg-muted/10 p-4 text-sm text-muted-foreground sm:p-5">
          {t("learner.progressPage.continueEmpty")}
          <div className="mt-3">
            <Link href="/app/lessons" className="font-semibold text-primary underline-offset-2 hover:underline">
              {t("learner.progressPage.openLessons")}
            </Link>
          </div>
        </section>
      )}

      <ProgressCardShell
        title={t("learner.progressPage.lessonsCardTitle")}
        subtitle={t("learner.progressPage.lessonsCardSub")}
        actionHref="/app/lessons"
        actionLabel={t("learner.progressPage.lessonsCta")}
      >
        <ResponsiveStatRow>
          <StatBlock
            label={t("learner.progressPage.lessonsCompleted")}
            value={poolUnreliable ? "—" : lessonsPool.completed}
            hint={unreliableHint(poolUnreliable)}
          />
          <StatBlock
            label={t("learner.progressPage.lessonsInProgress")}
            value={poolUnreliable ? "—" : lessonsPool.inProgress}
            hint={unreliableHint(poolUnreliable)}
          />
          <StatBlock
            label={t("learner.progressPage.lessonsNotStarted")}
            value={poolUnreliable ? "—" : lessonsPool.notStarted}
            hint={unreliableHint(poolUnreliable)}
          />
        </ResponsiveStatRow>
        <p className="mt-4 text-xs text-muted-foreground">
          {poolUnreliable
            ? "Lesson pool totals are temporarily unavailable."
            : t("learner.progressPage.lessonsPoolNote", {
                available: String(lessonsPool.available),
              })}
        </p>
        {!poolUnreliable && lessonsPool.available > 0 ? (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{t("learner.progressPage.overallCompletion")}</span>
              <span className="tabular-nums font-medium text-foreground">{lessonPoolPct}%</span>
            </div>
            <ProgressMeter value={lessonPoolPct} ariaLabel={t("learner.progressPage.overallCompletion")} />
          </div>
        ) : null}
      </ProgressCardShell>

      <div>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("learner.progressPage.pathwaysHeading")}</h2>
            <p className="text-xs text-muted-foreground">{t("learner.progressPage.pathwaysSub")}</p>
          </div>
        </div>
        {!segmentReliability.pathwaySummaries ? (
          <p className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-4 text-sm text-muted-foreground">
            {t("learner.degraded.sectionFallbackBody")}
          </p>
        ) : pathways.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/70 bg-muted/10 p-4 text-sm text-muted-foreground">
            {t("learner.progressPage.pathwaysEmpty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {pathways.map((p) => (
              <PathwayLessonCard
                key={p.pathwayId}
                title={p.shortLabel}
                badge={trackTitle(p.trackKey, t)}
                pct={p.pct}
                completed={p.lessonsCompleted}
                inProgress={p.lessonsInProgress}
                notStarted={p.notStarted}
                total={p.lessonsTotal}
                topicsCovered={p.topicsCovered}
                topicsTotal={p.topicsTotal}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      <ProgressCardShell
        title={t("learner.progressPage.questionsCardTitle")}
        subtitle={t("learner.progressPage.questionsCardSub")}
        actionHref="/app/questions"
        actionLabel={t("learner.progressPage.questionsCta")}
      >
        <ResponsiveStatRow>
          <StatBlock
            label={t("learner.progressPage.questionsAttempted")}
            value={
              segmentReliability.topicLedgerAggregate ? questionBank.ledgerAttempted : "—"
            }
            hint={
              !segmentReliability.topicLedgerAggregate
                ? unreliableHint(true)
                : t("learner.progressPage.questionsLedgerHint")
            }
          />
          <StatBlock
            label={t("learner.progressPage.questionsAccuracy")}
            value={
              segmentReliability.topicLedgerAggregate && questionBank.ledgerAccuracyPct != null
                ? `${questionBank.ledgerAccuracyPct}%`
                : "—"
            }
            hint={
              !segmentReliability.topicLedgerAggregate
                ? unreliableHint(true)
                : t("learner.progressPage.questionsAccuracyHint")
            }
          />
          <StatBlock
            label={t("learner.progressPage.topicsPracticed")}
            value={segmentReliability.topicLedgerTopicCount ? questionBank.topicsPracticed : "—"}
            hint={
              !segmentReliability.topicLedgerTopicCount
                ? unreliableHint(true)
                : t("learner.progressPage.topicsPracticedHint")
            }
          />
        </ResponsiveStatRow>
        <div className="mt-4">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("learner.progressPage.recentSessionsLabel")}
          </p>
          <p className="text-xs text-muted-foreground">
            {!segmentReliability.recentGradedSessions
              ? "Recent scored session totals could not be loaded. This is not the same as having no practice history."
              : questionBank.recentGraded.total > 0
                ? t("learner.progressPage.recentSessionsHint", {
                    correct: String(questionBank.recentGraded.correct),
                    total: String(questionBank.recentGraded.total),
                    pct:
                      questionBank.recentGraded.accuracyPct != null
                        ? String(questionBank.recentGraded.accuracyPct)
                        : "—",
                  })
                : t("learner.progressPage.recentSessionsEmpty")}
          </p>
        </div>
      </ProgressCardShell>

      <ProgressCardShell
        title={t("learner.progressPage.examsCardTitle")}
        subtitle={t("learner.progressPage.examsCardSub")}
        actionHref="/app/practice-tests"
        actionLabel={t("learner.progressPage.examsCtaPractice")}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">{t("learner.progressPage.practiceTestsBlock")}</h3>
              <span className="rounded-full bg-primary/12 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
                {segmentReliability.practiceTestHistory ? exams.completedPracticeTests : "—"}{" "}
                {t("learner.progressPage.sessionsDone")}
              </span>
            </div>
            {!segmentReliability.practiceTestHistory ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Practice test history could not be loaded. Refresh to retry — this is not the same as having taken no tests.
              </p>
            ) : exams.recentPracticeTests.length > 0 ? (
              <ul className="mt-3 divide-y divide-border/50">
                {exams.recentPracticeTests.map((row) => (
                  <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm first:pt-0">
                    <span className="min-w-0 font-medium text-foreground">
                      {row.title?.trim() || t("learner.progressPage.untitledTest")}
                      {row.isCat ? (
                        <span className="ml-2 align-middle text-[10px] font-bold uppercase text-primary">CAT</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                      {row.accuracyPct != null ? `${row.accuracyPct}%` : "—"} · {row.completedAt.toLocaleDateString(localeTag)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">{t("learner.progressPage.noPracticeTests")}</p>
            )}
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">{t("learner.progressPage.mocksBlock")}</h3>
              <Link href="/app/exams" className="text-xs font-semibold text-primary hover:underline">
                {t("learner.progressPage.examsCtaMocks")}
              </Link>
            </div>
            {!segmentReliability.examMockHistory ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Recent mock exams could not be loaded. Retry shortly — an empty list here does not mean you have not taken mocks.
              </p>
            ) : exams.recentMocks.length > 0 ? (
              <ul className="mt-3 divide-y divide-border/50">
                {exams.recentMocks.map((m) => (
                  <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm first:pt-0">
                    <span className="min-w-0 font-medium text-foreground">{m.examTitle}</span>
                    <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                      {m.pct}% ({m.score}/{m.total})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">{t("learner.progressPage.noMocks")}</p>
            )}
          </div>
        </div>
      </ProgressCardShell>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/app/account/report-card" className="font-semibold text-primary underline-offset-2 hover:underline">
          {t("learner.progressPage.linkReportCard")}
        </Link>
        {" · "}
        <Link href="/app/account/overview" className="font-semibold text-primary underline-offset-2 hover:underline">
          {t("learner.account.progress.backToOverview")}
        </Link>
      </p>
    </div>
  );
}
