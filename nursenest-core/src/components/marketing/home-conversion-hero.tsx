"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlidesAtIndices } from "@/config/home-hero-carousel";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import {
  marketingRegionToggleSegment,
  marketingRegionToggleShell,
} from "@/lib/theme/marketing-region-toggle";
import { MarketingTrustSignalsStrip } from "@/components/marketing/marketing-trust-signals-strip";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

const PREVIEW_SLIDE_INDICES: readonly number[] = [0, 1, 2];

/**
 * Above-the-fold hero: outcome headline, benefit subhead, primary signup CTA, secondary lessons + bank links,
 * region toggle, soft gradient, and product screenshot carousel.
 */
export function HomeConversionHero() {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const regionToggleAnalytics = useMemo(
    () => ({ currentRegion: region, surface: "home_hero" as const }),
    [region],
  );
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion, regionToggleAnalytics);

  const slides = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, PREVIEW_SLIDE_INDICES),
    [t],
  );

  const loc = (path: string) => withMarketingLocale(locale, path);

  return (
    <section
      className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--theme-primary)_5%,var(--theme-page-bg))]"
      data-testid="hero-section"
      aria-labelledby="home-conversion-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 nn-hero-pastel-layers opacity-[0.92]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <div className="min-w-0 space-y-6">
            <h1
              id="home-conversion-hero-heading"
              className="nn-marketing-h1 text-balance text-[var(--theme-heading-text)]"
              data-testid="text-hero-heading"
            >
              {t("home.conversion.heroTitle")}
            </h1>
            <p className="nn-marketing-body max-w-xl text-pretty text-[var(--theme-muted-text)]" data-testid="text-hero-subheading">
              {t("home.conversion.heroSub")}
            </p>

            <div className="max-w-xl">
              <MarketingTrustSignalsStrip variant="default" />
            </div>

            <div
              className="flex flex-col gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)]/90 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
              data-testid="region-toggle-hero"
            >
              <span className="nn-marketing-caption text-[var(--theme-muted-text)]">{t("nav.regionLabel")}</span>
              <div className={marketingRegionToggleShell("rounded")} role="group" aria-label={t("nav.regionLabel")}>
                <button
                  type="button"
                  onClick={() => setRegionAndRefresh("US")}
                  className={marketingRegionToggleSegment(region === "US", "default")}
                  data-testid="button-region-us"
                >
                  {t("home.region.us")}
                </button>
                <button
                  type="button"
                  onClick={() => setRegionAndRefresh("CA")}
                  className={marketingRegionToggleSegment(region === "CA", "default")}
                  data-testid="button-region-ca"
                >
                  {t("home.region.ca")}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <MarketingTrackedLink
                href={loc(HUB.signup)}
                event={PH.marketingHomeHeroPrimaryCta}
                eventProps={{ region, destination: "signup", surface: "hero_primary" }}
                className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl shadow-[var(--shadow-card)]`}
                data-testid="button-hero-start-practicing"
              >
                {t("home.conversion.ctaStartPracticing")}
                <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={loc(HUB.examLessons)}
                event={PH.marketingHomeHeroSecondaryCta}
                eventProps={{ region, destination: "lessons", surface: "hero_secondary" }}
                className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl`}
                data-testid="button-hero-explore-lessons"
              >
                {t("home.conversion.ctaExploreLessons")}
              </MarketingTrackedLink>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <MarketingTrackedLink
                href={loc(HUB.questionBank)}
                event={PH.marketingHomeHeroSecondaryCta}
                eventProps={{ region, destination: "question_bank", surface: "hero_tertiary" }}
                className={`${MARKETING_TERTIARY_LINK_CLASS} font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline`}
                data-testid="button-hero-try-bank"
              >
                {t("home.conversion.ctaTryFreeBank")}
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href="#home-platform-preview"
                event={PH.marketingHomeHeroSecondaryCta}
                eventProps={{ region, destination: "platform_preview", surface: "hero_scroll" }}
                className={`${MARKETING_TERTIARY_LINK_CLASS} text-[var(--theme-muted-text)] hover:text-[var(--theme-heading-text)]`}
                data-testid="button-hero-see-how-it-works"
              >
                {t("home.conversion.ctaSeeHow")}
              </MarketingTrackedLink>
            </div>

            <p className="nn-marketing-caption max-w-lg text-pretty text-[var(--theme-muted-text)]">{t("home.conversion.heroTrustMicro")}</p>
          </div>

          <div
            className="relative mx-auto w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)]/85 p-2 shadow-[var(--shadow-elevated)] backdrop-blur-sm lg:mx-0 lg:max-w-none"
            data-testid="home-hero-platform-preview"
          >
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-90 [background-image:var(--nn-aesthetic-frame-shine)]"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-xl">
              <MarketingHeroCarousel
                slides={slides}
                mediaFrame="default"
                testIdPrefix="home-hero-preview"
                imgTestIdPrefix="hero-preview"
                captionOverlay
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
