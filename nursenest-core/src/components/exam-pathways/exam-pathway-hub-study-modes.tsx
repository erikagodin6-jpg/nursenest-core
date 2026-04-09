"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, ClipboardList } from "lucide-react";
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

const CTA_PRIMARY =
  "mt-auto inline-flex w-full items-center justify-center rounded-full nn-btn-primary px-5 py-3 text-sm font-semibold shadow-none transition group-hover:brightness-[1.03]";

const CTA_SECONDARY =
  "mt-auto inline-flex w-full items-center justify-center rounded-full border border-border bg-[var(--accent-soft)] px-5 py-3 text-sm font-semibold text-[var(--theme-primary)] transition group-hover:bg-[var(--surface-interactive-hover)] group-hover:border-[var(--border-medium)]";

/**
 * Premium exam-hub conversion block: three gradient cards (lessons, question bank, CAT).
 * Question bank is visually emphasized; lavender/sage/sand tones follow active `[data-theme]`.
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

  const cards: Array<{
    variant: "lessons" | "featured" | "cat";
    href: string;
    icon: LucideIcon;
    surface: string;
    destination_type: string;
    link_target: string;
    titleKey: string;
    bodyKey: string;
    ctaKey: string;
    ctaClass: string;
    showBadge?: boolean;
  }> = [
    {
      variant: "lessons",
      href: lessonsHref,
      icon: BookOpen,
      surface: "primary_card_lessons",
      destination_type: "marketing_lessons",
      link_target: "marketing_lessons_hub",
      titleKey: "components.examPathwayHub.studyModes.lessonsTitle",
      bodyKey: "components.examPathwayHub.studyModes.lessonsBody",
      ctaKey: "components.examPathwayHub.studyModes.lessonsCta",
      ctaClass: CTA_SECONDARY,
    },
    {
      variant: "featured",
      href: questionsHref,
      icon: ClipboardList,
      surface: "primary_card_questions",
      destination_type: "marketing_questions",
      link_target: "marketing_questions_hub",
      titleKey: "components.examPathwayHub.studyModes.questionsTitle",
      bodyKey: "components.examPathwayHub.studyModes.questionsBody",
      ctaKey: "components.examPathwayHub.studyModes.questionsCta",
      ctaClass: CTA_PRIMARY,
      showBadge: true,
    },
    {
      variant: "cat",
      href: practiceHref,
      icon: Activity,
      surface: "primary_card_practice",
      destination_type: emphasizeCatPracticeTests ? "cat_practice_tests" : "pathway_cat_practice",
      link_target: practiceLinkTarget,
      titleKey: "components.examPathwayHub.studyModes.practiceCatTitle",
      bodyKey: "components.examPathwayHub.studyModes.practiceCatBody",
      ctaKey: "components.examPathwayHub.studyModes.practiceCta",
      ctaClass: CTA_SECONDARY,
    },
  ];

  return (
    <section className="nn-exam-hub-conversion" aria-labelledby="exam-hub-primary-study-heading">
      <h2 id="exam-hub-primary-study-heading" className="nn-marketing-h2">
        {t("components.examPathwayHub.studyModes.heading")}
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
        {t("components.examPathwayHub.studyModes.subhead")}
      </p>
      <ul className="mt-8 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3 md:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const variantClass =
            card.variant === "lessons"
              ? "nn-exam-hub-study-card--lessons"
              : card.variant === "featured"
                ? "nn-exam-hub-study-card--featured"
                : "nn-exam-hub-study-card--cat";

          return (
            <li key={card.surface}>
              <MarketingTrackedLink
                href={card.href}
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: card.surface,
                  pathway_id: pathway.id,
                  destination_type: card.destination_type,
                  link_target: card.link_target,
                }}
                secondaryCapture={{
                  event: PH.funnelExamHubStudyIntent,
                  eventProps: {
                    ...linkCtx,
                    pathway_id: pathway.id,
                    destination_type: card.destination_type,
                    link_target: card.link_target,
                  },
                }}
                className={`group nn-exam-hub-study-card ${variantClass}`}
              >
                <div className="nn-exam-hub-study-card__icon" aria-hidden>
                  <Icon className="h-5 w-5" strokeWidth={1.65} />
                </div>
                <span className="nn-marketing-h3 mt-4">{t(card.titleKey)}</span>
                {card.showBadge ? (
                  <span className="nn-marketing-label nn-marketing-label--accent mt-2 inline-block max-w-full">
                    {t("components.examPathwayHub.studyModes.questionsBadge")}
                  </span>
                ) : null}
                <span className="nn-marketing-body-sm mt-2 flex-1 text-[var(--theme-body-text)]">{t(card.bodyKey)}</span>
                <span className={card.ctaClass}>{t(card.ctaKey)}</span>
              </MarketingTrackedLink>
            </li>
          );
        })}
      </ul>
      <p className="nn-marketing-caption mt-5">
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
