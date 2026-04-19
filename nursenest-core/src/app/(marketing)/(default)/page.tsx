import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { HomeRestoredWithDeferredStats } from "@/components/marketing/home-restored-with-deferred-stats.server";
import { MarketingHomeEmergencyFallback } from "@/components/marketing/marketing-home-emergency-fallback";
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
import { safeAwait } from "@/lib/async/safe-await";
import { emitNnHomePerfDiagLine, isNnTraceHomePerfTrue } from "@/lib/observability/home-perf-diag";
import { homePerfFinalForGetRoot, homePerfLogForGetRoot } from "@/lib/observability/home-perf-trace";
import {
  emitNnHomeRouteDiag,
  nnHomeDiagNowMs,
  nnHomeStaticProbeEnabled,
} from "@/lib/observability/nn-home-isolation-flags";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";

const homeMarketingSentryRuntimePromise = import("@/lib/observability/sentry-runtime");

const HOME_PAGE_BODY_I18N_BUDGET_MS = 2800;
/** Must exceed `MARKETING_SHARD_ASYNC_FACTORY_BUDGET_MS` in `load-marketing-message-shards.ts` (2500). */
const HOME_METADATA_I18N_BUDGET_MS = 2600;
/** If `import("@/lib/observability/sentry-runtime")` never settles, `/` render/metadata must still complete. */
const HOME_SENTRY_RUNTIME_BUDGET_MS = 2000;

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

