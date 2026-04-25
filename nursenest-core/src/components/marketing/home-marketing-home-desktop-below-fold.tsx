"use client";

/**
 * Desktop-only homepage slices (marketing `/` + localized `/[locale]`).
 */
import dynamic from "next/dynamic";

function HomeDesktopHeavyLoadingReserve({ minHeight }: { minHeight: string }) {
  return (
    <div
      className="border-b border-[var(--header-nav-border)] bg-[var(--page-bg)] px-4 py-[var(--nn-rhythm-mobile-section-y)] sm:px-6 md:py-[var(--nn-rhythm-shell-y)]"
      aria-hidden="true"
    >
      <div
        className="mx-auto max-w-5xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--semantic-panel-muted)]"
        style={{ minHeight }}
      />
    </div>
  );
}

const HomeHeroScreenshotSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-hero-screenshot-section").then(
      (m) => m.HomeHeroScreenshotSection,
    ),
  {
    ssr: false,
    loading: () => <HomeDesktopHeavyLoadingReserve minHeight="24rem" />,
  },
);

const HomeHowItWorksSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-how-it-works-section").then(
      (m) => m.HomeHowItWorksSection,
    ),
  {
    ssr: false,
    loading: () => <HomeDesktopHeavyLoadingReserve minHeight="18rem" />,
  },
);

const HomeSampleQuestionPreviewLazy = dynamic(
  () =>
    import("@/components/marketing/home-sample-question-preview").then(
      (m) => m.HomeSampleQuestionPreview,
    ),
  {
    ssr: false,
    loading: () => <HomeDesktopHeavyLoadingReserve minHeight="16rem" />,
  },
);

const HomeGlobalRegionsSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-global-regions-section").then(
      (m) => m.HomeGlobalRegionsSection,
    ),
  {
    ssr: false,
    loading: () => <HomeDesktopHeavyLoadingReserve minHeight="20rem" />,
  },
);

const HomeTrustFearsSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-trust-fears-section").then(
      (m) => m.HomeTrustFearsSection,
    ),
  {
    ssr: false,
    loading: () => <HomeDesktopHeavyLoadingReserve minHeight="14rem" />,
  },
);

const HomePlatformPreviewSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-platform-preview-section").then(
      (m) => m.HomePlatformPreviewSection,
    ),
  {
    ssr: false,
    loading: () => <HomeDesktopHeavyLoadingReserve minHeight="22rem" />,
  },
);

const HomeTrustProofSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-trust-proof-section").then(
      (m) => m.HomeTrustProofSection,
    ),
  {
    ssr: false,
    loading: () => <HomeDesktopHeavyLoadingReserve minHeight="18rem" />,
  },
);

const HomeObjectionFaqSectionLazy = dynamic(
  () =>
    import("@/components/marketing/home-objection-faq-section").then(
      (m) => m.HomeObjectionFaqSection,
    ),
  {
    ssr: false,
    loading: () => <HomeDesktopHeavyLoadingReserve minHeight="16rem" />,
  },
);

export type HomeMarketingDesktopRegionsStackProps = {
  publishedGlobalRegionCardIds?: readonly string[] | null;
};

/** Carousel → how it works → sample → global regions. */
export function HomeMarketingDesktopRegionsStack({
  publishedGlobalRegionCardIds,
}: HomeMarketingDesktopRegionsStackProps) {
  return (
    <>
      <HomeHeroScreenshotSectionLazy />
      <HomeHowItWorksSectionLazy />
      <HomeSampleQuestionPreviewLazy />
      <HomeGlobalRegionsSectionLazy
        visibleCardIds={publishedGlobalRegionCardIds ?? []}
      />
    </>
  );
}

export type HomeMarketingDesktopPostTrustStackProps = {
  questionCount?: number | null;
  registeredLearners?: number | null;
};

/** Trust fears → platform → proof → objection FAQ. */
export function HomeMarketingDesktopPostTrustStack({
  questionCount,
  registeredLearners,
}: HomeMarketingDesktopPostTrustStackProps) {
  return (
    <>
      <HomeTrustFearsSectionLazy
        questionCount={Number.isFinite(questionCount) ? Number(questionCount) : 0}
        registeredLearners={
          Number.isFinite(registeredLearners) ? Number(registeredLearners) : 0
        }
      />
      <HomePlatformPreviewSectionLazy />
      <HomeTrustProofSectionLazy />
      <HomeObjectionFaqSectionLazy />
    </>
  );
}