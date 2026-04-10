"use client";

import { useMemo } from "react";
import { ArrowRight, Stethoscope, HeartPulse, Award, Dna, BookOpen } from "lucide-react";
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
} from "@/lib/theme/marketing-hero-pattern";
import { marketingExamHubPath, type CountryExamOfferingId } from "@/lib/marketing/country-exam-offerings";
import type { LucideIcon } from "lucide-react";

/** Learner home, question UI, session reports — instant product comprehension. */
const PREVIEW_SLIDE_INDICES: readonly number[] = [9, 0, 11];

type TierEntry = {
  id: string;
  icon: LucideIcon;
  /** i18n key — PN uses US vs CA variants in `tierPillLabelKey`. */
  tierPillLabelKey: string;
  href: (locale: (p: string) => string) => string;
};

/**
 * Above-the-fold hero: outcome headline, quick-entry tier pills (RN / LPN·NCLEX-PN vs RPN·REx-PN / NP / Allied / Pre-nursing),
 * primary signup CTA, region toggle, and product screenshot carousel.
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

  const TIERS: TierEntry[] = useMemo((): TierEntry[] => {
    const hub = (id: CountryExamOfferingId) => (l: (p: string) => string) => l(marketingExamHubPath(region, id));
    const pnKey =
      region === "CA" ? "home.conversion.tierPill.pnCA" : "home.conversion.tierPill.pnUS";
    return [
      { id: "rn", icon: Stethoscope, tierPillLabelKey: "home.conversion.tierPill.rn", href: hub("rn") },
      { id: "pn", icon: HeartPulse, tierPillLabelKey: pnKey, href: hub("pn") },
      { id: "np", icon: Award, tierPillLabelKey: "home.conversion.tierPill.np", href: hub("np") },
      { id: "allied", icon: Dna, tierPillLabelKey: "home.conversion.tierPill.allied", href: hub("allied") },
      {
        id: "new-grad",
        icon: BookOpen,
        tierPillLabelKey: "home.conversion.tierPill.preNursing",
        href: (l) => l("/pre-nursing"),
      },
    ];
  }, [region]);

  return (
    <section
      className="nn-hero-branded relative overflow-hidden border-b border-[var(--header-nav-border)]"
      data-testid="hero-section"
      aria-labelledby="home-conversion-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 nn-hero-pastel-layers opacity-[0.92]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <div className="min-w-0 space-y-6">
            {/* One focused branded moment at the top — badge capsule, not competing accents */}
            <p className="mb-2 inline-flex items-center rounded-full border border-[var(--accent-surface-a-border)] bg-[var(--accent-surface-a)] px-3 py-0.5 nn-marketing-caption font-bold uppercase tracking-[0.12em] text-[var(--accent-surface-a-text)]">
              {t("home.conversion.heroEyebrow")}
            </p>
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
              <MarketingTrustSignalsStrip variant="default" homeHeroTrust />
            </div>

            {/* Quick-entry tier pills — accent-surface-b container gives secondary-hue variety */}
            <div
              className="nn-accent-surface-b rounded-2xl px-4 py-4"
              data-testid="hero-tier-quick-entry"
            >
              <p className="nn-marketing-caption mb-3 font-semibold text-[var(--theme-body-text)]">
                {t("home.conversion.heroTierIntro")}
              </p>
              <nav className="flex flex-wrap gap-2" aria-label={t("home.conversion.heroTierNavAria")}>
                {TIERS.map((tier) => {
                  const Icon = tier.icon;
                  return (
                    <MarketingTrackedLink
                      key={tier.id}
                      href={tier.href(loc)}
                      event={PH.marketingHomeHeroPrimaryCta}
                      eventProps={{ region, destination: tier.id, surface: "hero_tier_pill" }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-surface-a-border)] bg-[var(--accent-surface-a)] px-3.5 py-2 text-sm font-semibold text-[var(--theme-heading-text)] shadow-sm transition hover:border-[var(--accent-surface-a-border)] hover:bg-[var(--surface-bubble)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring-accent)]"
                      data-testid={`button-hero-tier-${tier.id}`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--text-accent)]" aria-hidden />
                      {t(tier.tierPillLabelKey)}
                    </MarketingTrackedLink>
                  );
                })}
              </nav>

              {/* Region toggle inline with the tier pills */}
              <div
                className="mt-3 flex items-center gap-2 border-t border-[var(--accent-surface-b-border)] pt-3"
                data-testid="region-toggle-hero"
              >
                <span className="nn-marketing-caption shrink-0 text-[var(--theme-muted-text)]">{t("nav.regionLabel")}</span>
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
            </div>

            {/* Primary + secondary CTAs */}
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
                href={loc(HUB.questionBank)}
                event={PH.marketingHomeHeroSecondaryCta}
                eventProps={{ region, destination: "question_bank", surface: "hero_try_free" }}
                className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl border border-[var(--border-subtle)] shadow-sm`}
                data-testid="button-hero-try-free-questions"
              >
                {t("home.conversion.ctaTryFreeBank")}
              </MarketingTrackedLink>
            </div>

            <p className="nn-marketing-body-sm max-w-lg text-pretty text-[var(--theme-body-text)]">{t("home.conversion.heroFreeLine")}</p>
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
