"use client";

import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, type ReactNode } from "react";

import { useMarketingMobilePerfIsMobile } from "@/lib/ui/marketing-mobile-perf-context";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { HomeConversionHero } from "@/components/marketing/home-conversion-hero";
import { HomeTrustStripSection } from "@/components/marketing/home-trust-strip-section";
import { HomeFinalStudyCta } from "@/components/marketing/home-final-study-cta";
import { FunnelHomepageViewBeacon } from "@/components/marketing/funnel-analytics-beacons";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

import { PH } from "@/lib/observability/posthog-conversion-events";

import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";

/**
 * Safe translation wrapper
 */
function safeT(t: (k: string) => string, key: string, fallback: string) {
  try {
    const val = t(key);
    return val && val !== key ? val : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Normalize numbers from server (prevents crashes + hydration issues)
 */
function safeNumber(n: unknown): number {
  return Number.isFinite(n) ? Number(n) : 0;
}

/* ------------------ DYNAMIC CHUNKS ------------------ */

const HomeMarketingDesktopRegionsStackLazy = dynamic(
  () =>
    import("@/components/marketing/home-marketing-home-desktop-below-fold")
      .then((m) => m.HomeMarketingDesktopRegionsStack),
  { ssr: false },
);

const HomeMarketingDesktopPostTrustStackLazy = dynamic(
  () =>
    import("@/components/marketing/home-marketing-home-desktop-below-fold")
      .then((m) => m.HomeMarketingDesktopPostTrustStack),
  { ssr: false },
);

/* ------------------ STATIC RESERVES ------------------ */

function Reserve({ h }: { h: string }) {
  return (
    <div
      className="border-b border-[var(--border-subtle)] bg-[var(--page-bg)] px-4 py-[var(--nn-rhythm-mobile-section-y)]"
      aria-hidden="true"
    >
      <div
        className="mx-auto max-w-5xl rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,transparent)]"
        style={{ minHeight: h }}
      />
    </div>
  );
}

/* ------------------ TYPES ------------------ */

export type HomeRestoredClientProps = {
  homeMarketingStats?: HomeMarketingStats | null;
  publishedGlobalRegionCardIds?: readonly string[] | null;
  introAfterHero?: ReactNode;
};

/* ------------------ COMPONENT ------------------ */

export default function HomeRestoredClient({
  homeMarketingStats,
  publishedGlobalRegionCardIds,
  introAfterHero,
}: HomeRestoredClientProps) {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const marketingRegion = region === "US" ? "US" : "CA";
  const marketingNarrow = useMarketingMobilePerfIsMobile() === true;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* -------- SAFE STATS -------- */

  const questionCount = safeNumber(homeMarketingStats?.questionCount);
  const registeredLearners = safeNumber(homeMarketingStats?.registeredLearners);
  const lessonCount = safeNumber(homeMarketingStats?.totalLessons);

  /* -------- AUDIENCE CARDS -------- */

  const audienceCards = useMemo(() => {
    const l = (p: string) => withMarketingLocale(locale, p);
    const hubs = publicExamPrepHubDestinations(region);

    return [
      {
        id: "rn",
        title: safeT(t, "pages.home.audience.rn.title", "RN"),
        body: safeT(t, "pages.home.audience.rn.description", ""),
        cta: safeT(t, "pages.home.audience.rn.cta", "Explore"),
        href: l(hubs.rn),
        color: "var(--semantic-info)",
      },
      {
        id: "pn",
        title: safeT(t, "pages.home.audience.pn.title", "PN"),
        body: safeT(t, "pages.home.audience.pn.description", ""),
        cta: safeT(t, "pages.home.audience.pn.cta", "Explore"),
        href: l(hubs.pn),
        color: "var(--semantic-warning)",
      },
      {
        id: "np",
        title: safeT(t, "pages.home.audience.np.title", "NP"),
        body: safeT(t, "pages.home.audience.np.description", ""),
        cta: safeT(t, "pages.home.audience.np.cta", "Explore"),
        href: l(hubs.np),
        color: "var(--semantic-brand)",
      },
      {
        id: "allied",
        title: safeT(t, "pages.home.audience.allied.title", "Allied"),
        body: safeT(t, "pages.home.audience.allied.description", ""),
        cta: safeT(t, "pages.home.audience.allied.cta", "Explore"),
        href: l(hubs.allied),
        color: "var(--semantic-success)",
      },
    ];
  }, [locale, region, t]);

  /* ------------------ RENDER ------------------ */

  return (
    <div className="font-sans flex w-full min-h-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)]">
      <FunnelHomepageViewBeacon
        marketingRegion={marketingRegion}
        marketingLocale={locale}
      />

      {/* HERO */}
      <HomeConversionHero
        questionCount={questionCount}
        lessonCount={lessonCount}
      />

      {/* ABOVE FOLD STACK */}
      {marketingNarrow ? (
        <>
          <Reserve h="18rem" />
          <Reserve h="18rem" />
          <Reserve h="16rem" />
        </>
      ) : (
        <HomeMarketingDesktopRegionsStackLazy
          publishedGlobalRegionCardIds={
            publishedGlobalRegionCardIds ?? []
          }
        />
      )}

      {/* TRUST */}
      <HomeTrustStripSection
        lessonCount={lessonCount}
        questionCount={questionCount}
        registeredLearners={registeredLearners}
      />

      {/* BELOW FOLD STACK */}
      {marketingNarrow ? (
        <>
          <Reserve h="14rem" />
          <Reserve h="20rem" />
        </>
      ) : (
        <HomeMarketingDesktopPostTrustStackLazy
          questionCount={questionCount}
          registeredLearners={registeredLearners}
        />
      )}

      {/* HUB STRIP */}
      {introAfterHero}

      {/* AUDIENCE CARDS */}
      <section className="nn-section-block border-b border-[var(--border-subtle)] bg-[var(--page-bg)]">
        <div className="nn-section-shell">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="nn-marketing-h2">
              {formatTitleCase(
                safeT(t, "pages.home.pathwaysSection.title", "Choose your path"),
                locale
              )}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audienceCards.map((c) => (
              <MarketingTrackedLink
                key={c.id}
                href={c.href}
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ pathway: c.id, region }}
                className="nn-card-system nn-card-system-pad nn-card-system--interactive group flex flex-col"
                style={{ borderTop: `3px solid ${c.color}` }}
              >
                <span className="nn-card-system__title">
                  {c.title}
                </span>
                <span className="nn-card-system__description">
                  {c.body}
                </span>
                <span className="nn-card-system__cta mt-auto">
                  {c.cta}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              </MarketingTrackedLink>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <HomeFinalStudyCta />
    </div>
  );
}