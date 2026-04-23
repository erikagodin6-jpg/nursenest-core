"use client";

import Link from "next/link";
import type React from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, ClipboardList } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { StudyCard } from "@/components/ui/study-card";
import type { CardVariant } from "@/components/ui/study-card";
import { catPathwayExamCodeLabel, catPathwayRegionalExamLine } from "@/lib/exam-pathways/cat-pathway-labels";

export type HubLessonProgress = {
  /** Lessons the learner has marked complete for this pathway. */
  completed: number;
  /** Total lessons opened (used as denominator when catalogue count unavailable). */
  total: number;
};

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
  /** Lesson completion snapshot for signed-in learners. Displayed on the Lessons card when present. */
  hubProgress?: HubLessonProgress | null;
  /** Pathway lesson catalogue total (from server). Used as the denominator for the progress bar. */
  pathwayLessonCount?: number;
};

function LessonProgressPip({
  completed,
  catalogueTotal,
  t,
}: {
  completed: number;
  catalogueTotal: number;
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  const denominator = Math.max(catalogueTotal, completed);
  const pct = denominator > 0 ? Math.round((completed / denominator) * 100) : 0;
  return (
    <span className="mt-3 flex flex-col gap-1.5" aria-label={`${completed} of ${denominator} lessons complete`}>
      <span className="text-[12px] font-medium leading-none text-[var(--theme-muted-text)]">
        {t("nav.hub.lessonProgress", { completed, total: denominator })}
      </span>
      <span className="nn-nursing-tier-hub-lesson-progress-track h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_12%,var(--theme-page-bg))]">
        <span
          className="nn-progress-fill-semantic-success block h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </span>
    </span>
  );
}

/**
 * Premium exam-hub conversion block: three gradient cards (lessons, question bank, CAT).
 * Question bank is visually emphasized; lavender/sage/sand tones follow active `[data-theme]`.
 *
 * Each card is backed by `StudyCard` (surface="hub") for visual consistency and accessibility.
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
  hubProgress,
  pathwayLessonCount,
}: Props) {
  const { t } = useMarketingI18n();
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const practiceHref = isSignedIn ? catAppStartHref : pathwayCatIntroHref;
  const practiceLinkTarget = isSignedIn ? "app_pathway_cat_start" : "marketing_pathway_cat_intro";
  const signInContinueHref = loginWithCallback(catAppStartHref);

  type CardDef = {
    key: string;
    icon: LucideIcon;
    variant: CardVariant;
    /** Extra class applied to the hub card root — maps `--lessons` / `--cat` CSS modifiers. */
    extraClass?: string;
    ctaVariant: "primary" | "secondary";
    surface: string;
    destination_type: string;
    link_target: string;
    href: string;
    titleKey: string;
    bodyKey: string;
    ctaKey: string;
    footer?: React.ReactNode;
  };

  const lessonProgress =
    hubProgress && hubProgress.completed > 0 ? (
      <LessonProgressPip
        completed={hubProgress.completed}
        catalogueTotal={pathwayLessonCount ?? hubProgress.total}
        t={t}
      />
    ) : null;

  const questionsBadge = (
    <span className="nn-marketing-label nn-marketing-label--accent mt-2 inline-block max-w-full">
      {t("components.examPathwayHub.studyModes.questionsBadge")}
    </span>
  );

  const catExam = catPathwayExamCodeLabel(pathway);
  const catPathwayLine = catPathwayRegionalExamLine(pathway);

  const cardDefs: CardDef[] = [
    {
      key: "lessons",
      icon: BookOpen,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--lessons",
      ctaVariant: "secondary",
      surface: "primary_card_lessons",
      destination_type: "marketing_lessons",
      link_target: "marketing_lessons_hub",
      href: lessonsHref,
      titleKey: "components.examPathwayHub.studyModes.lessonsTitle",
      bodyKey: "components.examPathwayHub.studyModes.lessonsBody",
      ctaKey: "components.examPathwayHub.studyModes.lessonsCta",
      footer: lessonProgress,
    },
    {
      key: "questions",
      icon: ClipboardList,
      variant: "featured",
      extraClass: "nn-exam-hub-study-card--questions",
      ctaVariant: "primary",
      surface: "primary_card_questions",
      destination_type: "marketing_questions",
      link_target: "marketing_questions_hub",
      href: questionsHref,
      titleKey: "components.examPathwayHub.studyModes.questionsTitle",
      bodyKey: "components.examPathwayHub.studyModes.questionsBody",
      ctaKey: "components.examPathwayHub.studyModes.questionsCta",
      footer: questionsBadge,
    },
    {
      key: "cat",
      icon: Activity,
      variant: "default",
      extraClass: "nn-exam-hub-study-card--cat",
      ctaVariant: "secondary",
      surface: "primary_card_practice",
      destination_type: emphasizeCatPracticeTests ? "cat_practice_tests" : "pathway_cat_practice",
      link_target: practiceLinkTarget,
      href: practiceHref,
      titleKey: "components.examPathwayHub.studyModes.practiceCatTitle",
      bodyKey: "components.examPathwayHub.studyModes.practiceCatBody",
      ctaKey: "components.examPathwayHub.studyModes.practiceCta",
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
        {cardDefs.map((card) => {
          const trackEvent = () => {
            const props = {
              ...linkCtx,
              surface: card.surface,
              pathway_id: pathway.id,
              destination_type: card.destination_type,
              link_target: card.link_target,
            };
            trackClientEvent(PH.marketingPathwayHubCta, props);
            trackClientEvent(PH.funnelExamHubStudyIntent, {
              ...linkCtx,
              pathway_id: pathway.id,
              destination_type: card.destination_type,
              link_target: card.link_target,
            });
          };

          const title =
            card.key === "cat"
              ? t("components.examPathwayHub.studyModes.practiceCatTitle", { exam: catExam })
              : t(card.titleKey);
          const description =
            card.key === "cat"
              ? t("components.examPathwayHub.studyModes.practiceCatBody", { pathwayLine: catPathwayLine })
              : t(card.bodyKey);
          const cta =
            card.key === "cat"
              ? t("components.examPathwayHub.studyModes.practiceCta", { exam: catExam })
              : t(card.ctaKey);

          return (
            <li key={card.key} {...(card.key === "cat" ? { "data-nn-qa-cat-hub-card": catExam } : {})}>
              <StudyCard
                surface="hub"
                variant={card.variant}
                href={card.href}
                icon={card.icon}
                title={title}
                description={description}
                cta={cta}
                ctaVariant={card.ctaVariant}
                footer={card.footer}
                onClick={trackEvent}
                className={card.extraClass}
                ariaLabel={
                  card.key === "cat"
                    ? `${title} — ${catPathwayLine}`
                    : `${t(card.titleKey)} — ${pathway.shortName}`
                }
              />
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
