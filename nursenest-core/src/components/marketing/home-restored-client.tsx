"use client";

import { useEffect, type PropsWithChildren } from "react";

// Phase 4: replaced `HomeConversionHero` with the premium clinical hero.
// `HomeConversionHero` remains in the repo at
// `@/components/marketing/home-conversion-hero` for emergency rollback —
// import is removed here to satisfy noUnusedLocals.
import { PremiumHomepageHero } from "@/components/marketing/home/premium-homepage-hero";
import { PremiumPathwayShowcase } from "@/components/marketing/home/premium-pathway-showcase";
import { PremiumClinicalDepth } from "@/components/marketing/home/premium-clinical-depth";
import { PremiumStudyEcosystem } from "@/components/marketing/home/premium-study-ecosystem";
import { PremiumReadinessPreview } from "@/components/marketing/home/premium-readiness-preview";
import { PremiumHomepageEcg } from "@/components/marketing/home/premium-homepage-ecg";
import { PremiumHomepageTrust } from "@/components/marketing/home/premium-homepage-trust";
import { PremiumHomepageCta } from "@/components/marketing/home/premium-homepage-cta";
import { FunnelHomepageViewBeacon } from "@/components/marketing/funnel-analytics-beacons";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";

import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";

/**
 * Normalize numbers from server (prevents crashes + hydration issues)
 */
function safeNumber(n: unknown): number {
  return Number.isFinite(n) ? Number(n) : 0;
}

/* ------------------ TYPES ------------------ */

export type HomeRestoredClientProps = PropsWithChildren<{
  homeMarketingStats?: HomeMarketingStats | null;
  publishedGlobalRegionCardIds?: readonly string[] | null;
}>;

/* ------------------ COMPONENT ------------------ */

export default function HomeRestoredClient({
  homeMarketingStats,
  publishedGlobalRegionCardIds: _publishedGlobalRegionCardIds,
  children,
}: HomeRestoredClientProps) {
  const { locale } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const marketingRegion = region === "US" ? "US" : "CA";

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      /* ignore — rare sandboxed / embedded browsers */
    }
  }, []);

  /* -------- SAFE STATS -------- */

  const questionCount = safeNumber(homeMarketingStats?.questionCount);
  const lessonCount = safeNumber(homeMarketingStats?.totalLessons);

  /* ------------------ RENDER ------------------ */

  return (
    <div className="font-sans flex w-full min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)] nn-home-marketing-root">
      <FunnelHomepageViewBeacon
        marketingRegion={marketingRegion}
        marketingLocale={locale}
      />

      {/* HERO — Phase 4 premium clinical hero. The previous
          `HomeConversionHero` is preserved on disk at
          `@/components/marketing/home-conversion-hero` for emergency
          rollback (single import + render swap).

          Behavior preserved: same i18n keys (with new `*Premium` keys for
          the headline/sub only), same CTA destinations (HUB.questionBank,
          HUB.examLessons), same analytics events (marketingHomeHeroPrimaryCta
          / SecondaryCta), same region + locale wiring, same fallback paths,
          same dynamic stats line, same `nn-home-marketing-rich-hero` outer
          class so production CSS in `premium-redesign-2026.css` styles it. */}
      <PremiumHomepageHero
        questionCount={questionCount}
        lessonCount={lessonCount}
      />

      <PremiumPathwayShowcase />
      <PremiumClinicalDepth />
      <PremiumStudyEcosystem />
      <PremiumHomepageEcg />
      <PremiumReadinessPreview />
      <PremiumHomepageTrust />

      {/* Global hub strip — after pathway cards (supporting marketing, not above hero).
          Pass as `children` from the server page so RSC streaming keeps DOM order under the hero. */}
      {children}

      <PremiumHomepageCta />
    </div>
  );
}
