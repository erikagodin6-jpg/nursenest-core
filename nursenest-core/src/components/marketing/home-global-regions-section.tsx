"use client";

import { useMemo } from "react";
import { ArrowRight, Globe2 } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

type RegionCard = {
  id: string;
  titleKey: string;
  bodyKey: string;
  path: string;
  accentVar: string;
};

export const HOME_GLOBAL_REGION_CARDS: readonly RegionCard[] = [
  {
    id: "us",
    titleKey: "pages.home.globalRegions.us.title",
    bodyKey: "pages.home.globalRegions.us.body",
    path: "/us",
    accentVar: "var(--semantic-info)",
  },
  {
    id: "ca",
    titleKey: "pages.home.globalRegions.ca.title",
    bodyKey: "pages.home.globalRegions.ca.body",
    path: "/canada",
    accentVar: "var(--semantic-chart-2)",
  },
  {
    id: "ph",
    titleKey: "pages.home.globalRegions.ph.title",
    bodyKey: "pages.home.globalRegions.ph.body",
    path: "/exams/philippines",
    accentVar: "var(--semantic-success)",
  },
  {
    id: "me",
    titleKey: "pages.home.globalRegions.me.title",
    bodyKey: "pages.home.globalRegions.me.body",
    path: "/exams/middle-east",
    accentVar: "var(--semantic-warning)",
  },
  {
    id: "cn",
    titleKey: "pages.home.globalRegions.cn.title",
    bodyKey: "pages.home.globalRegions.cn.body",
    path: "/exams/china",
    accentVar: "var(--semantic-brand)",
  },
];

export type HomeGlobalRegionsSectionProps = {
  /** Server-filtered card ids so unpublished `/exams/…` hubs are never linked from the homepage. */
  visibleCardIds: readonly string[];
};

/**
 * Highlights major regional licensing hubs while keeping US/Canada primary CTAs above the fold.
 */
export function HomeGlobalRegionsSection({ visibleCardIds }: HomeGlobalRegionsSectionProps) {
  const { locale, t } = useMarketingI18n();
  const cards = useMemo(() => {
    const l = (path: string) => withMarketingLocale(locale, path);
    const source = HOME_GLOBAL_REGION_CARDS.filter((c) => visibleCardIds.includes(c.id));
    return source.map((c) => ({
      ...c,
      href: l(c.path),
      title: t(c.titleKey),
      body: t(c.bodyKey),
    }));
  }, [locale, t, visibleCardIds]);

  return (
    <section
      className="nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--page-bg))]"
      aria-labelledby="home-global-regions-heading"
      data-testid="section-home-global-regions"
    >
      <div className="nn-section-shell py-10 sm:py-12">
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="nn-marketing-caption inline-flex items-center gap-2 font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
            <Globe2 className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            {formatTitleCase(t("pages.home.globalRegions.eyebrow"), locale)}
          </p>
          <h2
            id="home-global-regions-heading"
            className="nn-marketing-h2 text-balance text-[var(--palette-heading)]"
          >
            {formatTitleCase(t("pages.home.globalRegions.title"), locale)}
          </h2>
          <p className="nn-marketing-body max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            {formatSentenceCase(t("pages.home.globalRegions.subtitle"), locale)}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((c) => (
            <MarketingTrackedLink
              key={c.id}
              href={c.href}
              event={PH.marketingHomeExploreHubClick}
              eventProps={{ placement: "global_regions", region_card: c.id }}
              className="nn-card-system nn-card-system-pad nn-card-system--interactive nn-student-card-lift group flex min-h-[11.5rem] flex-col overflow-hidden"
              style={{
                borderTopColor: `color-mix(in srgb, ${c.accentVar} 72%, var(--border-subtle))`,
                borderTopWidth: "3px",
              }}
            >
              <span className="nn-card-system__title">{c.title}</span>
              <span className="nn-card-system__description grow">{c.body}</span>
              <span className="nn-card-system__cta mt-auto inline-flex items-center">
                {formatSentenceCase(t("pages.home.globalRegions.cta"), locale)}
                <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
              </span>
            </MarketingTrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
