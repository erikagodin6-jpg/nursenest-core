"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  buildAppTopicDrillHref,
  buildSessionTopicRollup,
  practiceTestsWeakFocusHref,
  sessionWeakTopics,
  type QuestionBankGradedRow,
  type QuestionBankRowForRollup,
} from "@/lib/learner/study-loop-recommendations";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { buildStudyLoopCatClickProps } from "@/lib/observability/study-loop-cat-analytics";

type Props = {
  questions: QuestionBankRowForRollup[];
  graded: Record<string, QuestionBankGradedRow>;
  pathwayId: string | null;
  /** Last question in batch, answer revealed */
  visible: boolean;
};

function accuracyTier(pct: number): { label: string; colorClass: string } {
  if (pct >= 80) return { label: "Strong", colorClass: "text-[var(--semantic-success-contrast,var(--semantic-success))]" };
  if (pct >= 60) return { label: "Good", colorClass: "text-[var(--semantic-warning-contrast)]" };
  return { label: "Needs work", colorClass: "text-[var(--semantic-danger-contrast,var(--semantic-danger))]" };
}

export function QuestionSessionStudyLoopPanel({ questions, graded, pathwayId, visible }: Props) {
  const { t } = useMarketingI18n();
  const rollup = useMemo(() => buildSessionTopicRollup(questions, graded), [questions, graded]);
  const weak = useMemo(() => sessionWeakTopics(rollup), [rollup]);
  const sessionGraded = useMemo(() => Object.keys(graded).length, [graded]);
  const sessionCorrect = useMemo(() => Object.values(graded).filter((g) => g.correct).length, [graded]);
  const sessionWrong = sessionGraded - sessionCorrect;
  const accuracyPct = sessionGraded > 0 ? Math.round((sessionCorrect / sessionGraded) * 100) : 0;
  const tier = accuracyTier(accuracyPct);
  const catHref = practiceTestsWeakFocusHref(pathwayId);

  if (!visible || sessionGraded === 0) return null;

  return (
    <aside
      className="mt-6 space-y-5"
      aria-label={t("learner.studyLoop.sessionPanelAria")}
    >
      {/* Score hero */}
      <div className="nn-session-score-hero">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {t("learner.studyLoop.sessionTitle")}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <span className="text-5xl font-bold tabular-nums leading-none text-[var(--semantic-text-primary)]">
            {accuracyPct}%
          </span>
          <span className={`text-sm font-semibold ${tier.colorClass}`}>{tier.label}</span>
        </div>
        <p className="mt-1.5 text-sm text-[var(--semantic-text-secondary)]">
          {t("learner.studyLoop.sessionStats", { graded: sessionGraded, wrong: sessionWrong })}
        </p>

        {/* Stat grid */}
        <div className="nn-session-stat-grid">
          <div className="nn-session-stat-card nn-session-stat-card--correct">
            <p className="text-2xl font-bold tabular-nums text-[var(--role-success-text,var(--semantic-success-contrast))]">
              {sessionCorrect}
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Correct
            </p>
          </div>
          <div className="nn-session-stat-card nn-session-stat-card--wrong">
            <p className="text-2xl font-bold tabular-nums text-[var(--semantic-danger-contrast,var(--semantic-danger))]">
              {sessionWrong}
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Incorrect
            </p>
          </div>
          <div className="nn-session-stat-card">
            <p className="text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
              {sessionGraded}
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Answered
            </p>
          </div>
        </div>
      </div>

      {/* Weak areas */}
      {weak.length > 0 ? (
        <div className="nn-card p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {t("learner.studyLoop.weakInThisSet")}
          </p>
          <ul className="mt-3 space-y-3">
            {weak.slice(0, 5).map((row) => {
              const drill =
                row.topicDrillHref ?? buildAppTopicDrillHref({ topic: row.topic, topicCode: row.topicCode, pathwayId });
              const wrongPct = row.total > 0 ? Math.round((row.wrong / row.total) * 100) : 0;
              return (
                <li
                  key={row.topic}
                  className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_5%,var(--semantic-surface))] p-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold leading-snug text-[var(--semantic-text-primary)]">{row.topic}</p>
                    <span className="shrink-0 rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))] px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--semantic-warning-contrast)]">
                      {wrongPct}% miss
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">
                    {t("learner.studyLoop.missCount", { n: row.wrong })} incorrect
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {row.lessonHref ? (
                      <Link
                        href={row.lessonHref}
                        className="inline-flex min-h-9 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3.5 text-xs font-semibold text-[var(--semantic-text-primary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)]"
                      >
                        {t("learner.studyLoop.openLesson")}
                      </Link>
                    ) : null}
                    <Link
                      href={drill}
                      className="nn-btn-primary inline-flex min-h-9 items-center px-4 text-xs font-semibold"
                    >
                      {t("learner.studyLoop.practiceTopic")}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="nn-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-base"
              aria-hidden
            >
              ★
            </span>
            <div>
              <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.studyLoop.allCorrectThisSet")}</p>
              <p className="mt-0.5 text-sm text-[var(--semantic-text-secondary)]">
                All topics in this session answered correctly. Keep the momentum going.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next actions */}
      <div className="nn-card p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          What to do next
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={catHref}
            className="nn-btn-primary inline-flex min-h-10 items-center px-5 text-sm font-semibold"
            onClick={() =>
              trackClientEvent(
                PH.learnerStudyLoopCatCtaClicked,
                buildStudyLoopCatClickProps({
                  href: catHref,
                  sourceSurface: "question_bank_session_panel",
                  pathwayId,
                }),
              )
            }
          >
            {t("learner.studyLoop.gotoCat")}
          </Link>
          <Link
            href="/app/lessons"
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)]"
          >
            {t("learner.studyLoop.browseLessons")}
          </Link>
          <Link
            href="/app/account/readiness"
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)]"
          >
            {t("learner.studyLoop.readinessDashboard")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
