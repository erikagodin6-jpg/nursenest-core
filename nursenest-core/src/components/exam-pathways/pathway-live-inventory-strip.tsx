"use client";

import Link from "next/link";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { EMPTY_QUESTION_SNAPSHOT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type Variant = "hub" | "lessons" | "questions" | "cat";

export function PathwayLiveInventoryStrip({
  pathway,
  questionSnapshot: questionSnapshotProp,
  lessonCount,
  variant = "hub",
}: {
  pathway: ExamPathwayDefinition;
  questionSnapshot?: PathwayQuestionBankSnapshot | null;
  lessonCount?: number;
  variant?: Variant;
}) {
  const questionSnapshot = questionSnapshotProp ?? EMPTY_QUESTION_SNAPSHOT;
  const { t } = useMarketingI18n();
  const region = pathway.countrySlug === "canada" ? "Canada" : "US";
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");

  if (questionSnapshot.status !== "ok") {
    const examKeysSuffix =
      pathway.contentExamKeys.length > 0
        ? t("components.pathwayInventory.errorExamKeys", { examKeys: pathway.contentExamKeys.join(", ") })
        : "";
    return (
      <aside className="nn-card mt-6 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4 text-sm text-[var(--theme-body-text)]">
        <p className="font-semibold text-[var(--theme-heading-text)]">{t("components.pathwayInventory.badgeUnavailable")}</p>
        <p className="mt-1 text-[var(--theme-muted-text)]">
          {t("components.pathwayInventory.errorBody", { region, examKeysSuffix })}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-primary">
          <Link href={lessonsHref} className="hover:underline">
            {t("components.pathwayInventory.linkLessons")}
          </Link>
          <Link href={questionsHref} className="hover:underline">
            {t("components.pathwayInventory.linkQuestions")}
          </Link>
          <Link href={catHref} className="hover:underline">
            {t("components.pathwayInventory.linkCat")}
          </Link>
        </div>
      </aside>
    );
  }

  const { pathwayScopedCount, adaptiveEligibleCount, examKeys } = questionSnapshot;

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
        <Link href={lessonsHref} className="font-semibold text-primary underline">
          {t("components.pathwayInventory.zeroLessonsWord")}
        </Link>{" "}
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
        <Link href={catHref} className="font-semibold text-primary hover:underline">
          {t("components.pathwayInventory.catOpenIntro")}
        </Link>
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
        {examKeys.length > 0
          ? t("components.pathwayInventory.examNoteFiltered", { examKeys: examKeys.join(", ") })
          : t("components.pathwayInventory.examNoteUnfiltered")}
      </p>
      {variant === "questions" ? (
        <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{t("components.pathwayInventory.questionsPageNote")}</p>
      ) : null}
    </aside>
  );
}
