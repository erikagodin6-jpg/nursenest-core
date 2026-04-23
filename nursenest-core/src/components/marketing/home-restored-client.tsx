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
 * Desktop-only chunks (skipped on narrow marketing — see `home-marketing-home-desktop-below-fold.tsx`).
 * Split so trust strip stays between regions and trust-fears in the DOM order.
 */
const HomeMarketingDesktopRegionsStackLazy = dynamic(
  () =>
    import("@/components/marketing/home-marketing-home-desktop-below-fold").then((m) => m.HomeMarketingDesktopRegionsStack),
  {
    ssr: false,
    loading: () => (
      <>
        <HomeMobileHeavyLoadingReserve minHeight="min(42vw, 18rem)" />
        <HomeMobileHeavyLoadingReserve minHeight="18rem" />
        <HomeMobileHeavyLoadingReserve minHeight="16rem" />
        <HomeMobileHeavyLoadingReserve minHeight="20rem" />
      </>
    ),
  },
);

const HomeMarketingDesktopPostTrustStackLazy = dynamic(
  () =>
    import("@/components/marketing/home-marketing-home-desktop-below-fold").then((m) => m.HomeMarketingDesktopPostTrustStack),
  {
    ssr: false,
    loading: () => (
      <>
        <HomeMobileHeavyLoadingReserve minHeight="14rem" />
        <HomeMobileHeavyLoadingReserve minHeight="22rem" />
        <HomeMobileHeavyLoadingReserve minHeight="18rem" />
        <HomeMobileHeavyLoadingReserve minHeight="16rem" />
      </>
    ),
  },
);

function HomeMobileHeavyLoadingReserve({ minHeight }: { minHeight: string }) {
  return (
    <div
      className="border-b border-[var(--header-nav-border)] bg-[var(--page-bg)] px-4 py-[var(--nn-rhythm-mobile-section-y)] sm:px-6 md:py-[var(--nn-rhythm-shell-y)]"
      aria-hidden
    >
      <div
        className="mx-auto max-w-5xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--semantic-panel-muted)]"
        style={{ minHeight }}
      />
    </div>
  );
}

/** Static shell on mobile: reserves vertical space without running heavy section JS. */
function HomeMobileHeavyStaticReserve({ minHeight }: { minHeight: string }) {
  return (
    <div
      className="border-b border-[var(--border-subtle)] bg-[var(--page-bg)] px-4 py-[var(--nn-rhythm-mobile-section-y)] sm:px-6"
      aria-hidden
    >
      <div
        className="mx-auto max-w-5xl rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,transparent)]"
        style={{ minHeight }}
      />
    </div>
  );
}

export type HomeRestoredClientProps = {
  homeMarketingStats: HomeMarketingStats;
  /** Homepage global region cards — must exclude unpublished expansion exam hubs. */
  publishedGlobalRegionCardIds: readonly string[];
  /** Global hub strip — rendered after proof blocks, before pathway cards; server slot from `page.tsx`. */
  introAfterHero?: ReactNode;
};

