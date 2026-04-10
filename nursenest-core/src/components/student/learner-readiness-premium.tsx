import type { ReactNode } from "react";
import Link from "next/link";
import type { ReadinessBand, ReadinessFactor, ReadinessResult } from "@/lib/learner/readiness-score";
import type { ReadinessPagePayload } from "@/lib/learner/load-readiness-page-payload";
import type { RecentMock } from "@/lib/learner/load-learner-dashboard";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { remediationCatPracticeHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

function bandStatusLabel(band: ReadinessBand, t: LearnerMarketingT): string {
  switch (band) {
    case "insufficient_data":
    case "not_ready":
      return t("learner.readinessPage.band.buildingFoundation");
    case "improving":
      return t("learner.readinessPage.band.improving");
    case "near_ready":
      return t("learner.readinessPage.band.nearExamReady");
    case "ready":
      return t("learner.readinessPage.band.strongReadiness");
    default:
      return band;
  }
}

function confidenceLabel(level: ReadinessResult["confidence"], t: LearnerMarketingT): string {
  switch (level) {
    case "low":
      return t("learner.readinessPage.confidence.low");
    case "medium":
      return t("learner.readinessPage.confidence.medium");
    case "high":
      return t("learner.readinessPage.confidence.high");
    default:
      return level;
  }
}

function FactorCard({ factor, t }: { factor: ReadinessFactor; t: LearnerMarketingT }) {
  const hasWeight = factor.maxPoints > 0;
  const pct = hasWeight ? Math.round((factor.points / factor.maxPoints) * 100) : null;
  return (
    <div className="nn-semantic-inset p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{factor.label}</h3>
        {hasWeight ? (
          <span className="tabular-nums text-xs font-medium text-muted-foreground">
            {t("learner.readinessPage.factorPoints", { earned: factor.points, max: factor.maxPoints })}
          </span>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">{t("learner.readinessPage.factorOmitted")}</span>
        )}
      </div>
      {pct != null ? (
        <div
          className="nn-progress-track-semantic nn-progress-track-semantic--xs mt-2"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full rounded-full nn-progress-fill-semantic-brand" style={{ width: `${pct}%` }} />
        </div>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{factor.detail}</p>
    </div>
  );
}

function MockRow({ m }: { m: RecentMock }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 py-2.5 last:border-0">
      <span className="min-w-0 truncate text-sm text-foreground">{m.examTitle}</span>
      <span className="shrink-0 tabular-nums text-sm text-muted-foreground">
        {m.pct}% ({m.score}/{m.total})
      </span>
    </div>
  );
}

function WeakTopicRowUi({ w, t }: { w: WeakTopicRow; t: LearnerMarketingT }) {
  const key = w.normalizedTopic?.trim() || w.topic;
  const drill = remediationTopicDrillHref(key);
  return (
    <li className="nn-semantic-inset--risk px-4 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-medium text-foreground">{w.topic}</span>
        {w.attempted > 0 ? (
          <span className="tabular-nums text-xs text-muted-foreground">
            ~{Math.round(w.missRate)}% {t("learner.readinessPage.weakMissLabel")}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{t("learner.common.notAvailable")}</span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={drill}
          className="inline-flex rounded-full border border-role-cta/35 bg-role-cta-soft px-3 py-1.5 text-xs font-semibold text-role-cta-on-soft hover:bg-[color-mix(in_srgb,var(--role-cta)_14%,var(--bg-card))]"
        >
          {t("learner.readinessPage.weakCtaQuestions")}
        </Link>
        <Link
          href="/app/lessons"
          className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/80"
        >
          {t("learner.readinessPage.weakCtaLessons")}
        </Link>
      </div>
    </li>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <div className="nn-section-header-learner px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-[var(--theme-heading-text)]">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function LearnerReadinessPremium({
  payload,
  t,
  localeTag,
}: {
  payload: ReadinessPagePayload;
  t: LearnerMarketingT;
  localeTag: string;
}) {
  const { snapshot, topicPerf, catSignal } = payload;
  const { readiness, practice, recentMocks, studyStreakDays } = snapshot;
  const weakTopics = topicPerf?.weakTopics ?? [];
  const weakDisplay = weakTopics.slice(0, 8);
  const primaryWeak = weakDisplay[0]?.normalizedTopic?.trim() || weakDisplay[0]?.topic?.trim() || "";
  const preferredPathwayId =
    snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ?? snapshot.pathways[0]?.pathwayId ?? null;
  const practiceNextHref = primaryWeak ? remediationTopicDrillHref(primaryWeak) : "/app/questions";
  const catNextHref = remediationCatPracticeHref(primaryWeak || undefined, preferredPathwayId);
  const lessonsNextHref = snapshot.continueLesson?.href?.trim() || "/app/lessons";

  const factorOrder: ReadinessFactor["id"][] = ["practice_accuracy", "mock_performance", "topic_errors", "lesson_completion"];
  const factorsSorted = [...readiness.factors].sort(
    (a, b) => factorOrder.indexOf(a.id) - factorOrder.indexOf(b.id),
  );

  return (
    <div className="space-y-8">
      {/* Hero: index + status + confidence */}
      <section className="rounded-2xl border border-border/60 bg-[var(--bg-card)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.readinessPage.indexLabel")}</p>
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-4xl font-bold tabular-nums tracking-tight text-[var(--theme-heading-text)]">
                {readiness.score != null ? readiness.score : "—"}
                {readiness.score != null ? <span className="text-xl font-semibold text-muted-foreground">/100</span> : null}
              </p>
              <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {bandStatusLabel(readiness.band, t)}
              </span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{readiness.summary}</p>
            <p className="text-xs text-muted-foreground">{t("learner.readinessPage.indexFootnote")}</p>
          </div>
          <div className="shrink-0 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 shadow-sm lg:max-w-xs">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.readinessPage.confidenceTitle")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{confidenceLabel(readiness.confidence, t)}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("learner.readinessPage.confidenceExplainer")}</p>
          </div>
        </div>
        {readiness.calibratedPreview ? (
          <p className="mt-4 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-warning-soft)] px-3 py-2 text-xs font-medium text-[var(--semantic-warning-contrast)]">
            {t("learner.profile.readiness.calibrationNote")}
          </p>
        ) : null}
      </section>

      <Section title={t("learner.readinessPage.section.formulaTitle")} subtitle={t("learner.readinessPage.section.formulaSub")}>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">35%</span>
            <span>{t("learner.readinessPage.formula.practice")}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">30%</span>
            <span>{t("learner.readinessPage.formula.mocks")}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">25%</span>
            <span>{t("learner.readinessPage.formula.topics")}</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">15%</span>
            <span>{t("learner.readinessPage.formula.lessons")}</span>
          </li>
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{t("learner.readinessPage.formula.renormalize")}</p>
      </Section>

      {factorsSorted.length > 0 ? (
        <Section title={t("learner.readinessPage.section.signalsTitle")} subtitle={t("learner.readinessPage.section.signalsSub")}>
          <div className="grid gap-4 md:grid-cols-2">
            {factorsSorted.map((f) => (
              <FactorCard key={f.id} factor={f} t={t} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* Consistency + recent accuracy snapshot */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title={t("learner.readinessPage.section.consistencyTitle")} subtitle={t("learner.readinessPage.section.consistencySub")}>
          <p className="text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{studyStreakDays}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.readinessPage.streakCaption")}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("learner.readinessPage.consistencyNote")}</p>
          {practice.gradedTotal > 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t("learner.readinessPage.recentAccuracyLabel")}</span>{" "}
              {practice.accuracyPct != null ? `${practice.accuracyPct}%` : "—"}{" "}
              <span className="tabular-nums">
                ({practice.gradedCorrect}/{practice.gradedTotal} {t("learner.readinessPage.gradedItems")})
              </span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{t("learner.readinessPage.noGradedPractice")}</p>
          )}
        </Section>

        <Section title={t("learner.readinessPage.section.mocksTitle")} subtitle={t("learner.readinessPage.section.mocksSub")}>
          {recentMocks.length > 0 ? (
            <div>
              {recentMocks.slice(0, 3).map((m) => (
                <MockRow key={m.id} m={m} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("learner.readinessPage.noMocks")}</p>
          )}
        </Section>
      </div>

      {/* CAT signal — informational; not a separate term in the readiness formula */}
      <Section title={t("learner.readinessPage.section.catTitle")} subtitle={t("learner.readinessPage.section.catSub")}>
        {catSignal && catSignal.completedCount > 0 ? (
          <div className="space-y-2 text-sm">
            <p className="text-foreground">
              {t("learner.readinessPage.catSummary", {
                n: catSignal.completedCount,
                pct:
                  catSignal.avgAccuracyPct != null
                    ? String(catSignal.avgAccuracyPct)
                    : t("learner.common.notAvailable"),
              })}
            </p>
            {catSignal.lastCompletedAt ? (
              <p className="text-xs text-muted-foreground">
                {t("learner.readinessPage.catLast", {
                  date: catSignal.lastCompletedAt.toLocaleDateString(localeTag),
                })}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("learner.readinessPage.catNone")}</p>
        )}
      </Section>

      {/* Weakest areas */}
      <Section title={t("learner.readinessPage.section.weakTitle")} subtitle={t("learner.readinessPage.section.weakSub")}>
        {weakDisplay.length > 0 ? (
          <ul className="space-y-3">
            {weakDisplay.map((w) => (
              <WeakTopicRowUi key={w.normalizedTopic ?? w.topic} w={w} t={t} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t("learner.readinessPage.weakEmpty")}</p>
        )}
        {readiness.holdingBack.length > 0 ? (
          <p className="mt-4 border-t border-border/50 pt-4 text-sm text-foreground">
            <span className="font-semibold">{t("learner.profile.readiness.holdingBack")} </span>
            {readiness.holdingBack.join(" · ")}
          </p>
        ) : null}
      </Section>

      {/* Recommended actions */}
      <section className="rounded-2xl border border-role-cta/20 bg-role-cta-soft/35 p-6">
        <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.profile.readiness.nextStepsTitle")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("learner.profile.readiness.nextStepsLead")}</p>
        {readiness.nextActions.length > 0 ? (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-foreground">
            {readiness.nextActions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
        {readiness.whatToImprove.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.readinessPage.focusAreas")}
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {readiness.whatToImprove.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={practiceNextHref}
            className="inline-flex rounded-full bg-role-cta px-4 py-2.5 text-sm font-semibold text-role-cta-foreground"
          >
            {t("learner.profile.readiness.ctaPractice")}
          </Link>
          <Link
            href={lessonsNextHref}
            className="inline-flex rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/80"
          >
            {t("learner.profile.readiness.ctaLessons")}
          </Link>
          <Link
            href={catNextHref}
            className="inline-flex rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/80"
          >
            {t("learner.profile.readiness.ctaCat")}
          </Link>
          <Link
            href="/app/account/report-card"
            className="inline-flex rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted/80"
          >
            {t("learner.readinessPage.linkReportCard")}
          </Link>
        </div>
      </section>
    </div>
  );
}
