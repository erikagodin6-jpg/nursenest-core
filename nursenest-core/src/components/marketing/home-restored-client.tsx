"use client";

import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";

import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";
import type { HomeHeroSlide } from "@/config/home-hero-carousel";

// ssr:false for all below-fold sections — eliminates Suspense hydration CLS.
// With ssr:true (default), dynamic() creates a Suspense boundary on the client;
// on slow connections the chunk hasn't loaded when React begins hydrating, so React
// briefly renders null for each section, SSR content disappears, then reappears
// when the chunk arrives — causing compounding CLS across 6 sections.
// With ssr:false + loading skeleton: SSR HTML contains a height-stable placeholder
// so the page geometry doesn't shift as real sections hydrate in. The skeleton
// matches the section's min-height (--nn-premium-home-section-min default 34rem)
// so CLS stays below threshold even when the user scrolls before hydration.
const PremiumPathwayShowcase = dynamic(() =>
  import("@/components/marketing/home/premium-pathway-showcase").then((m) => m.PremiumPathwayShowcase),
  { ssr: false, loading: () => <PremiumSectionSkeleton testId="skeleton-pathways" /> },
);
// PremiumClinicalDepth: now a Server Component — rendered as clinicalDepthSlot from the parent RSC.
// PremiumHomepageTrust: now a Server Component — rendered as trustSlot from the parent RSC.
const PremiumStudyEcosystem = dynamic(() =>
  import("@/components/marketing/home/premium-study-ecosystem").then((m) => m.PremiumStudyEcosystem),
  { ssr: false, loading: () => <PremiumSectionSkeleton testId="skeleton-ecosystem" /> },
);
const PremiumSocialStudy = dynamic(() =>
  import("@/components/marketing/home/premium-social-study").then((m) => m.PremiumSocialStudy),
  { ssr: false, loading: () => <PremiumSectionSkeleton testId="skeleton-social-study" /> },
);
const PremiumHomepageEcg = dynamic(() =>
  import("@/components/marketing/home/premium-homepage-ecg").then((m) => m.PremiumHomepageEcg),
  { ssr: false, loading: () => <PremiumSectionSkeleton testId="skeleton-ecg" /> },
);
const PremiumReadinessPreview = dynamic(() =>
  import("@/components/marketing/home/premium-readiness-preview").then((m) => m.PremiumReadinessPreview),
  { ssr: false, loading: () => <PremiumSectionSkeleton testId="skeleton-readiness" /> },
);
const PremiumHomepageCta = dynamic(() =>
  import("@/components/marketing/home/premium-homepage-cta").then((m) => m.PremiumHomepageCta),
  { ssr: false, loading: () => <PremiumSectionSkeleton testId="skeleton-cta" short /> },
);

/** Below-fold carousel — separate chunk; keep SSR for SEO (skeleton only covers streaming gaps). */
const HomeHeroScreenshotSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-hero-screenshot-section").then((m) => ({
      default: m.HomeHeroScreenshotSection,
    })),
  // ssr: false — carousel has 8+ effects/setInterval; skipping SSR reconciliation reduces initial TBT.
  // Skeleton provides stable pre-hydration geometry so CLS stays below threshold.
  { loading: () => <HomeHeroScreenshotSectionSkeleton />, ssr: false },
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
 * Height-stable placeholder for below-fold premium sections.
 * Rendered by dynamic() `loading:` so the SSR HTML contains a div with the
 * same block size as the real section. This prevents the CLS spike that
 * occurs when 6 sections mount simultaneously after hydration and the page
 * grows by ~200rem in one frame.
 *
 * Uses `.nn-premium-home-section` so it inherits the same
 * `min-height: var(--nn-premium-home-section-min, 34rem)` and
 * `content-visibility: auto` rules already defined in globals.css.
 * The `short` prop halves the min-height for the CTA band.
 */
function PremiumSectionSkeleton({ testId, short }: { testId: string; short?: boolean }) {
  return (
    <div
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      style={short ? { "--nn-premium-home-section-min": "16rem" } as React.CSSProperties : undefined}
      aria-hidden
      data-testid={testId}
    />
  );
}


/* ------------------ TYPES ------------------ */

export type HomeRestoredClientProps = PropsWithChildren<{
  homeMarketingStats?: HomeMarketingStats | null;
  publishedGlobalRegionCardIds?: readonly string[] | null;
  /** Server-built carousel slides — avoids client-side slide assembly on hydration. */
  homeHeroCarouselSlides?: readonly HomeHeroSlide[] | null;
  /**
   * Server-rendered island for PremiumHomepageHero.
   * When provided (from HomeRestoredWithDeferredStats RSC), the hero is fully
   * static HTML — no above-fold hydration. Falls back to nothing when absent
   * (locale route renders its own hero slot).
   */
  heroSlot?: React.ReactNode;
  /**
   * Server-rendered island for PremiumClinicalDepth.
   * Passed from the parent Server Component so this section never hydrates.
   */
  clinicalDepthSlot?: React.ReactNode;
  /**
   * Server-rendered island for PremiumHomepageTrust.
   * Passed from the parent Server Component so this section never hydrates.
   */
  trustSlot?: React.ReactNode;
}>;

/* ------------------ COMPONENT ------------------ */

export default function HomeRestoredClient({
  homeMarketingStats: _homeMarketingStats,
  publishedGlobalRegionCardIds: _publishedGlobalRegionCardIds,
  homeHeroCarouselSlides,
  heroSlot,
  clinicalDepthSlot,
  trustSlot,
  children,
}: HomeRestoredClientProps) {
  const { locale } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const marketingRegion = region === "US" ? "US" : "CA";

  /* ------------------ RENDER ------------------ */

  return (
    <div className="font-sans flex w-full min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)] nn-home-marketing-root">
      <FunnelHomepageViewBeaconLazy marketingRegion={marketingRegion} marketingLocale={locale} />

      {/* HERO — server island (PremiumHomepageHero is now an RSC).
          Rendered by HomeRestoredWithDeferredStats and passed here as heroSlot
          so the hero HTML is static — no above-fold hydration.
          Only the CTA buttons (MarketingTrackedLink) and LeafWatermark inside
          it hydrate as client islands. */}
      {heroSlot}

      <HomeHeroScreenshotSectionLazy serverPreparedSlides={homeHeroCarouselSlides} />

      <PremiumHomepageEcg />
      <PremiumPathwayShowcase />

      {/* Server island — PremiumClinicalDepth is a Server Component rendered by the
          parent RSC (HomeRestoredWithDeferredStats). React does not hydrate this subtree. */}
      {clinicalDepthSlot}

      <PremiumStudyEcosystem />
      <PremiumSocialStudy />
      <PremiumReadinessPreview />

      {/* Server island — PremiumHomepageTrust is a Server Component rendered by the
          parent RSC (HomeRestoredWithDeferredStats). React does not hydrate this subtree. */}
      {trustSlot}

      {/* Global hub strip — after pathway cards (supporting marketing, not above hero).
          Pass as `children` from the server page so RSC streaming keeps DOM order under the hero. */}
      {children}

      <PremiumHomepageCta />
    </div>
  );
}
