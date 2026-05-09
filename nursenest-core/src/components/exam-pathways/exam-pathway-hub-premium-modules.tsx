"use client";

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  buildPremiumMarketingModuleCards,
  resolvePremiumCardHref,
  type PremiumModuleCardModel,
} from "@/lib/marketing/exam-pathway-hub-premium-modules";
import { StudyCard } from "@/components/ui/study-card";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";

type Props = {
  pathway: ExamPathwayDefinition;
  isSignedIn: boolean;
  npSeoAliasSegment?: string;
};

function PremiumModuleGrid({
  sectionId,
  headingKey,
  leadKey,
  cards,
  pathway,
  isSignedIn,
  npSeoAliasSegment,
}: {
  sectionId: string;
  headingKey: string;
  leadKey: string;
  cards: PremiumModuleCardModel[];
  pathway: ExamPathwayDefinition;
  isSignedIn: boolean;
  npSeoAliasSegment?: string;
}) {
  const { t } = useMarketingI18n();
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);

  return (
    <section className="space-y-4" aria-labelledby={sectionId}>
      <div>
        <h2 id={sectionId} className="nn-marketing-h2">
          {t(headingKey)}
        </h2>
        <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">{t(leadKey)}</p>
      </div>
      <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const href = resolvePremiumCardHref(card, isSignedIn);
          const locked = Boolean(card.locked);
          const title = t(card.titleKey);
          const description = t(card.bodyKey);
          const cta = locked ? t(card.lockedCtaKey) : t(card.ctaKey);
          const onClick = () => {
            if (locked) return;
            trackClientEvent(PH.marketingPathwayHubCta, {
              ...linkCtx,
              surface: "premium_module_grid",
              pathway_id: pathway.id,
              module_key: card.key,
              signed_in: isSignedIn,
              destination_type: "premium_module",
              link_target: card.key,
            });
          };
          return (
            <li
              key={card.key}
              data-nn-qa-hub-premium-module={card.key}
              {...(card.qaMarker === "ecg" ? { "data-nn-qa-hub-ecg": "1" } : {})}
            >
              <StudyCard
                surface="hub"
                variant={locked ? "locked" : card.variant}
                href={href}
                icon={card.icon}
                title={title}
                description={description}
                cta={cta}
                ctaVariant="secondary"
                {...(locked ? {} : { status: "premium" as const })}
                onClick={onClick}
                className={card.extraClass}
                prefetch={false}
                ariaLabel={`${title} — ${pathway.shortName}`}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Secondary “premium module” grid for nursing pathway marketing hubs — labs, medication math,
 * pharmacology, optional ECG (RN/NP pathways per {@link pathwayAllowsEcgLinkedLearning}), scenarios/OSCE,
 * and readiness surfaces. PN/RPN hubs omit ECG automatically.
 */
export function ExamPathwayHubPremiumModules({ pathway, isSignedIn, npSeoAliasSegment }: Props) {
  const { studyTools, readiness } = buildPremiumMarketingModuleCards(pathway);

  return (
    <div className="mt-12 space-y-10" data-nn-qa-pathway-premium-modules="">
      <PremiumModuleGrid
        sectionId="exam-hub-premium-study-tools-heading"
        headingKey="components.examPathwayHub.premiumModules.studyToolsHeading"
        leadKey="components.examPathwayHub.premiumModules.studyToolsLead"
        cards={studyTools}
        pathway={pathway}
        isSignedIn={isSignedIn}
        npSeoAliasSegment={npSeoAliasSegment}
      />
      <PremiumModuleGrid
        sectionId="exam-hub-premium-readiness-heading"
        headingKey="components.examPathwayHub.premiumModules.readinessHeading"
        leadKey="components.examPathwayHub.premiumModules.readinessLead"
        cards={readiness}
        pathway={pathway}
        isSignedIn={isSignedIn}
        npSeoAliasSegment={npSeoAliasSegment}
      />
    </div>
  );
}
