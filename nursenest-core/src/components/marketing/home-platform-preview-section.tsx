"use client";

import { useMemo } from "react";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlides } from "@/config/home-hero-carousel";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Full screenshot carousel directly under the homepage hero CTAs so visitors see the product early.
 * Uses the same CDN image chain and i18n slide copy as `MarketingHeroCarousel` elsewhere.
 */
export function HomePlatformPreviewSection() {
  const { t, locale } = useMarketingI18n();
  const slides = useMemo(() => buildHomepageHeroSlides(t), [t, locale]);

  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] pt-7 pb-9 md:pt-9 md:pb-11"
      aria-labelledby="home-platform-preview-heading"
      data-testid="section-home-platform-carousel"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-5 max-w-3xl text-center md:mb-6">
          <h2 id="home-platform-preview-heading" className="nn-marketing-h2 text-balance">
            {t("home.landing.platformCarousel.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.landing.platformCarousel.sub")}
          </p>
        </header>
        <div className="mx-auto w-full max-w-5xl min-w-0">
          <MarketingHeroCarousel
            slides={slides}
            mediaFrame="default"
            testIdPrefix="home-platform-carousel"
            imgTestIdPrefix="platform"
          />
        </div>
      </div>
    </section>
  );
}
