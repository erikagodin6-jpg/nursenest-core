import type { Metadata } from "next";
import { Suspense } from "react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { HomeRestoredWithDeferredStats } from "@/components/marketing/home-restored-with-deferred-stats.server";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { resolveMarketingCopy, type MarketingMessages } from "@/lib/marketing-i18n-core";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { ExamSelectorGateLazy } from "@/components/onboarding/exam-selector-gate-lazy";
import {
  HomeBlogTeaserSectionAsync,
  HomeBlogTeaserSectionShell,
} from "@/components/marketing/home-blog-teaser-section.server";
import { listPublishedHomeGlobalRegionCardIds } from "@/lib/marketing/published-regional-marketing-urls";
import { homePerfFinalForGetRoot, homePerfLogForGetRoot } from "@/lib/observability/home-perf-trace";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";

const homeMarketingSentryRuntimePromise = import("@/lib/observability/sentry-runtime");

/** ISR: homepage shell — aligned with `getCachedPublicHomeStats` / `PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC` (3600). */
export const revalidate = 3600;

const STATIC_LOCALE = DEFAULT_MARKETING_LOCALE;
const STATIC_REGION = "US" as const;
const MARKETING_BUILD_PHASE = "phase-production-build";
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

/**
 * Optional DB/blog reads on `/` — default unchanged when unset.
 * Set `MARKETING_HOME_SKIP_OPTIONAL_DB=true` or `false` to override explicitly.
 */
function shouldSkipOptionalMarketingDbReads(): boolean {
  const raw = process.env.MARKETING_HOME_SKIP_OPTIONAL_DB?.trim().toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return (
    process.env.NEXT_PHASE === MARKETING_BUILD_PHASE ||
    (process.env.NODE_ENV === "production" && process.env.CI !== "1")
  );
}

/**
 * `pages.*` only for server-rendered home surfaces (metadata, JSON-LD, blog shell).
 * Layout supplies chrome shards; `MarketingMainI18nShards` under `<main>` merges the same
 * `pages` shard for the client tree (shared async + merged JSON cache).
 */
async function loadHomePageMarketingMessagesForRequest(): Promise<MarketingMessages> {
  return loadMarketingMessageShards(STATIC_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
}

export async function generateMetadata(): Promise<Metadata> {
  const { withSentryRuntimeSpan } = await homeMarketingSentryRuntimePromise;
  return withSentryRuntimeSpan(
    {
      name: "marketing.route.metadata.home",
      op: "ui.server.metadata",
      attributes: { route: "/", routeGroup: "marketing.default.home" },
    },
    async () => {
      layoutStderrTrace("marketing_home", "home metadata start", { route: "/" });
      return safeGenerateMetadata(
        async () => {
          const m = await loadHomePageMarketingMessagesForRequest();
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
  const { withSentryRuntimeSpan } = await homeMarketingSentryRuntimePromise;
  return withSentryRuntimeSpan(
    {
      name: "marketing.route.render.home",
      op: "ui.server.render",
      attributes: { route: "/", routeGroup: "marketing.default.home" },
    },
    async () => {
      const perfPageT0 = Date.now();
      try {
        layoutStderrTrace("marketing_home", "home page start", { route: "/" });
        const skipOptionalDbReads = shouldSkipOptionalMarketingDbReads();
        const [m, publishedGlobalRegionCardIds] = await Promise.all([
          loadHomePageMarketingMessagesForRequest().then(async (resolved) => {
            await homePerfLogForGetRoot("home.server.after_homepage_page_body_messages", perfPageT0, {
              message_key_count: Object.keys(resolved).length,
            });
            return resolved;
          }),
          (async () => {
            const ids = await Promise.resolve(listPublishedHomeGlobalRegionCardIds());
            await homePerfLogForGetRoot("home.server.after_region_ids", perfPageT0, {
              region_card_count: ids.length,
            });
            return ids;
          })(),
        ]);
        layoutStderrTrace("marketing_home", "home page after shell data", {
          route: "/",
          stats: skipOptionalDbReads ? "sync_optional_db_skipped" : "deferred",
          regionCardCount: publishedGlobalRegionCardIds.length,
          optionalDbSkipped: skipOptionalDbReads,
        });
        const title = resolveMarketingCopy(m, "pages.home.metaTitleUS", m, defaultHomeMetaTitle(STATIC_REGION));
        const description = resolveMarketingCopy(
          m,
          "pages.home.metaDescriptionUS",
          m,
          defaultHomeMetaDescription(STATIC_REGION),
        );
        const { crumbs, schemaItems } = marketingHomeSurfaceBreadcrumbs();
        await homePerfLogForGetRoot("home.server.before_shell_return", perfPageT0, {
          optional_db_skipped: skipOptionalDbReads,
        });
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
            <HomeRestoredWithDeferredStats
              skipOptionalDbReads={skipOptionalDbReads}
              publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
            />
            {skipOptionalDbReads ? (
              <HomeBlogTeaserSectionShell m={m} posts={[]} />
            ) : (
              <Suspense fallback={<HomeBlogTeaserSectionShell m={m} posts={[]} />}>
                <HomeBlogTeaserSectionAsync m={m} />
              </Suspense>
            )}
            <ExamSelectorGateLazy />
          </>
        );
      } catch (e) {
        await homePerfFinalForGetRoot("failure", { error_phase: "page" });
        throw e;
      }
    },
  );
}
