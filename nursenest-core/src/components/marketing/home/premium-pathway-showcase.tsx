"use client";

import { ArrowRight } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

/** Compact pathway badge inside cards (avoids odd first-word clipping from titles). */
const PATHWAY_ICON_ABBR: Record<string, string> = {
  rn: "RN",
  pn: "PN",
  np: "NP",
  "international-rn": "IRN",
  allied: "AH",
};

export function PremiumPathwayShowcase() {
  const { region, pathwayCards } = usePremiumHomepageRoutes();
  const { t } = useMarketingI18n();

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--pathways border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-pathway-showcase-heading"
      data-testid="section-premium-pathway-showcase"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">
            {safeHomepageMarketingT(t, "pages.home.premium.pathways.eyebrow", "Pathways")}
          </p>
          <h2 id="premium-pathway-showcase-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
            {safeHomepageMarketingT(
              t,
              "pages.home.premium.pathways.heading",
              "A clinical study path for the license you are earning.",
            )}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {safeHomepageMarketingT(
              t,
              "pages.home.premium.pathways.body",
              "Choose the exam lane that matches your role. Each pathway keeps learners on real public hub routes with region-aware RN, PN/RPN, NP, Allied, and global RN entry points.",
            )}
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pathwayCards.map((card) => (
            <MarketingTrackedLink
              key={card.id}
              href={card.href}
              event={PH.marketingHomeExploreHubClick}
              eventProps={{ pathway: card.id, region, surface: "premium_pathway_showcase" }}
              className="nn-premium-pathway-card group flex min-h-[17rem] min-w-0 flex-col rounded-2xl border p-5 transition-transform hover:-translate-y-1"
              data-nn-home-tier-card={card.id}
              data-testid={`premium-pathway-card-${card.id}`}
              style={{ ["--premium-card-accent" as string]: `var(--nn-premium-tone-${card.tone})` }}
            >
              <span className="nn-premium-pathway-card__icon" aria-hidden>
                {PATHWAY_ICON_ABBR[card.id] ?? card.title.slice(0, 4)}
              </span>
              <span className="nn-marketing-caption mt-5 font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">
                {card.subtitle}
              </span>
              <span className="mt-2 text-xl font-black tracking-normal text-[var(--palette-heading)]">
                {card.title}
              </span>
              <span className="nn-marketing-body-sm mt-3 flex-1 text-pretty text-[var(--palette-text-muted)]">
                {card.body}
              </span>
              <span className="mt-5 inline-flex items-center text-sm font-bold text-[var(--premium-card-accent)]">
                {card.cta}
                <ArrowRight className="ml-1.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </MarketingTrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
