"use client";

import Link from "next/link";
import { Activity, BookOpen, ClipboardList } from "lucide-react";
import { Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ExamPathwayWaitlistBanner } from "@/components/exam-pathways/exam-pathway-waitlist-banner";
import { NpSeoAliasHubAnalytics } from "@/components/marketing/np-seo-alias-hub-analytics";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { StudyCard } from "@/components/ui/study-card";
import type { NursingTierHubActionId, NursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { pathwayAnalyticsDimensions, trackProductEvent } from "@/lib/observability/product-analytics";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";

const ACTION_ICON: Record<NursingTierHubActionId, LucideIcon> = {
  lessons: BookOpen,
  flashcards: ClipboardList,
  practice_questions: ClipboardList,
  exams: Activity,
};

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
  heroTitle,
  npSeoAliasSegment,
}: {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  content: NursingTierHubContent;
  heroTitle?: string;
  npSeoAliasSegment?: string;
}) {
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);

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

      <section
        className="rounded-[1.75rem] border border-[var(--accent-surface-b-border)] bg-[var(--accent-surface-b)] p-6 shadow-[var(--shadow-card)] sm:p-8"
        data-nn-tier-hub="hero"
      >
        <h1 className="nn-marketing-h1 max-w-3xl text-balance">{heroTitle ?? `${pathway.shortName} study hub`}</h1>
        <p className="nn-marketing-body mt-3 max-w-3xl text-pretty text-[var(--theme-muted-text)]">{content.intro}</p>
      </section>

      <section className="mt-10" aria-labelledby="tier-hub-actions-heading" data-nn-tier-hub="actions">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="tier-hub-actions-heading" className="nn-marketing-h2">
              Start studying
            </h2>
            <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
              Choose one of the main study actions.
            </p>
          </div>
        </div>

        <ul className="mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {content.actions.map((action) => {
            const Icon = ACTION_ICON[action.id];
            const eventMeta = ACTION_EVENT_TARGET[action.id];
            const footer = action.disabledNote ? (
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--theme-muted-text)]">
                <Lock className="h-3.5 w-3.5" />
                {action.disabledNote}
              </span>
            ) : null;
            const variant = action.disabled ? "locked" : "featured";
            const ctaVariant = "primary";

            return (
              <li key={action.id}>
                <StudyCard
                  surface="hub"
                  variant={variant}
                  href={action.href ?? "#"}
                  icon={Icon}
                  title={action.label}
                  description={action.description}
                  cta={action.label}
                  ctaVariant={ctaVariant}
                  footer={footer}
                  className={ACTION_CLASS[action.id]}
                  ariaLabel={`${action.label} - ${pathway.shortName}`}
                  onClick={() => {
                    if (action.disabled) return;
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

      <section className="nn-study-card nn-study-card--wash mt-10 p-5 sm:p-6">
        <p className="nn-marketing-label">More options</p>
        <ul className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-primary">
          <li>
            <Link href="/app/strategy" className="hover:underline">
              Study Plan
            </Link>
          </li>
          <li>
            <Link href="/app/practice-tests/cat-insights" className="hover:underline">
              Progress / Readiness
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:underline">
              Articles / Tips
            </Link>
          </li>
        </ul>
      </section>

      {pathway.status === "upcoming" || pathway.acquisitionMode === "waitlist" ? (
        <ExamPathwayWaitlistBanner
          pathwayId={pathway.id}
          variant={pathway.acquisitionMode === "waitlist" ? "waitlist" : "upcoming"}
        />
      ) : null}
    </>
  );
}
