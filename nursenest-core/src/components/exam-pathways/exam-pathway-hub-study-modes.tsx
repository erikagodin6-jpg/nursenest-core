"use client";

import Link from "next/link";
import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";

type Props = {
  pathway: ExamPathwayDefinition;
  lessonsHref: string;
  questionsHref: string;
  emphasizeCatPracticeTests?: boolean;
  npSeoAliasSegment?: string;
};

const CARD =
  "flex h-full min-h-[12rem] flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/35 hover:shadow-[var(--shadow-card)] sm:min-h-[13rem]";

export function ExamPathwayHubStudyModes({
  pathway,
  lessonsHref,
  questionsHref,
  emphasizeCatPracticeTests = false,
  npSeoAliasSegment,
}: Props) {
  const { t } = useMarketingI18n();
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const practiceHref = loginWithCallback(emphasizeCatPracticeTests ? "/app/practice-tests" : "/app/exams");

  return (
    <section className="mt-10" aria-labelledby="exam-hub-study-modes-heading">
      <h2 id="exam-hub-study-modes-heading" className="text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">
        {t("components.examPathwayHub.studyModes.heading")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted-text)]">{t("components.examPathwayHub.studyModes.subhead")}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        <li>
          <MarketingTrackedLink
            href={lessonsHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "study_modes_lessons",
              pathway_id: pathway.id,
              destination_type: "marketing_lessons",
              link_target: "marketing_lessons_hub",
            }}
            className={CARD}
          >
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">
              {t("components.examPathwayHub.studyModes.lessonsTitle")}
            </span>
            <span className="mt-2 flex-1 text-sm text-[var(--theme-body-text)]">
              {t("components.examPathwayHub.studyModes.lessonsBody")}
            </span>
            <span className="mt-4 text-sm font-semibold text-primary">{t("components.examPathwayHub.studyModes.lessonsCta")}</span>
          </MarketingTrackedLink>
        </li>
        <li>
          <MarketingTrackedLink
            href={questionsHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "study_modes_questions",
              pathway_id: pathway.id,
              destination_type: "marketing_questions",
              link_target: "marketing_questions_hub",
            }}
            className={CARD}
          >
            <ClipboardList className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">
              {t("components.examPathwayHub.studyModes.questionsTitle")}
            </span>
            <span className="mt-2 flex-1 text-sm text-[var(--theme-body-text)]">
              {t("components.examPathwayHub.studyModes.questionsBody")}
            </span>
            <span className="mt-4 text-sm font-semibold text-primary">{t("components.examPathwayHub.studyModes.questionsCta")}</span>
          </MarketingTrackedLink>
        </li>
        <li>
          <MarketingTrackedLink
            href={practiceHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "study_modes_practice",
              pathway_id: pathway.id,
              destination_type: "signup_practice",
              link_target: emphasizeCatPracticeTests ? "app_practice_tests" : "app_exams",
            }}
            className={CARD}
          >
            <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">
              {emphasizeCatPracticeTests
                ? t("components.examPathwayHub.studyModes.practiceCatTitle")
                : t("components.examPathwayHub.studyModes.practiceExamsTitle")}
            </span>
            <span className="mt-2 flex-1 text-sm text-[var(--theme-body-text)]">
              {emphasizeCatPracticeTests
                ? t("components.examPathwayHub.studyModes.practiceCatBody")
                : t("components.examPathwayHub.studyModes.practiceExamsBody")}
            </span>
            <span className="mt-4 text-sm font-semibold text-primary">{t("components.examPathwayHub.studyModes.practiceCta")}</span>
          </MarketingTrackedLink>
        </li>
      </ul>
      <p className="mt-4 text-xs text-[var(--theme-muted-text)]">
        {t("components.examPathwayHub.studyModes.signInNote")}{" "}
        <Link href={practiceHref} className="font-medium text-primary underline-offset-4 hover:underline">
          {t("components.examPathwayHub.studyModes.signInLink")}
        </Link>
      </p>
    </section>
  );
}
