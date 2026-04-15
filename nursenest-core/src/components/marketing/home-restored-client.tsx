"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { HomeConversionHero } from "@/components/marketing/home-conversion-hero";
import { HomeTrustStripSection } from "@/components/marketing/home-trust-strip-section";
import { HomeExamSelectionSection } from "@/components/marketing/home-exam-selection-section";
import { HomeHowItWorksSection } from "@/components/marketing/home-how-it-works-section";
import { HomePlatformPreviewSection } from "@/components/marketing/home-platform-preview-section";
import { HomeTrustProofSection } from "@/components/marketing/home-trust-proof-section";
import { HomeFinalStudyCta } from "@/components/marketing/home-final-study-cta";
import { FunnelHomepageViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { PH } from "@/lib/observability/posthog-conversion-events";

type HomeStatsPayload = {
  questionCount: number;
  registeredLearners: number;
};

/**
 * Conversion-focused homepage: hero with primary CTAs, pathway cards, product pillars, platform preview,
 * competitor comparison, how it works, trust, reviews, final CTA.
 */
export default function HomeRestoredClient() {
  const { locale } = useMarketingI18n();
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

  const audienceBalanceCards = useMemo(() => {
    const l = (path: string) => withMarketingLocale(locale, path);
    const hubs = publicExamPrepHubDestinations(region);
    return [
      {
        id: "rn",
        title: "RN (NCLEX-RN)",
        body: "Full-length NCLEX-style questions, deep rationales, and readiness tracking built for RN success.",
        cta: "Start RN Practice",
        href: l(hubs.rn),
        accentColor: "var(--semantic-info)",
      },
      {
        id: "pn",
        title: "PN / RPN (NCLEX-PN & REx-PN)",
        body: "Focused PN-level questions and exam-specific prep tailored for both U.S. and Canadian pathways.",
        cta: "Start PN Practice",
        href: l(hubs.pn),
        accentColor: "var(--semantic-warning)",
      },
      {
        id: "np",
        title: "Nurse Practitioner (NP)",
        body: "Advanced clinical scenarios and higher-level reasoning designed for NP certification exams.",
        cta: "Start NP Prep",
        href: l(hubs.np),
        accentColor: "var(--semantic-brand)",
      },
      {
        id: "allied",
        title: "Allied Health",
        body: "Targeted exam prep for MLA, paramedics, OT, social work, and more healthcare careers.",
        cta: "Explore Allied Exams",
        href: l(hubs.allied),
        accentColor: "var(--semantic-success)",
      },
    ];
  }, [locale, region]);

  return (
    <div className="font-sans md:animate-page-enter flex min-h-screen flex-col overflow-x-hidden bg-[var(--page-bg)]">
      <FunnelHomepageViewBeacon marketingRegion={marketingRegion} marketingLocale={locale} />
      <div className="flex-grow overflow-x-hidden">
        {/* 1. HERO */}
        <HomeConversionHero />
        {/* 1b. AUDIENCE BALANCE — RN / PN / NP / Allied */}
        <section
          className="nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--page-bg)]"
          aria-label="Exam prep by audience"
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