/**
 * Homepage flow: hero → product carousel → how it works (value) → proof stack (sample, regions, trust)
 * → platform preview + differentiation → hub strip → pathways → objection FAQ → final CTA.
 *
 * Below-the-fold heavy sections live in `home-marketing-home-desktop-below-fold.tsx` behind one
 * `next/dynamic` so narrow marketing viewports skip the entire chunk. Narrow detection is driven by
 * {@link MarketingMobileMotionShell} (Edge UA / CH hint + client `matchMedia`), not a standalone
 * `useIsMobile` flip on first paint.
 */
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

  const questionCount = homeMarketingStats.questionCount;
  const registeredLearners = homeMarketingStats.registeredLearners;
  const lessonCount = homeMarketingStats.totalLessons;

  const audienceBalanceCards = useMemo(() => {
    const l = (path: string) => withMarketingLocale(locale, path);
    const hubs = publicExamPrepHubDestinations(region);
    return [
      {
        id: "rn",
        title: t("pages.home.audience.rn.title"),
        body: t("pages.home.audience.rn.description"),
        cta: t("pages.home.audience.rn.cta"),
        href: l(hubs.rn),
        accentColor: "var(--semantic-info)",
      },
      {
        id: "pn",
        title: t("pages.home.audience.pn.title"),
        body: t("pages.home.audience.pn.description"),
        cta: t("pages.home.audience.pn.cta"),
        href: l(hubs.pn),
        accentColor: "var(--semantic-warning)",
      },
      {
        id: "np",
        title: t("pages.home.audience.np.title"),
        body: t("pages.home.audience.np.description"),
        cta: t("pages.home.audience.np.cta"),
        href: l(hubs.np),
        accentColor: "var(--semantic-brand)",
      },
      {
        id: "allied",
        title: t("pages.home.audience.allied.title"),
        body: t("pages.home.audience.allied.description"),
        cta: t("pages.home.audience.allied.cta"),
        href: l(hubs.allied),
        accentColor: "var(--semantic-success)",
      },
    ];
  }, [locale, region, t]);

  return (
    <div
      className={
        marketingNarrow
          ? "font-sans flex w-full min-h-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)]"
          : "font-sans md:animate-page-enter flex w-full min-h-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)]"
      }
    >
      <FunnelHomepageViewBeacon marketingRegion={marketingRegion} marketingLocale={locale} />
      <div className="min-h-0 flex-1 overflow-x-hidden">
        {/* 1. HERO */}
        <HomeConversionHero questionCount={questionCount} lessonCount={lessonCount} />
        {/* 2. Product carousel — desktop client chunk; mobile static reserve */}
        {marketingNarrow ? (
          <>
            <HomeMobileHeavyStaticReserve minHeight="min(42vw, 18rem)" />
            <HomeMobileHeavyStaticReserve minHeight="18rem" />
            <HomeMobileHeavyStaticReserve minHeight="16rem" />
            <HomeMobileHeavyStaticReserve minHeight="20rem" />
          </>
        ) : (
          <HomeMarketingDesktopRegionsStackLazy publishedGlobalRegionCardIds={publishedGlobalRegionCardIds} />
        )}
        {/* 6. Trust strip — lighter; keep synced for both */}
        <HomeTrustStripSection
          lessonCount={lessonCount}
          questionCount={questionCount}
          registeredLearners={registeredLearners}
        />
        {/* 7–10. Trust fears → platform → proof → FAQ (desktop lazy) */}
        {marketingNarrow ? (
          <>
            <HomeMobileHeavyStaticReserve minHeight="14rem" />
            <HomeMobileHeavyStaticReserve minHeight="22rem" />
            <HomeMobileHeavyStaticReserve minHeight="18rem" />
          </>
        ) : (
          <HomeMarketingDesktopPostTrustStackLazy
            questionCount={questionCount}
            registeredLearners={registeredLearners}
          />
        )}
        {/* 9. Global hub strip */}
        {introAfterHero}
        {/* 10. Pathways — RN / PN / NP / Allied */}
        <section
          className={`nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--page-bg)]${marketingNarrow ? " simple-stack" : ""}`}
          aria-label={t("pages.home.audienceBalance.ariaLabel")}
          data-testid="section-home-audience-balance"
        >
          {marketingNarrow ? (
            <div className="nn-section-shell flex flex-col gap-6">
              <div className="space-y-2 text-center">
                <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  {formatSentenceCase(t("pages.home.pathwaysSection.kicker"), locale)}
                </p>
                <h2 className="nn-marketing-h2 text-balance text-[var(--theme-heading-text)]">
                  {formatTitleCase(t("pages.home.pathwaysSection.title"), locale)}
                </h2>
                <p className="nn-marketing-body text-pretty leading-relaxed text-[var(--semantic-text-muted)]">
                  {formatSentenceCase(t("pages.home.pathwaysSection.lead"), locale)}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {audienceBalanceCards.map((c) => (
                  <MarketingTrackedLink
                    key={c.id}
                    href={c.href}
                    event={PH.marketingHomeExploreHubClick}
                    eventProps={{ placement: "audience_balance", pathway: c.id, region }}
                    data-nn-marketing-region={region === "US" ? "US" : "CA"}
                    data-nn-exam-card-id={`audience-${c.id}`}
                    className="nn-card-system nn-card-system-pad nn-card-system--interactive group relative flex min-h-0 flex-col overflow-hidden"
                    style={{
                      borderTopColor: `color-mix(in srgb, ${c.accentColor} 70%, var(--border-subtle))`,
                      borderTopWidth: "3px",
                    }}
                  >
                    <span className="nn-card-system__title">{c.title}</span>
                    <span className="nn-card-system__description">{c.body}</span>
                    <span className="nn-card-system__cta mt-auto">
                      {c.cta}
                      <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" aria-hidden />
                    </span>
                  </MarketingTrackedLink>
                ))}
              </div>
            </div>
          ) : (
            <div className="nn-section-shell">
              <div className="mx-auto mb-8 max-w-2xl text-center md:mb-9">
                <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  {formatSentenceCase(t("pages.home.pathwaysSection.kicker"), locale)}
                </p>
                <h2 className="nn-marketing-h2 mt-2 text-balance text-[var(--theme-heading-text)]">
                  {formatTitleCase(t("pages.home.pathwaysSection.title"), locale)}
                </h2>
                <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-[var(--semantic-text-muted)]">
                  {formatSentenceCase(t("pages.home.pathwaysSection.lead"), locale)}
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {audienceBalanceCards.map((c) => (
                  <MarketingTrackedLink
                    key={c.id}
                    href={c.href}
                    event={PH.marketingHomeExploreHubClick}
                    eventProps={{ placement: "audience_balance", pathway: c.id, region }}
                    data-nn-marketing-region={region === "US" ? "US" : "CA"}
                    data-nn-exam-card-id={`audience-${c.id}`}
                    className="nn-card-system nn-card-system-pad nn-card-system--interactive nn-student-card-lift group relative flex h-full min-h-[14rem] flex-col overflow-hidden"
                    style={{
                      borderTopColor: `color-mix(in srgb, ${c.accentColor} 70%, var(--border-subtle))`,
                      borderTopWidth: "3px",
                    }}
                  >
                    <span className="nn-card-system__title">{c.title}</span>
                    <span className="nn-card-system__description">{c.body}</span>
                    <span className="nn-card-system__cta mt-auto">
                      {c.cta}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                    </span>
                  </MarketingTrackedLink>
                ))}
              </div>
            </div>
          )}
        </section>
        {/* 11. Objection FAQ — inside desktop post-trust lazy; mobile static reserve */}
        {marketingNarrow ? <HomeMobileHeavyStaticReserve minHeight="16rem" /> : null}
        {/* 12. Final CTA */}
        <HomeFinalStudyCta />
      </div>
    </div>
  );
}
