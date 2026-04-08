"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import {
  marketingRegionToggleSegment,
  marketingRegionToggleShell,
} from "@/lib/theme/marketing-region-toggle";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { HomeLandingSections } from "@/components/marketing/home-landing-sections";
import { HomePlatformPreviewSection } from "@/components/marketing/home-platform-preview-section";
import { HomeReviewsSection } from "@/components/marketing/home-reviews-section";
import { HomeStudentsStudyingSection } from "@/components/marketing/home-students-studying-section";

type HomeStatsPayload = {
  totalLessons: number;
  pathwayLessonsPublished?: number;
  contentItemsLessonCount?: number;
  questionCount: number;
  totalFlashcards: number;
  totalDecks: number;
  storeProductCount: number;
  registeredLearners?: number;
  questionsByTier?: Record<string, number>;
  scenarioCount?: number;
};

/**
 * Conversion-focused homepage: hero (region, pathways, CTAs, trust line), platform carousel,
 * reviews, static “what students study” modules, then why / trust / FAQ / final CTA (`HomeLandingSections`).
 */
export default function HomeRestoredClient() {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion);
  const [homeStats, setHomeStats] = useState<HomeStatsPayload | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/home-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: HomeStatsPayload | null) => {
        if (cancelled || !d) return;
        setHomeStats(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const questionCount = homeStats?.questionCount ?? 0;

  const pathwayRoutes = [
    {
      id: "rn" as const,
      href: marketingExamHubPath(region, "rn"),
      titleKey: "home.landing.pathways.rnTitle",
      descKey: "home.landing.pathways.rnDesc",
      ctaKey: "home.landing.pathways.ctaRn",
    },
    {
      id: "pn" as const,
      href: marketingExamHubPath(region, "pn"),
      titleKey: region === "US" ? "home.landing.pathways.pnTitleUS" : "home.landing.pathways.pnTitleCA",
      descKey: region === "US" ? "home.landing.pathways.pnDescUS" : "home.landing.pathways.pnDescCA",
      ctaKey: "home.landing.pathways.ctaPn",
    },
    {
      id: "np" as const,
      href: marketingExamHubPath(region, "np"),
      titleKey: "home.landing.pathways.npTitle",
      descKey: region === "US" ? "home.landing.pathways.npDescUS" : "home.landing.pathways.npDescCA",
      ctaKey: "home.landing.pathways.ctaNp",
    },
    {
      id: "allied" as const,
      href: marketingExamHubPath(region, "allied"),
      titleKey: "home.landing.pathways.alliedTitle",
      descKey: "home.landing.pathways.alliedDesc",
      ctaKey: "home.landing.pathways.ctaAllied",
    },
    {
      id: "prenursing" as const,
      href: "/pre-nursing",
      titleKey: "home.landing.pathways.preNursingTitle",
      descKey: "home.landing.pathways.preNursingDesc",
      ctaKey: "home.landing.pathways.ctaPreNursing",
    },
  ];

  return (
    <div className="font-sans md:animate-page-enter flex min-h-screen flex-col overflow-x-hidden bg-[var(--theme-page-bg)]">
      <div className="flex-grow overflow-x-hidden">
        <section
          className="nn-hero-bridge nn-marketing-hero-section relative overflow-hidden border-b border-[var(--border-subtle)] pt-0"
          data-testid="hero-section"
        >
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
            <div className="mx-auto max-w-[52rem] space-y-5">
              <h1 className="nn-marketing-h1 text-balance" data-testid="text-hero-heading">
                {t("home.landing.heroTitle")}
              </h1>
              <p className="nn-marketing-body text-pretty text-[var(--theme-muted-text)]" data-testid="text-hero-subheading">
                {t("home.landing.heroSub")}
              </p>

              <div
                className="flex flex-col gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
                data-testid="region-toggle-hero"
              >
                <div className="flex flex-wrap items-center gap-2">
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
                <div className="flex min-w-0 items-start gap-1.5 sm:justify-end">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--theme-muted-text)]" aria-hidden />
                  <span className="nn-marketing-body-sm leading-snug text-[var(--theme-body-text)]">
                    {t("home.landing.heroRegionHint")}
                  </span>
                </div>
              </div>

              <div data-testid="hero-pathway-cards">
                <p className="nn-marketing-caption mb-3 text-[var(--theme-muted-text)]">{t("home.landing.heroPathwaysCaption")}</p>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {pathwayRoutes.map((p) => (
                    <li key={p.id}>
                      <MarketingTrackedLink
                        href={withMarketingLocale(locale, p.href)}
                        event={PH.marketingHomePathwayCardPrimary}
                        eventProps={{ pathway: p.id, region, surface: "hero" }}
                        secondaryCapture={{
                          event: PH.funnelHomeToExamHub,
                          eventProps: { placement: "hero_pathway", pathway: p.id, region },
                        }}
                        className="nn-marketing-card nn-marketing-card-pad flex h-full min-h-[8.5rem] flex-col transition hover:border-[var(--border-medium)]"
                        aria-label={`${t(p.titleKey)}. ${t(p.ctaKey)}`}
                      >
                        <span className="nn-marketing-h3">{t(p.titleKey)}</span>
                        <span className="nn-marketing-body-sm mt-2 flex-1 text-[var(--theme-muted-text)]">{t(p.descKey)}</span>
                        <span className="nn-marketing-body-sm mt-3 shrink-0 font-semibold text-[var(--theme-primary)]">{t(p.ctaKey)}</span>
                      </MarketingTrackedLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="nn-hero-cta-row space-y-3 border-t border-[var(--border-subtle)] pt-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                  <MarketingTrackedLink
                    href={withMarketingLocale(locale, HUB.signup)}
                    event={PH.marketingHomeHeroPrimaryCta}
                    eventProps={{ region, destination: "signup" }}
                    className={MARKETING_PRIMARY_CTA_CLASS}
                    data-testid="button-hero-start-free"
                  >
                    <span className="whitespace-nowrap">{t("home.landing.ctaPrimary")}</span>
                    <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
                  </MarketingTrackedLink>
                  <MarketingTrackedLink
                    href="#home-platform-preview"
                    event={PH.marketingHomeHeroSecondaryCta}
                    eventProps={{ region, destination: "platform_preview" }}
                    className={MARKETING_SECONDARY_CTA_CLASS}
                    data-testid="button-hero-see-how-it-works"
                  >
                    <span className="whitespace-nowrap">{t("home.landing.ctaSecondary")}</span>
                  </MarketingTrackedLink>
                </div>
                <p
                  className="nn-marketing-caption max-w-2xl text-pretty text-[var(--theme-muted-text)]"
                  data-testid="text-hero-trust-micro"
                >
                  {t("home.landing.heroTrustLine")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <HomePlatformPreviewSection />

        <HomeReviewsSection />

        <HomeStudentsStudyingSection />

        <HomeLandingSections questionCount={questionCount} />

        <div className="mx-auto max-w-6xl px-4 py-6 text-center sm:px-6 lg:px-8">
          <Link
            href={mapLegacyMarketingHref("/languages")}
            className="nn-marketing-body-sm inline-flex items-center gap-2 text-[var(--theme-muted-text)] transition-colors hover:text-[var(--theme-heading-text)]"
            data-testid="link-home-languages"
          >
            <span aria-hidden="true">🌐</span>
            <span>{t("pages.home.availableIn20LanguagesStudy")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
