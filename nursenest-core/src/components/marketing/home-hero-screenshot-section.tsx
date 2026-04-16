"use client";

import { useMemo } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
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
 * Product screenshot carousel directly under the conversion hero — constrained width, sharp stills, lazy secondary slides.
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
      className="border-b border-[var(--header-nav-border)] bg-[var(--page-bg)]"
      aria-label={t("components.homeConversionSections.platformCarouselHeading")}
      data-testid="home-hero-screenshot-section"
    >
      {/* Narrow column: screenshot dominates; padding matches section shell */}
      <div className="nn-section-shell py-3 sm:py-4 md:py-5">
        <div className="mx-auto w-full max-w-3xl">
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
