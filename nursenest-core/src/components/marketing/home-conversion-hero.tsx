"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlidesAtIndices } from "@/config/home-hero-carousel";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import {
  marketingRegionToggleSegment,
  marketingRegionToggleShell,
} from "@/lib/theme/marketing-region-toggle";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MARKETING_SECONDARY_CTA_CLASS } from "@/lib/theme/marketing-hero-pattern";

const PREVIEW_SLIDE_INDICES: readonly number[] = [0, 1, 2];

/**
 * Above-the-fold hero: outcome headline, system subhead, three primary exam CTAs,
 * secondary scroll to product preview, soft gradient, and compact screenshot carousel.
 */
export function HomeConversionHero() {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion);

  const slides = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, PREVIEW_SLIDE_INDICES),
    [t, locale],
  );

  const loc = (path: string) => withMarketingLocale(locale, path);
  const rnHub = loc(marketingExamHubPath(region, "rn"));
  const pnHub = loc(marketingExamHubPath(region, "pn"));
  const npHub = loc(marketingExamHubPath(region, "np"));

  const primaryCtaClass =
    "inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--theme-primary)_35%,var(--border-subtle))] bg-[var(--theme-card-bg)] px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--theme-primary)_55%,var(--border-subtle))] hover:bg-[var(--nn-presentation-wash)] sm:w-auto sm:min-w-[9.5rem]";

  return (
    <section
      className="relative overflow-hidden border-b border-[var(--border-subtle)]"
      data-testid="hero-section"
      aria-labelledby="home-conversion-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--theme-primary)_14%,transparent),transparent_55%)]"
        aria-hidden
      />
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

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <MarketingTrackedLink
                href={rnHub}
                event={PH.marketingHomeHeroPrimaryCta}
                eventProps={{ region, destination: "hub_rn", surface: "hero_primary" }}
                secondaryCapture={{
                  event: PH.funnelHomeToExamHub,
                  eventProps: { placement: "hero_start_rn", pathway: "rn", region },
                }}
                className={primaryCtaClass}
                data-testid="button-hero-start-rn"
              >
                {t("home.conversion.ctaRn")}
                <ArrowRight className="ml-2 h-4 w-4 shrink-0 opacity-80" aria-hidden />
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={pnHub}
                event={PH.marketingHomeHeroPrimaryCta}
                eventProps={{ region, destination: "hub_pn", surface: "hero_primary" }}
                secondaryCapture={{
                  event: PH.funnelHomeToExamHub,
                  eventProps: { placement: "hero_start_pn", pathway: "pn", region },
                }}
                className={primaryCtaClass}
                data-testid="button-hero-start-pn"
              >
                {region === "US" ? t("home.conversion.ctaLpn") : t("home.conversion.ctaRpn")}
                <ArrowRight className="ml-2 h-4 w-4 shrink-0 opacity-80" aria-hidden />
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={npHub}
                event={PH.marketingHomeHeroPrimaryCta}
                eventProps={{ region, destination: "hub_np", surface: "hero_primary" }}
                secondaryCapture={{
                  event: PH.funnelHomeToExamHub,
                  eventProps: { placement: "hero_start_np", pathway: "np", region },
                }}
                className={primaryCtaClass}
                data-testid="button-hero-start-np"
              >
                {t("home.conversion.ctaNp")}
                <ArrowRight className="ml-2 h-4 w-4 shrink-0 opacity-80" aria-hidden />
              </MarketingTrackedLink>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <MarketingTrackedLink
                href="#home-platform-preview"
                event={PH.marketingHomeHeroSecondaryCta}
                eventProps={{ region, destination: "platform_preview" }}
                className={MARKETING_SECONDARY_CTA_CLASS}
                data-testid="button-hero-see-how-it-works"
              >
                {t("home.conversion.ctaSeeHow")}
              </MarketingTrackedLink>
              <p className="nn-marketing-caption max-w-md text-pretty text-[var(--theme-muted-text)]">{t("home.conversion.heroTrustMicro")}</p>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)]/80 p-2 shadow-[var(--shadow-elevated)] backdrop-blur-sm lg:mx-0 lg:max-w-none"
            data-testid="home-hero-platform-preview"
          >
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/[0.12] via-transparent to-emerald-500/[0.08] opacity-90" aria-hidden />
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
