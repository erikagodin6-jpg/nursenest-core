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

function safeT(t: ((key: string) => string) | undefined, key: string, fallback: string): string {
  try {
    const value = t?.(key);
    return typeof value === "string" && value.trim() ? value : fallback;
  } catch {
    return fallback;
  }
}

export function HomeHeroScreenshotSection() {
  let locale = "en";
  let region = "CA";
  let t: ((key: string) => string) | undefined;

  try {
    const ctx = useMarketingI18n();
    locale = ctx.locale || "en";
    t = ctx.t;
  } catch {}

  try {
    region = useNursenestRegion()?.region || "CA";
  } catch {}

  const slides = useMemo(() => {
    try {
      return buildHomepageHeroSlidesAtIndices(
        t ?? ((key: string) => key),
        HOME_HERO_PRIMARY_CAROUSEL_INDICES,
      );
    } catch {
      return [];
    }
  }, [t]);

  if (!slides.length) return null;

  return (
    <section
      id="home-hero-product-carousel"
      className="border-b border-[var(--header-nav-border)] bg-[var(--page-bg)] pt-[var(--nn-rhythm-mobile-section-y)] md:pt-[var(--nn-rhythm-shell-y)]"
      aria-label={safeT(
        t,
        "components.homeConversionSections.platformCarouselHeading",
        "Product preview",
      )}
      aria-describedby="home-conversion-hero-heading"
      data-testid="home-hero-screenshot-section"
    >
      <div className="nn-section-shell pb-[var(--nn-rhythm-shell-y)]">
        <div className="mx-auto mb-5 max-w-2xl text-center md:mb-6">
          <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {safeT(t, "pages.home.carouselHandoff.kicker", "See how NurseNest works")}
          </p>

          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty leading-relaxed text-[var(--semantic-text-muted)]">
            {safeT(
              t,
              "pages.home.carouselHandoff.lead",
              "Preview lessons, practice questions, flashcards, and study tools.",
            )}
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
              try {
                trackProductEvent(PH.marketingHomeHeroCarouselTierImpression, {
                  marketing_locale: locale,
                  marketing_region: region,
                  hero_screenshot_index: slide.index,
                  hero_exam_track: getHomeHeroSlideExamTrackKey(slide.index),
                  surface: "home_hero_screenshot_section",
                });
              } catch {
                // analytics must never break homepage rendering
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}