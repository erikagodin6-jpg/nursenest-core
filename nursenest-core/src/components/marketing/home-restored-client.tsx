"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type PropsWithChildren, type ReactNode, type CSSProperties } from "react";

import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";
import type { HomeHeroSlide } from "@/config/home-hero-carousel";

// ssr:false for below-fold sections prevents hydration mismatch/CLS. The new
// LazyWhenVisible wrapper below also prevents every chunk from downloading and
// executing during the initial Lighthouse window.
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
const PremiumPlatformCapabilityStrip = dynamic(() =>
  import("@/components/marketing/home/premium-platform-capability-strip").then(
    (m) => m.PremiumPlatformCapabilityStrip,
  ),
  { ssr: false, loading: () => <PremiumSectionSkeleton testId="skeleton-capability-strip" short /> },
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

/** Below-fold carousel — separate chunk; lazy-mounted near viewport for TBT. */
const HomeHeroScreenshotSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-hero-screenshot-section").then((m) => ({
      default: m.HomeHeroScreenshotSection,
    })),
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
 * The placeholder keeps geometry while the real section waits for viewport
 * proximity, preventing CLS without executing all homepage JS immediately.
 */
function PremiumSectionSkeleton({ testId, short }: { testId: string; short?: boolean }) {
  return (
    <div
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      style={short ? { "--nn-premium-home-section-min": "16rem" } as CSSProperties : undefined}
      aria-hidden
      data-testid={testId}
    />
  );
}

type LazyWhenVisibleProps = {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
};

function runAfterInitialPaint(callback: () => void): () => void {
  let cancelled = false;
  let timeoutId = 0;
  let idleId: number | null = null;

  const run = () => {
    if (cancelled) return;
    callback();
  };

  timeoutId = window.setTimeout(() => {
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(run, { timeout: 2500 });
      return;
    }
    run();
  }, 2200);

  return () => {
    cancelled = true;
    window.clearTimeout(timeoutId);
    if (idleId !== null && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(idleId);
    }
  };
}

function IdleAfterPaint({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => runAfterInitialPaint(() => setReady(true)), []);

  return ready ? <>{children}</> : null;
}

/**
 * Defers below-fold client chunks until the user is close to them.
 * This directly attacks Lighthouse TBT by avoiding immediate execution of the
 * carousel/ECG/pathway/readiness/social chunks while preserving page height.
 */
function LazyWhenVisible({ children, fallback, rootMargin = "360px 0px" }: LazyWhenVisibleProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      const id = globalThis.setTimeout(() => setVisible(true), 2200);
      return () => globalThis.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return <div ref={ref}>{visible ? children : fallback}</div>;
}

/* ------------------ TYPES ------------------ */

export type HomeRestoredClientProps = PropsWithChildren<{
  homeMarketingStats?: HomeMarketingStats | null;
  publishedGlobalRegionCardIds?: readonly string[] | null;
  /** Server-built carousel slides — avoids client-side slide assembly on hydration. */
  homeHeroCarouselSlides?: readonly HomeHeroSlide[] | null;
  /** Server-rendered island for PremiumHomepageHero. */
  heroSlot?: ReactNode;
  /** Server-rendered island for PremiumClinicalDepth. */
  clinicalDepthSlot?: ReactNode;
  /** Server-rendered island for PremiumHomepageTrust. */
  trustSlot?: ReactNode;
  /** Server-resolved locale/region avoids hydrating i18n + region contexts in this shell. */
  locale?: string;
  marketingRegion?: "US" | "CA" | string;
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
  locale = "en",
  marketingRegion = "CA",
}: HomeRestoredClientProps) {
  const normalizedMarketingRegion = marketingRegion === "US" ? "US" : "CA";

  /* ------------------ RENDER ------------------ */

  return (
    <div
      className="font-sans flex w-full min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)] nn-home-marketing-root"
      data-nn-homepage-branding-revamp
      data-nn-homepage-premium-polish
      data-nn-homepage-feature-visibility
    >
      <IdleAfterPaint>
        <FunnelHomepageViewBeaconLazy marketingRegion={normalizedMarketingRegion} marketingLocale={locale} />
      </IdleAfterPaint>

      {/* HERO — server island; no above-fold homepage section hydration. */}
      {heroSlot}

      <LazyWhenVisible fallback={<HomeHeroScreenshotSectionSkeleton />} rootMargin="480px 0px">
        <HomeHeroScreenshotSectionLazy serverPreparedSlides={homeHeroCarouselSlides} />
      </LazyWhenVisible>

      <LazyWhenVisible fallback={<PremiumSectionSkeleton testId="skeleton-capability-strip" short />}>
        <PremiumPlatformCapabilityStrip />
      </LazyWhenVisible>

      <LazyWhenVisible fallback={<PremiumSectionSkeleton testId="skeleton-ecg" />}>
        <PremiumHomepageEcg />
      </LazyWhenVisible>
      <LazyWhenVisible fallback={<PremiumSectionSkeleton testId="skeleton-pathways" />}>
        <PremiumPathwayShowcase />
      </LazyWhenVisible>

      {/* Server island — keep as static server HTML when supplied. */}
      {clinicalDepthSlot}

      <LazyWhenVisible fallback={<PremiumSectionSkeleton testId="skeleton-ecosystem" />}>
        <PremiumStudyEcosystem />
      </LazyWhenVisible>
      <LazyWhenVisible fallback={<PremiumSectionSkeleton testId="skeleton-social-study" />}>
        <PremiumSocialStudy />
      </LazyWhenVisible>
      <LazyWhenVisible fallback={<PremiumSectionSkeleton testId="skeleton-readiness" />}>
        <PremiumReadinessPreview />
      </LazyWhenVisible>

      {/* Server island — keep as static server HTML when supplied. */}
      {trustSlot}

      {/* Global hub strip — after pathway cards (supporting marketing, not above hero). */}
      {children}

      <LazyWhenVisible fallback={<PremiumSectionSkeleton testId="skeleton-cta" short />}>
        <PremiumHomepageCta />
      </LazyWhenVisible>
    </div>
  );
}
