"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  buildSafeMarketingHeroSlides,
  MarketingHeroCarousel,
} from "@/components/marketing/marketing-hero-carousel";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import {
  buildHomepageHeroSlidesAtIndices,
  getHomeHeroSlideExamTrackKey,
  HOME_HERO_PRIMARY_CAROUSEL_INDICES,
} from "@/config/home-hero-carousel";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { HomeMarketingHeroCarouselErrorBoundary } from "@/components/marketing/home-marketing-hero-carousel-error-boundary";

function safeT(t: ((key: string) => string) | undefined, key: string, fallback: string): string {
  try {
    const value = t?.(key);
    return typeof value === "string" && value.trim() ? value : fallback;
  } catch {
    return fallback;
  }
}

export function HomeHeroScreenshotSection() {
  const { locale: ctxLocale, t } = useMarketingI18n();
  const { region: ctxRegion } = useNursenestRegion();
  const locale = ctxLocale || "en";
  const region = ctxRegion || "CA";

  const builtSlides = useMemo(() => {
    try {
      return buildHomepageHeroSlidesAtIndices(t, HOME_HERO_PRIMARY_CAROUSEL_INDICES);
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.error("[HomeHeroScreenshotSection] buildHomepageHeroSlidesAtIndices failed");
      }
      return [];
    }
  }, [t]);

  const validSlides = useMemo(
    () => buildSafeMarketingHeroSlides(builtSlides),
    [builtSlides],
  );

  const questionsHref = withMarketingLocale(locale, HUB.questionBank);

  const carouselHandoffFallback = (
    <div className="mx-auto max-w-2xl text-center" data-testid="home-hero-carousel-static-handoff">
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
      <p className="mt-5">
        <MarketingTrackedLink
          href={questionsHref}
          event={PH.marketingHomeHeroPrimaryCta}
          eventProps={{ region, surface: "home_hero_screenshot_text_fallback" }}
          className="nn-marketing-body inline-flex items-center gap-1 font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
        >
          {safeT(t, "pages.home.carouselHandoff.fallbackCta", "Open the question bank")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </MarketingTrackedLink>
      </p>
    </div>
  );

  if (!validSlides.length) {
    return (
      <section
        id="home-hero-product-carousel"
        className="border-b border-[var(--header-nav-border)] nn-home-hero-product-band bg-[var(--page-bg)] pt-[var(--nn-rhythm-mobile-section-y)] md:pt-[var(--nn-rhythm-shell-y)]"
        aria-label={safeT(
          t,
          "components.homeConversionSections.platformCarouselHeading",
          "Product preview",
        )}
        aria-describedby="home-conversion-hero-heading"
        data-testid="home-hero-screenshot-section"
      >
        <div className="nn-section-shell pb-[var(--nn-rhythm-shell-y)]">{carouselHandoffFallback}</div>
      </section>
    );
  }

  return (
    <section
      id="home-hero-product-carousel"
      className="border-b border-[var(--header-nav-border)] nn-home-hero-product-band bg-[var(--page-bg)] pt-[var(--nn-rhythm-mobile-section-y)] md:pt-[var(--nn-rhythm-shell-y)]"
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

        <div
          className="mx-auto w-full max-w-2xl"
          data-testid="home-marketing-hero-carousel-bounded"
        >
          <HomeMarketingHeroCarouselErrorBoundary fallback={carouselHandoffFallback}>
            <MarketingHeroCarousel
              slides={validSlides}
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
          </HomeMarketingHeroCarouselErrorBoundary>
        </div>
      </div>
    </section>
  );
}