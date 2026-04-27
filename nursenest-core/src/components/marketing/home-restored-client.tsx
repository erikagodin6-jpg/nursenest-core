"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, type ReactNode } from "react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { HomeConversionHero } from "@/components/marketing/home-conversion-hero";
import { HomeHeroScreenshotSection } from "@/components/marketing/home-hero-screenshot-section";
import { HomeTrustStripSection } from "@/components/marketing/home-trust-strip-section";
import { HomeFinalStudyCta } from "@/components/marketing/home-final-study-cta";
import { FunnelHomepageViewBeacon } from "@/components/marketing/funnel-analytics-beacons";

import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

import { marketingExamHubPath } from "@/lib/marketing/marketing-exam-navigation";
import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

import { PH } from "@/lib/observability/posthog-conversion-events";

import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";

/**
 * Normalize numbers from server (prevents crashes + hydration issues)
 */
function safeNumber(n: unknown): number {
  return Number.isFinite(n) ? Number(n) : 0;
}

/**
 * Lightweight stand-ins for former client-only desktop slices (carousel,
 * screenshot bands, next/image marketing rows). Same markup on all viewports.
 */
function HomeStableMarketingPlaceholder({
  title,
  body,
  href,
  linkLabel,
  bandToneClass = "nn-home-rich-placeholder-band--tone-cool",
}: {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  /** Token-only section wash (see `globals.css`). */
  bandToneClass?: "nn-home-rich-placeholder-band--tone-cool" | "nn-home-rich-placeholder-band--tone-warm" | "nn-home-rich-placeholder-band--tone-positive";
}) {
  return (
    <section
      className={`nn-home-rich-placeholder-band ${bandToneClass} border-b border-[var(--border-subtle)] px-4 py-[var(--nn-rhythm-mobile-section-y)] sm:px-6 md:py-[var(--nn-rhythm-shell-y)]`}
    >
      <div className="nn-home-rich-placeholder-card mx-auto max-w-5xl rounded-2xl border p-6 sm:p-8">
        <h2 className="nn-marketing-h3 text-balance text-[var(--palette-heading)]">{title}</h2>
        <p className="mt-2 max-w-prose text-pretty nn-marketing-body text-[var(--palette-text-muted)]">{body}</p>
        <p className="mt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
          >
            {linkLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </div>
    </section>
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
  publishedGlobalRegionCardIds: _publishedGlobalRegionCardIds,
  introAfterHero,
}: HomeRestoredClientProps) {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const marketingRegion = region === "US" ? "US" : "CA";
  const exploreQuestionsHref = withMarketingLocale(locale, "/question-bank");
  const explorePricingHref = withMarketingLocale(locale, "/pricing");

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      /* ignore — rare sandboxed / embedded browsers */
    }
  }, []);

  /* -------- SAFE STATS -------- */

  const questionCount = safeNumber(homeMarketingStats?.questionCount);
  const registeredLearners = safeNumber(homeMarketingStats?.registeredLearners);
  const lessonCount = safeNumber(homeMarketingStats?.totalLessons);

  /* -------- AUDIENCE CARDS -------- */

  const audienceCards = useMemo(() => {
    const l = (p: string) => withMarketingLocale(locale, p);
    let hubs = {
      rn: marketingExamHubPath(region, "rn"),
      pn: marketingExamHubPath(region, "pn"),
      np: marketingExamHubPath(region, "np"),
      allied: marketingExamHubPath(region, "allied"),
    };
    try {
      hubs = { ...hubs, ...publicExamPrepHubDestinations(region) };
    } catch {
      /* keep marketingExamHubPath fallbacks */
    }

    return [
      {
        id: "rn",
        title: safeHomepageMarketingT(t, "pages.home.audience.rn.title", "RN"),
        body: safeHomepageMarketingT(t, "pages.home.audience.rn.description", ""),
        cta: safeHomepageMarketingT(t, "pages.home.audience.rn.cta", "Explore"),
        href: l(hubs.rn),
        color: "var(--semantic-info)",
      },
      {
        id: "pn",
        title: safeHomepageMarketingT(t, "pages.home.audience.pn.title", "PN"),
        body: safeHomepageMarketingT(t, "pages.home.audience.pn.description", ""),
        cta: safeHomepageMarketingT(t, "pages.home.audience.pn.cta", "Explore"),
        href: l(hubs.pn),
        color: "var(--semantic-warning)",
      },
      {
        id: "np",
        title: safeHomepageMarketingT(t, "pages.home.audience.np.title", "NP"),
        body: safeHomepageMarketingT(t, "pages.home.audience.np.description", ""),
        cta: safeHomepageMarketingT(t, "pages.home.audience.np.cta", "Explore"),
        href: l(hubs.np),
        color: "var(--semantic-brand)",
      },
      {
        id: "allied",
        title: safeHomepageMarketingT(t, "pages.home.audience.allied.title", "Allied"),
        body: safeHomepageMarketingT(t, "pages.home.audience.allied.description", ""),
        cta: safeHomepageMarketingT(t, "pages.home.audience.allied.cta", "Explore"),
        href: l(hubs.allied),
        color: "var(--semantic-success)",
      },
    ];
  }, [locale, region, t]);

  /* ------------------ RENDER ------------------ */

  return (
    <div className="font-sans flex w-full min-h-0 flex-1 flex-col overflow-x-hidden bg-[var(--page-bg)] nn-home-marketing-root">
      <FunnelHomepageViewBeacon
        marketingRegion={marketingRegion}
        marketingLocale={locale}
      />

      {/* HERO */}
      <HomeConversionHero
        questionCount={questionCount}
        lessonCount={lessonCount}
      />

      <HomeHeroScreenshotSection />

      <HomeStableMarketingPlaceholder
        bandToneClass="nn-home-rich-placeholder-band--tone-warm"
        title={safeHomepageMarketingT(t, "pages.home.stablePlaceholder.regions.title", "Exam prep hubs")}
        body={safeHomepageMarketingT(
          t,
          "pages.home.stablePlaceholder.regions.body",
          "Choose RN, PN, NP, or Allied from the pathway cards below — regional hubs stay one click away.",
        )}
        href={explorePricingHref}
        linkLabel={safeHomepageMarketingT(t, "pages.home.stablePlaceholder.regions.link", "View pricing")}
      />

      {/* TRUST */}
      <HomeTrustStripSection
        lessonCount={lessonCount}
        questionCount={questionCount}
        registeredLearners={registeredLearners}
      />

      {/* Former trust-fears / platform preview / proof / FAQ lazy stack */}
      <HomeStableMarketingPlaceholder
        bandToneClass="nn-home-rich-placeholder-band--tone-positive"
        title={safeHomepageMarketingT(t, "pages.home.stablePlaceholder.study.title", "Study tools that stay exam-scoped")}
        body={safeHomepageMarketingT(
          t,
          "pages.home.stablePlaceholder.study.body",
          "CAT-style practice, rationales, and lessons are available after you sign in — this page keeps the shell lightweight.",
        )}
        href={exploreQuestionsHref}
        linkLabel={safeHomepageMarketingT(t, "pages.home.stablePlaceholder.study.link", "Start practicing")}
      />
      <HomeStableMarketingPlaceholder
        bandToneClass="nn-home-rich-placeholder-band--tone-cool"
        title={safeHomepageMarketingT(t, "pages.home.stablePlaceholder.support.title", "Questions about access or billing?")}
        body={safeHomepageMarketingT(
          t,
          "pages.home.stablePlaceholder.support.body",
          "Pricing and plans are documented on the pricing page so you can compare tiers without loading large previews here.",
        )}
        href={explorePricingHref}
        linkLabel={safeHomepageMarketingT(t, "pages.home.stablePlaceholder.support.link", "Compare plans")}
      />

      {/* HUB STRIP */}
      {introAfterHero}

      {/* AUDIENCE CARDS */}
      <section className="nn-section-block nn-home-pathways-band border-b border-[var(--border-subtle)]">
        <div className="nn-section-shell">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="nn-marketing-h2">
              {formatTitleCase(
                safeHomepageMarketingT(t, "pages.home.pathwaysSection.title", "Choose your path"),
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
                data-nn-home-tier-card={c.id}
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