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
        className="border-b border-[var(--header-nav-border)] bg-[var(--page-bg)]"
        aria-hidden
      >
        <div className="nn-section-shell py-3 sm:py-4 md:py-5">
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
  /** Canada-first global hub strip — rendered immediately after {@link HomeConversionHero} (server slot from `page.tsx`). */
  introAfterHero?: ReactNode;
};

/**
 * Homepage: hero → product screenshots → sample proof → trust strip → trust Q&A → pathways → how it works → platform proof → differentiation → objection FAQ → final CTA.
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
        {introAfterHero}
        {/* 1b. Product screenshots — directly under hero; carousel chunk loads after first paint */}
        <HomeHeroScreenshotSection />
        {/* 2. PROOF — sample item + rationale */}
        <HomeSampleQuestionPreview />
        {/* 2b. Global regions — licensing hubs beyond US/Canada */}
        <HomeGlobalRegionsSection visibleCardIds={publishedGlobalRegionCardIds} />
        {/* 3. TRUST — credibility + freshness (stats shown in hero; strip avoids repeating counts) */}
        <HomeTrustStripSection
          lessonCount={lessonCount}
          questionCount={questionCount}
          registeredLearners={registeredLearners}
        />
        {/* 4. OBJECTIONS — short reassurance before pathway split */}
        <HomeTrustFearsSection questionCount={questionCount} registeredLearners={registeredLearners} />
        {/* 5. PATHWAYS — RN / PN / NP / Allied (below proof + trust) */}
        <section
          className="nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--page-bg)]"
          aria-label={t("pages.home.audienceBalance.ariaLabel")}
          data-testid="section-home-audience-balance"
        >
          <div className="nn-section-shell py-10 sm:py-11">
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
        {/* Pathway hub grid hidden to reduce above-the-fold choice overload; audience cards + nav cover entry points. */}
        {/* 6. HOW IT WORKS */}
        <HomeHowItWorksSection />
        {/* 7. PRODUCT PROOF (interactive demo) */}
        <HomePlatformPreviewSection />
        {/* 8. DIFFERENTIATION */}
        <HomeTrustProofSection />
        {/* 9. OBJECTION FAQ — worth paying, region, rationales, platform trust */}
        <HomeObjectionFaqSection />
        {/* 10. FINAL CTA */}
        <HomeFinalStudyCta />
      </div>
    </div>
  );
}