async function loadHomePageMarketingMessagesForRequest(): Promise<MarketingMessages> {
  return loadMarketingMessageShards(STATIC_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
}

/** Bounded, fail-open homepage body shards (never throws). */
async function loadHomePageMarketingMessagesSafe(budgetMs: number, label: string): Promise<MarketingMessages> {
  try {
    const m = await safeAwait(loadHomePageMarketingMessagesForRequest(), label, budgetMs);
    return m ?? {};
  } catch {
    return {};
  }
}

function listPublishedHomeGlobalRegionCardIdsSafe(): readonly string[] {
  try {
    return listPublishedHomeGlobalRegionCardIds();
  } catch {
    return ["us", "ca"] as const;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const tDiag = nnHomeDiagNowMs();
  if (nnHomeStaticProbeEnabled()) {
    emitNnHomeRouteDiag({ segment: "metadata_static_probe_short_circuit", elapsed_ms: nnHomeDiagNowMs() - tDiag });
    return HOME_FALLBACK_METADATA;
  }
  emitNnHomeRouteDiag({ segment: "metadata_fn_enter", elapsed_ms: 0 });
  const runtime = await safeAwait(
    homeMarketingSentryRuntimePromise,
    "marketing_home.metadata.sentry_import",
    HOME_SENTRY_RUNTIME_BUDGET_MS,
  );
  emitNnHomeRouteDiag({ segment: "metadata_after_sentry_import", elapsed_ms: nnHomeDiagNowMs() - tDiag });

  const runMetadataInner = async (): Promise<Metadata> => {
    emitNnHomeRouteDiag({ segment: "metadata_span_inner_start", elapsed_ms: nnHomeDiagNowMs() - tDiag });
    layoutStderrTrace("marketing_home", "home metadata start", { route: "/" });
    const meta = await safeGenerateMetadata(
      async () => {
        emitNnHomeRouteDiag({ segment: "metadata_shard_load_start", elapsed_ms: nnHomeDiagNowMs() - tDiag });
        const m = await loadHomePageMarketingMessagesSafe(HOME_METADATA_I18N_BUDGET_MS, "marketing_home.metadata");
        emitNnHomeRouteDiag({
          segment: "metadata_shard_load_done",
          elapsed_ms: nnHomeDiagNowMs() - tDiag,
          message_key_count: Object.keys(m).length,
        });
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
    emitNnHomeRouteDiag({ segment: "metadata_span_inner_done", elapsed_ms: nnHomeDiagNowMs() - tDiag });
    return meta;
  };

  if (runtime?.withSentryRuntimeSpan) {
    return runtime.withSentryRuntimeSpan(
      {
        name: "marketing.route.metadata.home",
        op: "ui.server.metadata",
        attributes: { route: "/", routeGroup: "marketing.default.home" },
      },
      runMetadataInner,
    );
  }
  return runMetadataInner();
}

export default async function HomePage() {
  const tDiag = nnHomeDiagNowMs();
  emitNnHomeRouteDiag({ segment: "page_fn_enter", elapsed_ms: 0 });

  if (nnHomeStaticProbeEnabled()) {
    emitNnHomeRouteDiag({ segment: "page_static_probe_short_circuit", elapsed_ms: nnHomeDiagNowMs() - tDiag });
    return (
      <div data-nn-home-static-probe="1" className="p-6">
        <p>NN_HOME_STATIC_PROBE</p>
      </div>
    );
  }

  const runtime = await safeAwait(
    homeMarketingSentryRuntimePromise,
    "marketing_home.page.sentry_import",
    HOME_SENTRY_RUNTIME_BUDGET_MS,
  );
  emitNnHomeRouteDiag({ segment: "page_after_sentry_import", elapsed_ms: nnHomeDiagNowMs() - tDiag });

  const renderHomePage = async () => {
      const perfPageT0 = nnHomeDiagNowMs();
      emitNnHomeRouteDiag({ segment: "page_span_inner_start", elapsed_ms: nnHomeDiagNowMs() - tDiag });
      let pathnameProbe = "";
      let methodProbe = "";
      try {
        const h = await headers();
        pathnameProbe = h.get("x-nn-request-pathname")?.trim() ?? "";
        methodProbe = h.get("x-nn-request-method")?.trim() ?? "";
      } catch {
        pathnameProbe = "(headers_unavailable)";
        methodProbe = "(headers_unavailable)";
      }
      if (isNnTraceHomePerfTrue()) {
        emitNnHomePerfDiagLine({
          tag: "nn_home_perf_fallback_probe",
          pid: process.pid,
          pathname: pathnameProbe,
          request_method: methodProbe || "(method_header_empty)",
          trace_literal_true: true,
        });
      }
      try {
        void homePerfLogForGetRoot("home.server.03_page_render_start", perfPageT0).catch(() => {});
        emitNnHomeRouteDiag({ segment: "page_try_enter", elapsed_ms: nnHomeDiagNowMs() - tDiag });
        layoutStderrTrace("marketing_home", "home page start", { route: "/" });
        const skipOptionalDbReads = shouldSkipOptionalMarketingDbReads();

        emitNnHomeRouteDiag({ segment: "page_parallel_load_start", elapsed_ms: nnHomeDiagNowMs() - tDiag });
        const [m, publishedGlobalRegionCardIds] = await Promise.all([
          loadHomePageMarketingMessagesSafe(HOME_PAGE_BODY_I18N_BUDGET_MS, "marketing_home.page_body").then(
            (resolved) => {
              void homePerfLogForGetRoot("home.server.04_after_homepage_messages", perfPageT0, {
                message_key_count: Object.keys(resolved).length,
              }).catch(() => {});
              return resolved;
            },
          ),
          Promise.resolve().then(() => {
            const ids = listPublishedHomeGlobalRegionCardIdsSafe();
            void homePerfLogForGetRoot("home.server.05_after_region_ids", perfPageT0, {
              region_card_count: ids.length,
            }).catch(() => {});
            return ids;
          }),
        ]);
        emitNnHomeRouteDiag({
          segment: "page_parallel_load_done",
          elapsed_ms: nnHomeDiagNowMs() - tDiag,
          message_key_count: Object.keys(m).length,
          region_card_count: publishedGlobalRegionCardIds.length,
        });

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

        let crumbs: ReturnType<typeof marketingHomeSurfaceBreadcrumbs>["crumbs"] = [];
        let schemaItems: ReturnType<typeof marketingHomeSurfaceBreadcrumbs>["schemaItems"] = [];
        try {
          const b = marketingHomeSurfaceBreadcrumbs();
          crumbs = b.crumbs;
          schemaItems = b.schemaItems;
        } catch {
          /* optional breadcrumb / schema — omit on failure */
        }

        void homePerfLogForGetRoot("home.server.06_before_page_shell_return", perfPageT0, {
          optional_db_skipped: skipOptionalDbReads,
        }).catch(() => {});
        emitNnHomeRouteDiag({ segment: "page_before_section_jsx", elapsed_ms: nnHomeDiagNowMs() - tDiag });

        const webPageProps = buildMarketingWebPageJsonLdProps({
          locale: STATIC_LOCALE,
          enPath: "/",
          title,
          description,
        });

        emitNnHomeRouteDiag({ segment: "page_before_return_jsx", elapsed_ms: nnHomeDiagNowMs() - tDiag });
        return (
          <>
            <WebPageJsonLd {...webPageProps} />
            {schemaItems.length > 0 ? <BreadcrumbJsonLd items={schemaItems} /> : null}
            <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />
            {crumbs.length > 0 ? (
              <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
                <BreadcrumbTrail items={crumbs} />
              </div>
            ) : null}
            <HomeRestoredWithDeferredStats
              skipOptionalDbReads={skipOptionalDbReads}
              publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
              skipOptionalDbPerfSegmentT0={skipOptionalDbReads ? perfPageT0 : undefined}
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
      } catch {
        emitNnHomeRouteDiag({ segment: "page_catch_emergency_fallback", elapsed_ms: nnHomeDiagNowMs() - tDiag });
        void homePerfFinalForGetRoot("failure", { error_phase: "page" }).catch(() => {});
        return <MarketingHomeEmergencyFallback />;
      }
  };

  if (runtime?.withSentryRuntimeSpan) {
    return runtime.withSentryRuntimeSpan(
      {
        name: "marketing.route.render.home",
        op: "ui.server.render",
        attributes: { route: "/", routeGroup: "marketing.default.home" },
      },
      renderHomePage,
    );
  }
  return renderHomePage();
}
