"use client";

import { useEffect, useState } from "react";
import { HomeConversionHero } from "@/components/marketing/home-conversion-hero";
import { HomeTrustStripSection } from "@/components/marketing/home-trust-strip-section";
import { HomeExamSelectionSection } from "@/components/marketing/home-exam-selection-section";
import { HomeHowItWorksSection } from "@/components/marketing/home-how-it-works-section";
import { HomePlatformPreviewSection } from "@/components/marketing/home-platform-preview-section";
import { HomeTrustProofSection } from "@/components/marketing/home-trust-proof-section";
import { HomeFinalStudyCta } from "@/components/marketing/home-final-study-cta";
import { FunnelHomepageViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";

type HomeStatsPayload = {
  questionCount: number;
  registeredLearners: number;
};

/**
 * Conversion-focused homepage: hero with primary CTAs, pathway cards, product pillars, platform preview,
 * competitor comparison, how it works, trust, reviews, final CTA.
 */
export default function HomeRestoredClient() {
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
  const registeredLearners = homeStats?.registeredLearners ?? 0;

  return (
    <div className="font-sans md:animate-page-enter flex min-h-screen flex-col overflow-x-hidden bg-[var(--page-bg)]">
      <FunnelHomepageViewBeacon marketingRegion={marketingRegion} />
      <div className="flex-grow overflow-x-hidden">
        {/* 1. HERO */}
        <HomeConversionHero />
        {/* 2. TRUST STRIP */}
        <HomeTrustStripSection
          questionCount={questionCount}
          registeredLearners={registeredLearners}
        />
        {/* 3. PATHWAY SELECTION */}
        <HomeExamSelectionSection />
        {/* 4. HOW IT WORKS */}
        <HomeHowItWorksSection />
        {/* 5. PRODUCT PROOF */}
        <HomePlatformPreviewSection />
        {/* 6. DIFFERENTIATION */}
        <HomeTrustProofSection />
        {/* 7. FINAL CTA */}
        <HomeFinalStudyCta />
      </div>
    </div>
  );
}
