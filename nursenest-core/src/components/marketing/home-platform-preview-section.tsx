"use client";

import { useMemo } from "react";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlidesAtIndices } from "@/config/home-hero-carousel";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { HomeConversionCtaStrip } from "@/components/marketing/home-conversion-cta-strip";

/**
 * Order screenshots so the first passes highlight bank, rationales/lessons, flashcards, dashboard,
 * lesson library, reports, and NGN-style items before the rest (still all 15 slides, no duplicates).
 * Indices are zero-based against `HOMEPAGE_HERO_SLIDE_METADATA` (screenshot1 … screenshot15).
 */
const PLATFORM_PREVIEW_SLIDE_ORDER: readonly number[] = [
  9, 0, 11, 1, 2, 12, 4, 3, 5, 6, 7, 8, 10, 13, 14,
];

/**
 * Full screenshot carousel directly under the homepage hero CTAs so visitors see the product early.
 * Uses the same CDN image chain and i18n slide copy as `MarketingHeroCarousel` elsewhere.
 */
export function HomePlatformPreviewSection() {
  const { t, locale } = useMarketingI18n();
  const slides = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, PLATFORM_PREVIEW_SLIDE_ORDER),
    [t, locale],
  );

  return (
    <section
      id="home-platform-preview"
      className="nn-panel-chart-fade scroll-mt-20 border-t border-[var(--border-subtle)] bg-[var(--theme-page-bg)] pt-7 pb-9 md:pt-9 md:pb-11"
      aria-labelledby="home-platform-preview-heading"
      data-testid="section-home-platform-carousel"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-5 max-w-3xl text-center md:mb-6">
          <p className="nn-marketing-caption font-medium tracking-wide text-[color-mix(in_srgb,var(--theme-primary)_78%,var(--theme-heading-text))]">
            {t("home.landing.platformCarousel.bridge")}
          </p>
          <h2 id="home-platform-preview-heading" className="nn-marketing-h2 mt-2 text-balance">
            {t("home.landing.platformCarousel.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.landing.platformCarousel.sub")}
          </p>
          <p className="nn-marketing-caption mx-auto mt-3 max-w-2xl text-pretty text-[color-mix(in_srgb,var(--theme-primary)_70%,var(--theme-muted-text))]">
            {t("home.landing.platformCarousel.previewLabels")}
          </p>
        </header>
        <div className="mx-auto w-full max-w-5xl min-w-0">
          <MarketingHeroCarousel
            slides={slides}
            mediaFrame="default"
            testIdPrefix="home-platform-carousel"
            imgTestIdPrefix="platform"
            captionOverlay
          />
        </div>
        <div className="mx-auto mt-8 max-w-5xl border-t border-[var(--border-subtle)] pt-8">
          <HomeConversionCtaStrip placement="after_platform_preview" />
        </div>
      </div>
    </section>
  );
}
