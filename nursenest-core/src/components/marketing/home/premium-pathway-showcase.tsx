"use client";

import { ArrowRight } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

/** Compact pathway badge inside cards (avoids odd first-word clipping from titles). */
const PATHWAY_ICON_ABBR: Record<string, string> = {
  rn: "RN",
  pn: "PN",
  np: "NP",
  "pre-nursing": "PRE",
  "new-grad": "NG",
};

export function PremiumPathwayShowcase() {
  const { region, pathwayCards, hrefs } = usePremiumHomepageRoutes();
  const { t, locale } = useMarketingI18n();

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--pathways nn-marketing-brand-leaf-band border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-pathway-showcase-heading"
      data-testid="section-premium-pathway-showcase"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">
            {formatTitleCase(safeHomepageMarketingT(t, "pages.home.premium.pathways.eyebrow", "Pathways"), locale)}
          </p>
          <h2 id="premium-pathway-showcase-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
            {formatTitleCase(
              safeHomepageMarketingT(
                t,
                "pages.home.premium.pathways.heading",
                "Choose Your Pathway. Everything Else Adapts.",
              ),
              locale,
            )}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {formatSentenceCase(
              safeHomepageMarketingT(
                t,
                "pages.home.premium.pathways.body",
                "RN, RPN, NP, pre-nursing, and new graduate — each pathway keeps its own clinical scope, readiness framing, and adaptive study loop.",
              ),
              locale,
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

        <div className="mt-6 rounded-3xl border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--theme-card-bg))] p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--semantic-info)]">
                {formatTitleCase(
                  safeHomepageMarketingT(t, "pages.home.premium.pathways.international.badge", "International RN"),
                  locale,
                )}
              </p>
              <h3 className="mt-3 text-xl font-black text-[var(--palette-heading)]">
                {formatTitleCase(
                  safeHomepageMarketingT(
                    t,
                    "pages.home.premium.pathways.international.heading",
                    "Live Hubs and Foundation Coverage Vary by Region.",
                  ),
                  locale,
                )}
              </h3>
              <p className="nn-marketing-body-sm mt-2 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
                {formatSentenceCase(
                  safeHomepageMarketingT(
                    t,
                    "pages.home.premium.pathways.international.body",
                    "Launched country hubs are live, but not every international route carries the same readiness system or CAT depth yet. Keep regional expectations explicit.",
                  ),
                  locale,
                )}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_42%,var(--theme-card-bg))] px-4 py-3 text-sm font-semibold text-[var(--palette-heading)]">
                {formatTitleCase(
                  safeHomepageMarketingT(t, "pages.home.premium.pathways.international.live", "Live Now: Launched Country Hubs"),
                  locale,
                )}
              </div>
              <MarketingTrackedLink
                href={hrefs.internationalRn}
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ pathway: "international-rn", region, surface: "premium_pathway_showcase_international" }}
                className="inline-flex items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--border-subtle))] px-4 py-3 text-sm font-bold text-[var(--semantic-info)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-info)_10%,transparent)]"
                data-testid="premium-pathway-international-status-link"
              >
                {formatTitleCase(
                  safeHomepageMarketingT(t, "pages.home.premium.pathways.international.cta", "View a Live International Hub"),
                  locale,
                )}
                <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" aria-hidden />
              </MarketingTrackedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
