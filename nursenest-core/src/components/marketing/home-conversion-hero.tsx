"use client";

import { useMemo } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlidesAtIndices, getHomeHeroSlideExamTrackKey } from "@/config/home-hero-carousel";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/copy/cta-copy";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

const HERO_SLIDE_ORDER: readonly number[] = [9, 0, 6, 2, 8];

/**
 * Premium split hero: concise message + conversion CTAs + real product preview carousel.
 */
export function HomeConversionHero() {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const slides = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, HERO_SLIDE_ORDER),
    [t, locale],
  );

  return (
    <section
      className="nn-hero-branded relative overflow-hidden border-b border-[var(--header-nav-border)] bg-[var(--page-bg)]"
      data-testid="hero-section"
      aria-labelledby="home-conversion-hero-heading"
    >
      <div className="relative pt-8 pb-16 md:pt-8 md:pb-20">
        <div className="nn-section-shell">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="min-w-0 space-y-6">
              <p className="nn-marketing-caption inline-block max-w-full text-balance break-words rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-3 py-1 font-semibold text-[var(--pill-fg)]">
                {formatTitleCase("NurseNest Exam Prep Platform", locale)}
              </p>
              <h1
                id="home-conversion-hero-heading"
                className="nn-marketing-h1 max-w-2xl text-balance break-words text-[var(--palette-heading)]"
                data-testid="text-hero-heading"
              >
                {formatTitleCase("Pass your exam with prep built for your license", locale)}
              </h1>
              <p className="nn-marketing-body max-w-xl text-pretty break-words text-[var(--palette-text-muted)]" data-testid="text-hero-subheading">
                {formatSentenceCase(
                  "Train with pathway-scoped questions, full rationales, and CAT readiness signals so every study session moves you closer to exam day.",
                  locale,
                )}
              </p>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-start">
                <MarketingTrackedLink
                  href={loc(HUB.signup)}
                  event={PH.marketingHomeHeroPrimaryCta}
                  eventProps={{
                    region,
                    marketing_region: region,
                    marketing_locale: locale,
                    destination: "signup",
                    surface: "hero_primary",
                    exam_tier_band: "undifferentiated_cta",
                  }}
                  className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl shadow-[var(--shadow-card)]`}
                  data-testid="button-hero-start-practicing"
                >
                  {formatTitleCase(PRIMARY_CTA, locale)}
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
                </MarketingTrackedLink>
                <MarketingTrackedLink
                  href={loc(HUB.questionBank)}
                  event={PH.marketingHomeHeroSecondaryCta}
                  eventProps={{
                    region,
                    marketing_region: region,
                    marketing_locale: locale,
                    destination: "question_bank",
                    surface: "hero_try_free",
                    exam_tier_band: "undifferentiated_cta",
                  }}
                  className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl border border-[var(--border-subtle)] shadow-sm`}
                  data-testid="button-hero-try-free-questions"
                >
                  {formatTitleCase(SECONDARY_CTA, locale)}
                </MarketingTrackedLink>
              </div>
              <p className="nn-marketing-caption flex min-w-0 items-start gap-2 text-balance break-words text-[var(--palette-text-muted)]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                {formatSentenceCase("No credit card required to start your first practice sessions.", locale)}
              </p>
            </div>

            <div
              className="overflow-hidden rounded-2xl border bg-[var(--bg-card)] p-2.5 shadow-[var(--shadow-elevated)]"
              style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 18%, var(--border-subtle))" }}
            >
              <MarketingHeroCarousel
                slides={slides}
                mediaFrame="hero"
                testIdPrefix="hero-platform-carousel"
                imgTestIdPrefix="hero-platform"
                captionOverlay
                onActiveSlideAnalytics={(slide) => {
                  trackProductEvent(PH.marketingHomeHeroCarouselTierImpression, {
                    marketing_locale: locale,
                    marketing_region: region,
                    hero_screenshot_index: slide.index,
                    hero_exam_track: getHomeHeroSlideExamTrackKey(slide.index),
                    surface: "home_conversion_hero_carousel",
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
