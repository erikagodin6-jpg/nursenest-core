"use client";

import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

// Phase 4: replaced `HomeConversionHero` with the premium clinical hero.
// `HomeConversionHero` remains in the repo at
// `@/components/marketing/home-conversion-hero` for emergency rollback —
// import is removed here to satisfy noUnusedLocals.
import { PremiumHomepageHero } from "@/components/marketing/home/premium-homepage-hero";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";

import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";
import type { HomeHeroSlide } from "@/config/home-hero-carousel";

const PremiumPathwayShowcase = dynamic(() =>
  import("@/components/marketing/home/premium-pathway-showcase").then((m) => m.PremiumPathwayShowcase),
);
const PremiumClinicalDepth = dynamic(() =>
  import("@/components/marketing/home/premium-clinical-depth").then((m) => m.PremiumClinicalDepth),
);
const PremiumStudyEcosystem = dynamic(() =>
  import("@/components/marketing/home/premium-study-ecosystem").then((m) => m.PremiumStudyEcosystem),
);
const PremiumSocialStudy = dynamic(() =>
  import("@/components/marketing/home/premium-social-study").then((m) => m.PremiumSocialStudy),
);
const PremiumHomepageEcg = dynamic(() =>
  import("@/components/marketing/home/premium-homepage-ecg").then((m) => m.PremiumHomepageEcg),
);
const PremiumReadinessPreview = dynamic(() =>
  import("@/components/marketing/home/premium-readiness-preview").then((m) => m.PremiumReadinessPreview),
);
const PremiumHomepageTrust = dynamic(() =>
  import("@/components/marketing/home/premium-homepage-trust").then((m) => m.PremiumHomepageTrust),
);
const PremiumHomepageCta = dynamic(() =>
  import("@/components/marketing/home/premium-homepage-cta").then((m) => m.PremiumHomepageCta),
);

/** Below-fold carousel — separate chunk; keep SSR for SEO (skeleton only covers streaming gaps). */
const HomeHeroScreenshotSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-hero-screenshot-section").then((m) => ({
      default: m.HomeHeroScreenshotSection,
    })),
  { loading: () => <HomeHeroScreenshotSectionSkeleton /> },
);

const FunnelHomepageViewBeaconLazy = dynamic(
  () =>
    import("@/components/marketing/funnel-analytics-beacons").then((m) => ({
      default: m.FunnelHomepageViewBeacon,
    })),
  { ssr: false },
);

function HomeHeroScreenshotSectionSkeleton() {
  return (
    <section
      className="border-b border-[var(--header-nav-border)] nn-home-hero-product-band bg-[var(--page-bg)] pt-[var(--nn-rhythm-mobile-section-y)] md:pt-[var(--nn-rhythm-shell-y)]"
      aria-hidden
      data-testid="home-hero-screenshot-section-skeleton"
    >
      <div className="nn-section-shell pb-[var(--nn-rhythm-section-y)]">
        <div className="mx-auto mb-6 max-w-2xl space-y-3 md:mb-8">
          <div className="mx-auto h-3 w-44 max-w-[min(100%,12rem)] rounded-full bg-[color-mix(in_srgb,var(--semantic-text-muted)_24%,var(--page-bg))]" />
          <div className="mx-auto h-3 w-full max-w-xl rounded-full bg-[color-mix(in_srgb,var(--semantic-text-muted)_18%,var(--page-bg))]" />
          <div className="mx-auto h-3 w-[92%] max-w-lg rounded-full bg-[color-mix(in_srgb,var(--semantic-text-muted)_16%,var(--page-bg))]" />
        </div>
        <div className="mx-auto w-full max-w-2xl min-h-[min(24rem,calc(100vw*0.72+6rem))]">
          <div className="aspect-[4/3] w-full rounded-2xl border border-[color-mix(in_srgb,var(--border-subtle)_82%,white)] bg-[color-mix(in_srgb,var(--semantic-text-muted)_12%,var(--page-bg))] shadow-[0_12px_32px_-24px_color-mix(in_srgb,var(--palette-heading)_28%,transparent)]" />
        </div>
      </div>
    </section>
  );
}

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
  /** Server-built carousel slides — avoids client-side slide assembly on hydration. */
  homeHeroCarouselSlides?: readonly HomeHeroSlide[] | null;
}>;

/* ------------------ COMPONENT ------------------ */

export default function HomeRestoredClient({
  homeMarketingStats,
  publishedGlobalRegionCardIds: _publishedGlobalRegionCardIds,
  homeHeroCarouselSlides,
  children,
}: HomeRestoredClientProps) {
  const { locale } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const marketingRegion = region === "US" ? "US" : "CA";

  /* -------- SAFE STATS -------- */

  const questionCount = safeNumber(homeMarketingStats?.questionCount);
  const lessonCount = safeNumber(homeMarketingStats?.totalLessons);

  /* ------------------ RENDER ------------------ */

  return (
    <div className="font-sans flex w-full min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)] nn-home-marketing-root">
      <FunnelHomepageViewBeaconLazy marketingRegion={marketingRegion} marketingLocale={locale} />

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

      <HomeHeroScreenshotSectionLazy serverPreparedSlides={homeHeroCarouselSlides} />

      <PremiumPathwayShowcase />
      <PremiumClinicalDepth />
      <PremiumStudyEcosystem />
      <PremiumSocialStudy />
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
