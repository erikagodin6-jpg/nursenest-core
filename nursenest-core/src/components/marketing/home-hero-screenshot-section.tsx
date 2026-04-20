"use client";

import { useMemo } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase } from "@/lib/format/text-case";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import {
  buildHomepageHeroSlidesAtIndices,
  getHomeHeroSlideExamTrackKey,
  HOME_HERO_PRIMARY_CAROUSEL_INDICES,
} from "@/config/home-hero-carousel";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";

/**
 * Product screenshot carousel directly under the conversion hero — compact card width, sharp stills, lazy secondary slides.
 */
export function HomeHeroScreenshotSection() {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const slides = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, HOME_HERO_PRIMARY_CAROUSEL_INDICES),
    [t],
  );

  return (
    <section
      className="border-b border-[var(--header-nav-border)] bg-[var(--page-bg)] pt-6 md:pt-8"
      aria-label={t("components.homeConversionSections.platformCarouselHeading")}
      data-testid="home-hero-screenshot-section"
    >
      <div className="nn-section-shell pb-4 sm:pb-5 md:pb-6">
        <div className="mx-auto mb-5 max-w-2xl text-center md:mb-6">
          <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {formatSentenceCase(t("pages.home.carouselHandoff.kicker"), locale)}
          </p>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty leading-relaxed text-[var(--semantic-text-muted)]">
            {formatSentenceCase(t("pages.home.carouselHandoff.lead"), locale)}
          </p>
        </div>
        <div className="mx-auto w-full max-w-2xl">
          <MarketingHeroCarousel
            slides={slides}
            mediaFrame="section"
            testIdPrefix="hero-platform-carousel"
            imgTestIdPrefix="hero-platform"
            captionOverlay={false}
            onActiveSlideAnalytics={(slide) => {
              trackProductEvent(PH.marketingHomeHeroCarouselTierImpression, {
                marketing_locale: locale,
                marketing_region: region,
                hero_screenshot_index: slide.index,
                hero_exam_track: getHomeHeroSlideExamTrackKey(slide.index),
                surface: "home_hero_screenshot_section",
              });
            }}
          />
        </div>
      </div>
    </section>
  );
}
