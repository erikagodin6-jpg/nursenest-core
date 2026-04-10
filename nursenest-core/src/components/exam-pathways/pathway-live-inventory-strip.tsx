"use client";

import Link from "next/link";
import { SafePathwayHubLink } from "@/components/marketing/safe-pathway-hub-link";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { EMPTY_QUESTION_SNAPSHOT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { TopicCoverageIndicator } from "@/components/ui/topic-coverage-indicator";

type Variant = "hub" | "lessons" | "questions" | "cat";

export function PathwayLiveInventoryStrip({
  pathway,
  questionSnapshot: questionSnapshotProp,
  lessonCount,
  variant = "hub",
  topicCount,
  topicTotal,
}: {
  pathway: ExamPathwayDefinition;
  questionSnapshot?: PathwayQuestionBankSnapshot | null;
  lessonCount?: number;
  variant?: Variant;
  /** Number of topics/sections that currently have at least one lesson. */
  topicCount?: number;
  /** Expected total topics for this pathway (for the coverage progress bar). */
  topicTotal?: number;
}) {
  const questionSnapshot = questionSnapshotProp ?? EMPTY_QUESTION_SNAPSHOT;
  const { t } = useMarketingI18n();
  const region = pathway.countrySlug === "canada" ? "Canada" : "US";
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const examKeys = Array.isArray(pathway.contentExamKeys) ? pathway.contentExamKeys : [];

  if (questionSnapshot.status !== "ok") {
    const examKeysSuffix =
      examKeys.length > 0 ? t("components.pathwayInventory.errorExamKeys", { examKeys: examKeys.join(", ") }) : "";
    return (
      <aside
        className="nn-card mt-6 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4 text-sm text-[var(--theme-body-text)]"
        data-nn-pathway-inventory-unavailable="true"
      >
        <p className="font-semibold text-[var(--theme-heading-text)]">{t("components.pathwayInventory.badgeUnavailable")}</p>
        <p className="mt-1 text-[var(--theme-muted-text)]">
          {t("components.pathwayInventory.errorBody", { region, examKeysSuffix })}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-primary">
          <SafePathwayHubLink pathway={pathway} href={lessonsHref} className="hover:underline">
            {t("components.pathwayInventory.linkLessons")}
          </SafePathwayHubLink>
          <SafePathwayHubLink pathway={pathway} href={questionsHref} className="hover:underline">
            {t("components.pathwayInventory.linkQuestions")}
          </SafePathwayHubLink>
          <SafePathwayHubLink pathway={pathway} href={catHref} className="hover:underline">
            {t("components.pathwayInventory.linkCat")}
          </SafePathwayHubLink>
        </div>
      </aside>
    );
  }

  const { pathwayScopedCount, adaptiveEligibleCount, examKeys: snapshotExamKeys } = questionSnapshot;

  const lessonLine =
    typeof lessonCount === "number" ? (
      <p className="mt-2 text-[var(--theme-muted-text)]">
        {lessonCount === 1
          ? t("components.pathwayInventory.lessonLine", { count: lessonCount })
          : t("components.pathwayInventory.lessonLinePlural", { count: lessonCount })}
      </p>
    ) : null;

  const zeroQuestions =
    pathwayScopedCount === 0 ? (
      <p className="mt-2 rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2 text-[var(--theme-body-text)]">
        {t("components.pathwayInventory.zeroPoolPart1")}{" "}
        <SafePathwayHubLink pathway={pathway} href={lessonsHref} className="font-semibold text-primary underline">
          {t("components.pathwayInventory.zeroLessonsWord")}
        </SafePathwayHubLink>{" "}
        {t("components.pathwayInventory.zeroPoolPart2")}{" "}
        <Link href={HUB.practiceExams} className="font-semibold text-primary underline">
          {t("components.pathwayInventory.zeroExamsWord")}
        </Link>{" "}
        {t("components.pathwayInventory.zeroPoolPart3")}
      </p>
    ) : null;

  const catLine =
    variant === "cat" ? (
      <p className="mt-2 text-[var(--theme-muted-text)]">
        {t("components.pathwayInventory.catLineCatVariant", { adaptiveCount: adaptiveEligibleCount })}
      </p>
    ) : pathwayScopedCount > 0 ? (
      <p className="mt-2 text-[var(--theme-muted-text)]">
        {t("components.pathwayInventory.catLineHub", { adaptiveCount: adaptiveEligibleCount })}{" "}
        <SafePathwayHubLink pathway={pathway} href={catHref} className="font-semibold text-primary hover:underline">
          {t("components.pathwayInventory.catOpenIntro")}
        </SafePathwayHubLink>
      </p>
    ) : null;

  const showLessonFirst = variant === "hub" || variant === "lessons";

  return (
    <aside className="nn-card mt-6 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4 text-sm text-[var(--theme-body-text)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
        {t("components.pathwayInventory.badgeLive")}
      </p>
      {showLessonFirst ? lessonLine : null}

      <p className="mt-2 text-[var(--theme-body-text)]">{t("components.pathwayInventory.publishedCount", { count: pathwayScopedCount })}</p>
      {variant === "questions" ? lessonLine : null}
      {catLine}
      {zeroQuestions}

      <p className="mt-3 text-xs leading-relaxed text-[var(--theme-muted-text)]">
        {t("components.pathwayInventory.tierNote", { region, shortName: pathway.shortName })}{" "}
        {snapshotExamKeys.length > 0
          ? t("components.pathwayInventory.examNoteFiltered", { examKeys: snapshotExamKeys.join(", ") })
          : t("components.pathwayInventory.examNoteUnfiltered")}
      </p>
      {variant === "questions" ? (
        <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{t("components.pathwayInventory.questionsPageNote")}</p>
      ) : null}
      {typeof topicCount === "number" && topicCount > 0 && (variant === "hub" || variant === "lessons") ? (
        <TopicCoverageIndicator covered={topicCount} total={topicTotal} noun="topics" />
      ) : null}
    </aside>
  );
}
