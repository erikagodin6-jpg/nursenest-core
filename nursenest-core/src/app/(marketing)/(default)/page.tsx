import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import {
  getDegradedPublicHomeStatsFallback,
  getHomepagePublicHomeStats,
} from "@/lib/marketing/public-home-stats";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { ExamSelectorGate } from "@/components/onboarding/exam-selector-gate";
import { MarketingBlogLatestLinks } from "@/components/marketing/marketing-blog-latest-links";
import { loadHomeBlogTeaserPostsSafe } from "@/lib/blog/home-blog-teaser";
import { listPublishedHomeGlobalRegionCardIds } from "@/lib/marketing/published-regional-marketing-urls";
import { renderTrace } from "@/lib/observability/render-trace";
import { withSentryServerSpan } from "@/lib/observability/sentry-route-observability";

/** ISR: homepage shell — aligned with `getCachedPublicHomeStats` / `PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC` (3600). */
export const revalidate = 3600;

const STATIC_LOCALE = DEFAULT_MARKETING_LOCALE;
const STATIC_REGION = "US" as const;
const HOME_FALLBACK_TITLE = defaultHomeMetaTitle(STATIC_REGION);
const HOME_FALLBACK_DESCRIPTION = defaultHomeMetaDescription(STATIC_REGION);
const HOME_FALLBACK_METADATA: Metadata = {
  title: HOME_FALLBACK_TITLE,
  description: HOME_FALLBACK_DESCRIPTION,
  openGraph: {
    title: HOME_FALLBACK_TITLE,
    description: HOME_FALLBACK_DESCRIPTION,
    type: "website",
  },
};

function shouldSkipOptionalMarketingDbReads(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    (process.env.NODE_ENV === "production" && process.env.CI !== "1")
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return withSentryServerSpan(
    {
      name: "marketing.route.metadata.home",
      op: "ui.server.metadata",
      attributes: { route: "/", routeGroup: "marketing.default.home" },
    },
    async () => {
      renderTrace("home metadata start", { route: "/" });
      return safeGenerateMetadata(
        async () => {
          const m = await loadMarketingMessageShards(STATIC_LOCALE, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
          const title = resolveMarketingCopy(m, "pages.home.metaTitleUS", m, defaultHomeMetaTitle(STATIC_REGION));
          const description = resolveMarketingCopy(
            m,
            "pages.home.metaDescriptionUS",
            m,
            defaultHomeMetaDescription(STATIC_REGION),
          );
          const alt = marketingAlternatesSharedPage(STATIC_LOCALE, "/");
          return {
            title,
            description,
            alternates: { canonical: alt.canonical, languages: alt.languages },
            openGraph: {
              title,
              description,
              url: alt.canonical,
              type: "website",
            },
          };
        },
        {
          pathname: "/",
          routeGroup: "marketing.default.home",
          fallbackMetadata: HOME_FALLBACK_METADATA,
        },
      );
    },
  );
}

export default async function HomePage() {
  return withSentryServerSpan(
    {
      name: "marketing.route.render.home",
      op: "ui.server.render",
      attributes: { route: "/", routeGroup: "marketing.default.home" },
    },
    async () => {
      renderTrace("home page start", { route: "/" });
      const skipOptionalDbReads = shouldSkipOptionalMarketingDbReads();
      const [homeStatsRaw, m, publishedGlobalRegionCardIds, blogTeaserPosts] = await Promise.all([
        skipOptionalDbReads
          ? Promise.resolve(getDegradedPublicHomeStatsFallback("production_request_optional_db_skipped"))
          : getHomepagePublicHomeStats(),
        loadMarketingMessageShards(STATIC_LOCALE, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS),
        Promise.resolve(listPublishedHomeGlobalRegionCardIds()),
        skipOptionalDbReads ? Promise.resolve([]) : loadHomeBlogTeaserPostsSafe(3),
      ]);
      renderTrace("home page after data", {
        route: "/",
        degraded: Boolean(homeStatsRaw.degraded),
        blogCount: blogTeaserPosts.length,
        regionCardCount: publishedGlobalRegionCardIds.length,
        optionalDbSkipped: skipOptionalDbReads,
      });
      const homeMarketingStats = {
        questionCount: homeStatsRaw.questionCount,
        registeredLearners: homeStatsRaw.registeredLearners,
        totalLessons: homeStatsRaw.totalLessons,
      };
      const title = resolveMarketingCopy(m, "pages.home.metaTitleUS", m, defaultHomeMetaTitle(STATIC_REGION));
      const description = resolveMarketingCopy(
        m,
        "pages.home.metaDescriptionUS",
        m,
        defaultHomeMetaDescription(STATIC_REGION),
      );
      const { crumbs, schemaItems } = marketingHomeSurfaceBreadcrumbs();
      return (
        <>
          <WebPageJsonLd
            {...buildMarketingWebPageJsonLdProps({
              locale: STATIC_LOCALE,
              enPath: "/",
              title,
              description,
            })}
          />
          <BreadcrumbJsonLd items={schemaItems} />
          <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />
          {crumbs.length > 0 ? (
            <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
              <BreadcrumbTrail items={crumbs} />
            </div>
          ) : null}
          <HomeRestoredClient
            homeMarketingStats={homeMarketingStats}
            publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
          />
          <section className="mx-auto mt-6 w-full max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
            <div className="nn-card border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
                    {resolveMarketingCopy(m, "pages.home.blogTeaser.title", undefined, "")}
                  </h2>
                  <p className="mt-1 max-w-prose text-sm text-[var(--theme-muted-text)]">
                    {resolveMarketingCopy(m, "pages.home.blogTeaser.subtitle", undefined, "")}
                  </p>
                </div>
                <Link href="/blog" className="shrink-0 text-sm font-semibold text-primary hover:underline">
                  {resolveMarketingCopy(m, "pages.home.blogTeaser.viewAll", undefined, "")}
                </Link>
              </div>
              <MarketingBlogLatestLinks
                take={3}
                posts={blogTeaserPosts}
                className="mt-4 border-t border-[var(--border-subtle)] pt-4"
                heading={resolveMarketingCopy(m, "pages.home.blogTeaser.latestHeading", undefined, "")}
              />
            </div>
          </section>
          <ExamSelectorGate />
        </>
      );
    },
  );
}
