"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { HomeConversionHero } from "@/components/marketing/home-conversion-hero";
import { HomeConversionFreeAccessBand } from "@/components/marketing/home-conversion-free-access-band";
import { HomeExamSelectionSection } from "@/components/marketing/home-exam-selection-section";
import { HomeProductPillarsSection } from "@/components/marketing/home-product-pillars-section";
import { HomeHowItWorksSection } from "@/components/marketing/home-how-it-works-section";
import { HomeComparisonSection } from "@/components/marketing/home-comparison-section";
import { HomePlatformPreviewSection } from "@/components/marketing/home-platform-preview-section";
import { HomeTrustProofSection } from "@/components/marketing/home-trust-proof-section";
import { HomeReviewsSection } from "@/components/marketing/home-reviews-section";
import { HomeFinalStudyCta } from "@/components/marketing/home-final-study-cta";
import { FunnelHomepageViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";

type HomeStatsPayload = {
  questionCount: number;
};

/**
 * Conversion-focused homepage: hero with primary CTAs, pathway cards, product pillars, platform preview,
 * competitor comparison, how it works, trust, reviews, final CTA.
 */
export default function HomeRestoredClient() {
  const { t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const marketingRegion = region === "US" ? "US" : "CA";
  const [homeStats, setHomeStats] = useState<HomeStatsPayload | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/home-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: HomeStatsPayload | null) => {
        if (cancelled || !d) return;
        setHomeStats(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const questionCount = homeStats?.questionCount ?? 0;

  return (
    <div className="font-sans md:animate-page-enter flex min-h-screen flex-col overflow-x-hidden bg-[var(--theme-page-bg)]">
      <FunnelHomepageViewBeacon marketingRegion={marketingRegion} />
      <div className="flex-grow overflow-x-hidden">
        <HomeConversionHero />
        <HomeConversionFreeAccessBand />
        <HomeExamSelectionSection />
        <HomeProductPillarsSection />
        <HomePlatformPreviewSection />
        <HomeComparisonSection />
        <HomeHowItWorksSection />
        <HomeTrustProofSection questionCount={questionCount} />
        <HomeReviewsSection />
        <HomeFinalStudyCta />

        <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <Link
            href={mapLegacyMarketingHref("/languages")}
            className="nn-marketing-body-sm inline-flex items-center gap-2 text-[var(--theme-muted-text)] transition-colors hover:text-[var(--theme-heading-text)]"
            data-testid="link-home-languages"
          >
            <span aria-hidden="true">🌐</span>
            <span>{t("pages.home.availableIn20LanguagesStudy")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
