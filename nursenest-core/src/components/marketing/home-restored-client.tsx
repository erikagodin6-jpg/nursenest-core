"use client";

import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, type ReactNode } from "react";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { HomeConversionHero } from "@/components/marketing/home-conversion-hero";
import { HomeSampleQuestionPreview } from "@/components/marketing/home-sample-question-preview";
import { HomeGlobalRegionsSection } from "@/components/marketing/home-global-regions-section";
import { HomeTrustFearsSection } from "@/components/marketing/home-trust-fears-section";
import { HomeTrustStripSection } from "@/components/marketing/home-trust-strip-section";
import { HomeHowItWorksSection } from "@/components/marketing/home-how-it-works-section";
import { HomePlatformPreviewSection } from "@/components/marketing/home-platform-preview-section";
import { HomeTrustProofSection } from "@/components/marketing/home-trust-proof-section";
import { HomeObjectionFaqSection } from "@/components/marketing/home-objection-faq-section";
import { HomeFinalStudyCta } from "@/components/marketing/home-final-study-cta";
import { FunnelHomepageViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { PH } from "@/lib/observability/posthog-conversion-events";
import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";

const HomeHeroScreenshotSection = dynamic(
  () => import("@/components/marketing/home-hero-screenshot-section").then((m) => m.HomeHeroScreenshotSection),
  {
    loading: () => (
      <div
        className="border-b border-[var(--header-nav-border)] bg-[var(--page-bg)] pt-[var(--nn-rhythm-mobile-section-y)] md:pt-[var(--nn-rhythm-shell-y)]"
        aria-hidden
      >
        <div className="nn-section-shell pb-[var(--nn-rhythm-shell-y)]">
          {/* Reserve the compact 4:3 product-card footprint to avoid CLS while the chunk loads. */}
          <div className="mx-auto aspect-[4/3] w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--semantic-panel-muted)]" />
        </div>
      </div>
    ),
  },
);

export type HomeRestoredClientProps = {
  homeMarketingStats: HomeMarketingStats;
  /** Homepage global region cards — must exclude unpublished expansion exam hubs. */
  publishedGlobalRegionCardIds: readonly string[];
  /** Global hub strip — rendered after proof blocks, before pathway cards; server slot from `page.tsx`. */
  introAfterHero?: ReactNode;
};

/**
 * Homepage flow: hero → product carousel → how it works (value) → proof stack (sample, regions, trust)
 * → platform preview + differentiation → hub strip → pathways → objection FAQ → final CTA.
 *
 * Stats are passed from the server (initial paint may use a memory snapshot or silent placeholders,
 * then a deferred server segment can replace with fresh DB-backed values).
 * When optional stats are unavailable, the downstream sections already degrade to copy-only fallback states.
 */
export default function HomeRestoredClient({
  homeMarketingStats,
  publishedGlobalRegionCardIds,
  introAfterHero,
}: HomeRestoredClientProps) {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const marketingRegion = region === "US" ? "US" : "CA";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const questionCount = homeMarketingStats.questionCount;
  const registeredLearners = homeMarketingStats.registeredLearners;
  const lessonCount = homeMarketingStats.totalLessons;

  const audienceBalanceCards = useMemo(() => {
    const l = (path: string) => withMarketingLocale(locale, path);
    const hubs = publicExamPrepHubDestinations(region);
    return [
      {
        id: "rn",
        title: t("pages.home.audience.rn.title"),
        body: t("pages.home.audience.rn.description"),
        cta: t("pages.home.audience.rn.cta"),
        href: l(hubs.rn),
        accentColor: "var(--semantic-info)",
      },
      {
        id: "pn",
        title: t("pages.home.audience.pn.title"),
        body: t("pages.home.audience.pn.description"),
        cta: t("pages.home.audience.pn.cta"),
        href: l(hubs.pn),
        accentColor: "var(--semantic-warning)",
      },
      {
        id: "np",
        title: t("pages.home.audience.np.title"),
        body: t("pages.home.audience.np.description"),
        cta: t("pages.home.audience.np.cta"),
        href: l(hubs.np),
        accentColor: "var(--semantic-brand)",
      },
      {
        id: "allied",
        title: t("pages.home.audience.allied.title"),
        body: t("pages.home.audience.allied.description"),
        cta: t("pages.home.audience.allied.cta"),
        href: l(hubs.allied),
        accentColor: "var(--semantic-success)",
      },
    ];
  }, [locale, region, t]);

  return (
    <div className="font-sans md:animate-page-enter flex w-full min-h-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)]">
      <FunnelHomepageViewBeacon marketingRegion={marketingRegion} marketingLocale={locale} />
      <div className="min-h-0 flex-1 overflow-x-hidden">
        {/* 1. HERO */}
        <HomeConversionHero questionCount={questionCount} lessonCount={lessonCount} />
        {/* 2. Product carousel — visual proof directly after hero */}
        <HomeHeroScreenshotSection />
        {/* 3. How it works — explains the value behind what the carousel shows */}
        <HomeHowItWorksSection />
        {/* 4. Proof — sample item + rationale */}
        <HomeSampleQuestionPreview />
        {/* 5. Global regions — licensing hubs beyond core markets */}
        <HomeGlobalRegionsSection visibleCardIds={publishedGlobalRegionCardIds} />
        {/* 6. Trust — credibility + freshness */}
        <HomeTrustStripSection
          lessonCount={lessonCount}
          questionCount={questionCount}
          registeredLearners={registeredLearners}
        />
        {/* 7. Short reassurance */}
        <HomeTrustFearsSection questionCount={questionCount} registeredLearners={registeredLearners} />
        {/* 8. Deeper product proof + differentiation (before pathway choice) */}
        <HomePlatformPreviewSection />
        <HomeTrustProofSection />
        {/* 9. Global hub strip — bridges proof to pathway choice */}
        {introAfterHero}
        {/* 10. Pathways — RN / PN / NP / Allied */}
        <section
          className="nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--page-bg)]"
          aria-label={t("pages.home.audienceBalance.ariaLabel")}
          data-testid="section-home-audience-balance"
        >
          <div className="nn-section-shell">
            <div className="mx-auto mb-8 max-w-2xl text-center md:mb-9">
              <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                {formatSentenceCase(t("pages.home.pathwaysSection.kicker"), locale)}
              </p>
              <h2 className="nn-marketing-h2 mt-2 text-balance text-[var(--theme-heading-text)]">
                {formatTitleCase(t("pages.home.pathwaysSection.title"), locale)}
              </h2>
              <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-[var(--semantic-text-muted)]">
                {formatSentenceCase(t("pages.home.pathwaysSection.lead"), locale)}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {audienceBalanceCards.map((c) => (
                <MarketingTrackedLink
                  key={c.id}
                  href={c.href}
                  event={PH.marketingHomeExploreHubClick}
                  eventProps={{ placement: "audience_balance", pathway: c.id, region }}
                  data-nn-marketing-region={region === "US" ? "US" : "CA"}
                  data-nn-exam-card-id={`audience-${c.id}`}
                  className="nn-card-system nn-card-system-pad nn-card-system--interactive nn-student-card-lift group relative flex h-full min-h-[14rem] flex-col overflow-hidden"
                  style={{
                    borderTopColor: `color-mix(in srgb, ${c.accentColor} 70%, var(--border-subtle))`,
                    borderTopWidth: "3px",
                  }}
                >
                  <span className="nn-card-system__title">{c.title}</span>
                  <span className="nn-card-system__description">{c.body}</span>
                  <span className="nn-card-system__cta mt-auto">
                    {c.cta}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </MarketingTrackedLink>
              ))}
            </div>
          </div>
        </section>
        {/* 11. Objection FAQ */}
        <HomeObjectionFaqSection />
        {/* 12. Final CTA */}
        <HomeFinalStudyCta />
      </div>
    </div>
  );
}
