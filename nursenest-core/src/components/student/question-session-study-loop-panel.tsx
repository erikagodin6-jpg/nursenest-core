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

export function QuestionSessionStudyLoopPanel({ questions, graded, pathwayId, visible }: Props) {
  const { t } = useMarketingI18n();
  const rollup = useMemo(() => buildSessionTopicRollup(questions, graded), [questions, graded]);
  const weak = useMemo(() => sessionWeakTopics(rollup), [rollup]);
  const sessionGraded = useMemo(() => Object.keys(graded).length, [graded]);
  const sessionWrong = useMemo(() => Object.values(graded).filter((g) => !g.correct).length, [graded]);

  if (!visible || sessionGraded === 0) return null;

  return (
    <aside
      className="mt-6 nn-study-loop-outer p-4 text-sm"
      aria-label={t("learner.studyLoop.sessionPanelAria")}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.studyLoop.sessionTitle")}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {t("learner.studyLoop.sessionStats", { graded: sessionGraded, wrong: sessionWrong })}
      </p>

      {weak.length > 0 ? (
        <>
          <p className="mt-3 font-semibold text-[var(--theme-heading-text)]">{t("learner.studyLoop.weakInThisSet")}</p>
          <ul className="mt-2 space-y-3">
            {weak.slice(0, 5).map((row) => {
              const drill =
                row.topicDrillHref ?? buildAppTopicDrillHref({ topic: row.topic, topicCode: row.topicCode, pathwayId });
              return (
                <li key={row.topic} className="rounded-lg border border-border/60 bg-card/80 p-3">
                  <p className="font-medium text-foreground">
                    {row.topic}{" "}
                    <span className="text-xs font-normal tabular-nums text-muted-foreground">
                      ({t("learner.studyLoop.missCount", { n: row.wrong })})
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {row.lessonHref ? (
                      <Link
                        href={row.lessonHref}
                        className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted/80"
                      >
                        {t("learner.studyLoop.openLesson")}
                      </Link>
                    ) : null}
                    <Link
                      href={drill}
                      className="inline-flex rounded-full bg-role-cta px-3 py-1.5 text-xs font-semibold text-role-cta-foreground"
                    >
                      {t("learner.studyLoop.practiceTopic")}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{t("learner.studyLoop.allCorrectThisSet")}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border/50 pt-4">
        <Link
          href={practiceTestsWeakFocusHref(pathwayId)}
          className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted/80"
          onClick={() =>
            trackClientEvent(
              PH.learnerStudyLoopCatCtaClicked,
              buildStudyLoopCatClickProps({
                href: practiceTestsWeakFocusHref(pathwayId),
                sourceSurface: "question_bank_session_panel",
                pathwayId,
              }),
            )
          }
        >
          {t("learner.studyLoop.gotoCat")}
        </Link>
        <Link href="/app/lessons" className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted/80">
          {t("learner.studyLoop.browseLessons")}
        </Link>
        <Link
          href="/app/account/readiness"
          className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted/80"
        >
          {t("learner.studyLoop.readinessDashboard")}
        </Link>
      </div>
    </aside>
  );
}
