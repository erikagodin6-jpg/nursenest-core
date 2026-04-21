"use client";

import Link from "next/link";
import { Activity, BookOpen, ClipboardList, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ExamPathwayWaitlistBanner } from "@/components/exam-pathways/exam-pathway-waitlist-banner";
import { NpSeoAliasHubAnalytics } from "@/components/marketing/np-seo-alias-hub-analytics";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { StudyCard } from "@/components/ui/study-card";
import type { NursingTierHubActionId, NursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { pathwayAnalyticsDimensions, trackProductEvent } from "@/lib/observability/product-analytics";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";

const ACTION_ICON: Record<NursingTierHubActionId, LucideIcon> = {
  lessons: BookOpen,
  flashcards: ClipboardList,
  practice_questions: Target,
  exams: Activity,
};

const ACTION_ORDER: NursingTierHubActionId[] = ["lessons", "flashcards", "practice_questions", "exams"];

const ACTION_CLASS: Partial<Record<NursingTierHubActionId, string>> = {
  lessons: "nn-exam-hub-study-card--lessons",
  exams: "nn-exam-hub-study-card--cat",
};

const ACTION_EVENT_TARGET: Record<NursingTierHubActionId, { surface: string; destinationType: string; linkTarget: string }> = {
  lessons: {
    surface: "tier_hub_lessons",
    destinationType: "marketing_lessons",
    linkTarget: "marketing_lessons_hub",
  },
  flashcards: {
    surface: "tier_hub_flashcards",
    destinationType: "app_flashcards",
    linkTarget: "app_flashcards",
  },
  practice_questions: {
    surface: "tier_hub_practice",
    destinationType: "marketing_questions",
    linkTarget: "marketing_questions_hub",
  },
  exams: {
    surface: "tier_hub_exams",
    destinationType: "pathway_cat_practice",
    linkTarget: "marketing_pathway_cat_intro",
  },
};

export function NursingTierHubPage({
  pathway,
  hubPath,
  content,
  npSeoAliasSegment,
  hubResume,
}: {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  content: NursingTierHubContent;
  npSeoAliasSegment?: string;
  /** Subscriber-only: when present with a lesson target, shows a compact “continue” row under the four cards. */
  hubResume?: PathwayHubResumePayload | null;
}) {
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const actionsById = new Map(content.actions.map((action) => [action.id, action]));
  const orderedActions = ACTION_ORDER.map((actionId) => actionsById.get(actionId)).filter(
    (action): action is NonNullable<typeof action> => Boolean(action),
  );
  const resumeLesson = hubResume?.lastTouched ?? hubResume?.nextRecommended ?? null;
  const resumeLessonIsLastTouched = Boolean(hubResume?.lastTouched && resumeLesson === hubResume.lastTouched);
  const resumeLessonCompleted = resumeLessonIsLastTouched ? Boolean(hubResume?.lastTouched?.completed) : false;
  const questionsAppHref = `/app/questions?pathwayId=${encodeURIComponent(pathway.id)}`;
  /** Same headline pattern for RN, PN, NP (from {@link buildNursingTierHubContent}). */
  const title = content.title;
  const geographyLabel = pathway.countrySlug === "canada" ? "Canada" : "United States";
  const examLabel = pathway.shortName === content.audienceLabel ? null : pathway.shortName;

  return (
    <>
      <FunnelExamHubViewBeacon pathway={pathway} hubPath={hubPath} />
      {npSeoAliasSegment ? (
        <NpSeoAliasHubAnalytics
          pathwayId={pathway.id}
          aliasSegment={npSeoAliasSegment}
          canonicalPathwayHubPath={buildExamPathwayPath(pathway)}
          countrySlug={pathway.countrySlug}
          examFamily={String(pathway.examFamily)}
        />
      ) : null}

      <section aria-labelledby="tier-hub-title" data-nn-tier-hub="actions">
        <div className="nn-nursing-tier-hub-hero-band -mx-1 px-1 sm:-mx-0 sm:px-0">
          <h1 id="tier-hub-title" className="nn-marketing-h2 max-w-3xl text-balance">
            {title}
          </h1>
          <p className="nn-marketing-body mt-1.5 max-w-3xl text-pretty text-[var(--theme-muted-text)]">{content.intro}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--border-subtle))] bg-[var(--semantic-panel-cool)] px-2.5 py-1 text-[var(--theme-muted-text)]">
              {geographyLabel}
            </span>
            {examLabel ? (
              <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--border-subtle))] bg-[var(--semantic-panel-cool)] px-2.5 py-1 text-[var(--theme-muted-text)]">
                {examLabel}
              </span>
            ) : null}
          </div>
        </div>
        <ul className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {orderedActions.map((action) => {
            const Icon = ACTION_ICON[action.id];
            const eventMeta = ACTION_EVENT_TARGET[action.id];
            const variant = "featured";
            const ctaVariant = "primary";

            return (
              <li key={action.id}>
                <StudyCard
                  surface="hub"
                  variant={variant}
                  href={action.href ?? buildExamPathwayPath(pathway)}
                  icon={Icon}
                  title={action.label}
                  description={action.description}
                  cta={action.label}
                  ctaVariant={ctaVariant}
                  className={ACTION_CLASS[action.id]}
                  ariaLabel={`${action.label} - ${pathway.shortName}`}
                  onClick={() => {
                    const base = { ...linkCtx, ...pathwayAnalyticsDimensions(pathway) };
                    trackProductEvent(PH.marketingPathwayHubCta, {
                      ...base,
                      surface: eventMeta.surface,
                      destination_type: eventMeta.destinationType,
                      link_target: eventMeta.linkTarget,
                    });
                    trackProductEvent(PH.funnelExamHubStudyIntent, {
                      ...base,
                      destination_type: eventMeta.destinationType,
                      link_target: eventMeta.linkTarget,
                    });
                  }}
                />
              </li>
            );
          })}
        </ul>
      </section>

      {resumeLesson ? (
        <div className="mt-4 rounded-lg border border-[var(--border-subtle)] px-3 py-3 sm:px-4">
          <p className="text-xs font-medium text-[var(--theme-muted-text)]">Continue where you left off</p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href={resumeLesson.href} className="font-medium text-primary hover:underline">
              <span className="block">Resume lesson</span>
              <span className="mt-0.5 block text-xs font-normal text-[var(--theme-muted-text)]">
                {resumeLesson.title}
                {resumeLessonCompleted ? " · completed" : ""}
              </span>
            </Link>
            <Link href={questionsAppHref} className="font-medium text-primary hover:underline">
              Resume questions
            </Link>
          </div>
        </div>
      ) : null}

      {pathway.status === "upcoming" || pathway.acquisitionMode === "waitlist" ? (
        <ExamPathwayWaitlistBanner
          pathwayId={pathway.id}
          variant={pathway.acquisitionMode === "waitlist" ? "waitlist" : "upcoming"}
        />
      ) : null}
    </>
  );
}
