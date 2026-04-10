"use client";

import Link from "next/link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { buildAppTopicDrillHref, practiceTestsWeakFocusHref } from "@/lib/learner/study-loop-recommendations";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

type Props = {
  results: PracticeTestResultsJson;
  pathwayId: string | null;
};

/**
 * After CAT / practice test: readiness snapshot + explicit loop (questions → lessons → CAT).
 */
export function PracticeTestStudyLoopNext({ results, pathwayId }: Props) {
  const { t } = useMarketingI18n();
  const primaryWeak = results.weakAreas[0]?.trim() ?? null;
  const topicDrill = primaryWeak
    ? buildAppTopicDrillHref({ topic: primaryWeak, topicCode: null, pathwayId })
    : `/app/questions${pathwayId?.trim() ? `?pathwayId=${encodeURIComponent(pathwayId.trim())}` : ""}`;

  return (
    <div className="nn-study-loop-outer p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.studyLoop.afterCatTitle")}</p>
      {results.readinessLabel != null ? (
        <p className="mt-2 text-sm text-foreground">
          <span className="font-semibold">{t("learner.studyLoop.readinessLabel")}</span> {results.readinessLabel}
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">{t("learner.studyLoop.afterCatNoReadiness")}</p>
      )}
      <p className="mt-2 text-sm text-muted-foreground">{t("learner.studyLoop.afterCatLead")}</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-foreground">
        <li>
          <Link href={topicDrill} className="font-semibold text-primary underline-offset-2 hover:underline">
            {t("learner.studyLoop.stepQuestions")}
          </Link>
          {primaryWeak ? (
            <span className="text-muted-foreground"> — {primaryWeak}</span>
          ) : null}
        </li>
        <li>
          <Link href="/app/lessons" className="font-semibold text-primary underline-offset-2 hover:underline">
            {t("learner.studyLoop.stepLessons")}
          </Link>
        </li>
        <li>
          <Link
            href={practiceTestsWeakFocusHref(pathwayId)}
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            {t("learner.studyLoop.stepCat")}
          </Link>
        </li>
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/app/account/readiness"
          className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-muted/80"
        >
          {t("learner.studyLoop.fullReadiness")}
        </Link>
        <Link
          href="/app/questions"
          className="inline-flex rounded-full bg-role-cta px-4 py-2 text-xs font-semibold text-role-cta-foreground"
        >
          {t("learner.studyLoop.backToBank")}
        </Link>
      </div>
    </div>
  );
}
