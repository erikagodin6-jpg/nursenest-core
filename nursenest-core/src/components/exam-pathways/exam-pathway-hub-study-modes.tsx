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
  /** Public intro (`…/cat`) before sign-in; signed-in learners skip to the app start screen. */
  pathwayCatIntroHref: string;
  catAppStartHref: string;
  isSignedIn: boolean;
  emphasizeCatPracticeTests?: boolean;
  npSeoAliasSegment?: string;
};

const CARD =
  "group flex h-full min-h-[17rem] flex-col rounded-2xl border-2 border-[var(--theme-card-border)] bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-[var(--shadow-card)] md:min-h-[18rem] md:p-7";

const CTA_BTN =
  "mt-auto inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition group-hover:brightness-105";

const CTA_BTN_SECONDARY =
  "mt-auto inline-flex w-full items-center justify-center rounded-full border-2 border-primary/35 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10";

/**
 * Primary exam hub study flow: three large cards (lessons, pathway question bank, CAT / practice exams).
 */
export function ExamPathwayHubPrimaryStudyCards({
  pathway,
  lessonsHref,
  questionsHref,
  pathwayCatIntroHref,
  catAppStartHref,
  isSignedIn,
  emphasizeCatPracticeTests = false,
  npSeoAliasSegment,
}: Props) {
  const { t } = useMarketingI18n();
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const practiceHref = isSignedIn ? catAppStartHref : pathwayCatIntroHref;
  const practiceLinkTarget = isSignedIn ? "app_pathway_cat_start" : "marketing_pathway_cat_intro";
  const signInContinueHref = loginWithCallback(catAppStartHref);

  return (
    <section className="mt-10" aria-labelledby="exam-hub-primary-study-heading">
      <h2 id="exam-hub-primary-study-heading" className="text-xl font-bold text-[var(--theme-heading-text)] sm:text-2xl">
        {t("components.examPathwayHub.studyModes.heading")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--theme-muted-text)]">{t("components.examPathwayHub.studyModes.subhead")}</p>
      <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-3">
        <li>
          <MarketingTrackedLink
            href={lessonsHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "primary_card_lessons",
              pathway_id: pathway.id,
              destination_type: "marketing_lessons",
              link_target: "marketing_lessons_hub",
            }}
            className={CARD}
          >
            <BookOpen className="h-7 w-7 text-primary" aria-hidden />
            <span className="mt-4 text-lg font-bold text-[var(--theme-heading-text)] md:text-xl">
              {t("components.examPathwayHub.studyModes.lessonsTitle")}
            </span>
            <span className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]">
              {t("components.examPathwayHub.studyModes.lessonsBody")}
            </span>
            <span className={CTA_BTN}>{t("components.examPathwayHub.studyModes.lessonsCta")}</span>
          </MarketingTrackedLink>
        </li>
        <li>
          <MarketingTrackedLink
            href={questionsHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "primary_card_questions",
              pathway_id: pathway.id,
              destination_type: "marketing_questions",
              link_target: "marketing_questions_hub",
            }}
            className={CARD}
          >
            <ClipboardList className="h-7 w-7 text-primary" aria-hidden />
            <span className="mt-4 text-lg font-bold text-[var(--theme-heading-text)] md:text-xl">
              {t("components.examPathwayHub.studyModes.questionsTitle")}
            </span>
            <span className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]">
              {t("components.examPathwayHub.studyModes.questionsBody")}
            </span>
            <span className={CTA_BTN_SECONDARY}>{t("components.examPathwayHub.studyModes.questionsCta")}</span>
          </MarketingTrackedLink>
        </li>
        <li>
          <MarketingTrackedLink
            href={practiceHref}
            event={PH.marketingPathwayHubCta}
            eventProps={{
              ...linkCtx,
              surface: "primary_card_practice",
              pathway_id: pathway.id,
              destination_type: emphasizeCatPracticeTests ? "cat_practice_tests" : "pathway_cat_practice",
              link_target: practiceLinkTarget,
            }}
            className={CARD}
          >
            <GraduationCap className="h-7 w-7 text-primary" aria-hidden />
            <span className="mt-4 text-lg font-bold text-[var(--theme-heading-text)] md:text-xl">
              {t("components.examPathwayHub.studyModes.practiceCatTitle")}
            </span>
            <span className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]">
              {t("components.examPathwayHub.studyModes.practiceCatBody")}
            </span>
            <span className={CTA_BTN_SECONDARY}>{t("components.examPathwayHub.studyModes.practiceCta")}</span>
          </MarketingTrackedLink>
        </li>
      </ul>
      <p className="mt-4 text-xs text-[var(--theme-muted-text)]">
        {t("components.examPathwayHub.studyModes.signInNote")}{" "}
        <Link href={signInContinueHref} className="font-medium text-primary underline-offset-4 hover:underline">
          {t("components.examPathwayHub.studyModes.signInLink")}
        </Link>
      </p>
    </section>
  );
}

/** @deprecated Use {@link ExamPathwayHubPrimaryStudyCards} */
export const ExamPathwayHubStudyModes = ExamPathwayHubPrimaryStudyCards;
