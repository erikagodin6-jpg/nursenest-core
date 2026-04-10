"use client";

import { Activity, BookOpen, ClipboardList } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ExamPathwayWaitlistBanner } from "@/components/exam-pathways/exam-pathway-waitlist-banner";
import { MarketingTrustSignalsStrip } from "@/components/marketing/marketing-trust-signals-strip";
import { NpSeoAliasHubAnalytics } from "@/components/marketing/np-seo-alias-hub-analytics";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { StudyCard } from "@/components/ui/study-card";
import type { NursingTierHubActionId, NursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";

const ACTION_ICON: Record<NursingTierHubActionId, LucideIcon> = {
  lessons: BookOpen,
  practice: ClipboardList,
  cat: Activity,
};

const ACTION_CLASS: Partial<Record<NursingTierHubActionId, string>> = {
  lessons: "nn-exam-hub-study-card--lessons",
  cat: "nn-exam-hub-study-card--cat",
};

const ACTION_EVENT_TARGET: Record<NursingTierHubActionId, { surface: string; destinationType: string; linkTarget: string }> = {
  lessons: {
    surface: "tier_hub_lessons",
    destinationType: "marketing_lessons",
    linkTarget: "marketing_lessons_hub",
  },
  practice: {
    surface: "tier_hub_practice",
    destinationType: "marketing_questions",
    linkTarget: "marketing_questions_hub",
  },
  cat: {
    surface: "tier_hub_cat",
    destinationType: "pathway_cat_practice",
    linkTarget: "marketing_pathway_cat_intro",
  },
};

export function NursingTierHubPage({
  pathway,
  hubPath,
  content,
  heroTitle,
  heroLead,
  npSeoAliasSegment,
}: {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  content: NursingTierHubContent;
  heroTitle?: string;
  heroLead?: string;
  npSeoAliasSegment?: string;
}) {
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);

  return (
    <>
      <FunnelExamHubViewBeacon pathwayId={pathway.id} hubPath={hubPath} countrySlug={pathway.countrySlug} />
      {npSeoAliasSegment ? (
        <NpSeoAliasHubAnalytics
          pathwayId={pathway.id}
          aliasSegment={npSeoAliasSegment}
          canonicalPathwayHubPath={buildExamPathwayPath(pathway)}
          countrySlug={pathway.countrySlug}
          examFamily={String(pathway.examFamily)}
        />
      ) : null}

      <section className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <p className="nn-marketing-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-accent)]">
          {content.audienceLabel} · {content.examLabel}
        </p>
        <h1 className="nn-marketing-h1 mt-3 max-w-3xl text-balance">{heroTitle ?? content.title}</h1>
        <p className="nn-marketing-body-sm mt-3 max-w-3xl text-[var(--theme-body-text)]">{content.intro}</p>
        <p className="nn-marketing-body mt-3 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
          {heroLead ?? content.description}
        </p>

        <div className="mt-6 max-w-2xl">
          <MarketingTrustSignalsStrip variant="compact" examHub />
        </div>
      </section>

      {pathway.status === "upcoming" || pathway.acquisitionMode === "waitlist" ? (
        <ExamPathwayWaitlistBanner
          pathwayId={pathway.id}
          variant={pathway.acquisitionMode === "waitlist" ? "waitlist" : "upcoming"}
        />
      ) : null}

      <section className="mt-10" aria-labelledby="tier-hub-actions-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="tier-hub-actions-heading" className="nn-marketing-h2">
              Pick your next step
            </h2>
            <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
              Start from one clear hub, then move into the study mode that matches what you need right now.
            </p>
          </div>
        </div>

        <ul className="mt-6 grid list-none gap-5 p-0 md:grid-cols-3">
          {content.actions.map((action, index) => {
            const Icon = ACTION_ICON[action.id];
            const eventMeta = ACTION_EVENT_TARGET[action.id];
            const footer = action.recommended ? (
              <span className="nn-marketing-label nn-marketing-label--accent mt-2 inline-block max-w-full">Start here</span>
            ) : null;
            const variant = action.id === "practice" ? "featured" : "default";
            const ctaVariant = action.id === "practice" ? "primary" : "secondary";

            return (
              <li key={action.id}>
                <StudyCard
                  surface="hub"
                  variant={variant}
                  href={action.href}
                  icon={Icon}
                  title={action.label}
                  description={action.description}
                  cta={index === 0 ? "Open lessons" : index === 1 ? "Open practice" : "Open CAT exams"}
                  ctaVariant={ctaVariant}
                  footer={footer}
                  className={ACTION_CLASS[action.id]}
                  ariaLabel={`${action.label} - ${pathway.shortName}`}
                  onClick={() => {
                    trackClientEvent(PH.marketingPathwayHubCta, {
                      ...linkCtx,
                      pathway_id: pathway.id,
                      surface: eventMeta.surface,
                      destination_type: eventMeta.destinationType,
                      link_target: eventMeta.linkTarget,
                    });
                    trackClientEvent(PH.funnelExamHubStudyIntent, {
                      ...linkCtx,
                      pathway_id: pathway.id,
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
        <p className="nn-marketing-label">{content.differenceHeading}</p>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-body-text)]">{content.differenceBody}</p>
        <p className="nn-marketing-body-sm mt-4 text-[var(--theme-muted-text)]">{content.startHere}</p>
        <p className="nn-marketing-caption mt-4 border-t border-[var(--border-subtle)] pt-4 text-[var(--theme-muted-text)]">
          {content.includedNote}
        </p>
      </section>
    </>
  );
}
