import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { HomeRestoredWithDeferredStats } from "@/components/marketing/home-restored-with-deferred-stats.server";
import { GlobalMarketingHomeIntro } from "@/components/marketing/global-marketing-home-intro.server";
import { MarketingHomeEmergencyFallback } from "@/components/marketing/marketing-home-emergency-fallback";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  loadMarketingMessageShards,
  loadMarketingMessageShardsSync,
} from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { type MarketingMessages } from "@/lib/marketing-i18n-core";
import { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
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
  nnHomeStaticMetadataEnabled,
  nnHomeStaticProbeEnabled,
} from "@/lib/observability/nn-home-isolation-flags";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";

// ─── Force dynamic rendering ────────────────────────────────────────────────
// This page reads request headers, so it must never be statically rendered.
// Without this, Next.js can conflict between static revalidation and dynamic
// header reads, causing intermittent crashes that are very hard to reproduce.
export const dynamic = "force-dynamic";

// Keep revalidate as a belt-and-suspenders signal but dynamic takes precedence.
export const revalidate = 0;

// ─── Constants ───────────────────────────────────────────────────────────────
const HOME_PAGE_BODY_I18N_BUDGET_MS = 2800;
const HOME_METADATA_I18N_BUDGET_MS = 2600;
const HOME_SENTRY_RUNTIME_BUDGET_MS = 2000;

const STATIC_LOCALE = DEFAULT_MARKETING_LOCALE;
const STATIC_REGION = "CA" as const;
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
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_FALLBACK_TITLE,
    description: HOME_FALLBACK_DESCRIPTION,
  },
};

// ─── Sentry ──────────────────────────────────────────────────────────────────
// Evaluated lazily per-request via safeAwait so a one-time import failure
// does not poison every subsequent request for the server's lifetime.
function getSentryRuntimePromise() {
  return import("@/lib/observability/sentry-runtime").catch((err) => {
    layoutStderrTrace("marketing_home", "sentry_import_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shouldSkipOptionalMarketingDbReads(): boolean {
  try {
    const raw = process.env.MARKETING_HOME_SKIP_OPTIONAL_DB?.trim().toLowerCase();
    if (raw === "true") return true;
    if (raw === "false") return false;
    return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE;
  } catch {
    return false;
  }
}

function safeCheckStaticProbe(): boolean {
  try {
    return nnHomeStaticProbeEnabled();
  } catch {
    return false;
  }
}

function safeCheckStaticMetadata(): boolean {
  try {
    return nnHomeStaticMetadataEnabled();
  } catch {
    return false;
  }
}

function safeNnHomeDiagNowMs(): number {
  try {
    return nnHomeDiagNowMs();
  } catch {
    return Date.now();
  }
}

async function loadHomePageMarketingMessagesForRequest(): Promise<MarketingMessages> {
  return loadMarketingMessageShards(STATIC_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
}

async function loadHomePageMarketingMessagesSafe(
  budgetMs: number,
  label: string,
): Promise<MarketingMessages> {
  try {
    const m = await safeAwait(loadHomePageMarketingMessagesForRequest(), label, budgetMs);
    if (m != null && Object.keys(m).length > 0) return m;

    layoutStderrTrace("marketing_home", "homepage_i18n_async_empty_or_partial", {
      label,
      key_count: m == null ? -1 : Object.keys(m).length,
    });

    try {
      const sync = loadMarketingMessageShardsSync(STATIC_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
      if (Object.keys(sync).length > 0) return sync;
    } catch (syncErr) {
      layoutStderrTrace("marketing_home", "homepage_i18n_sync_throw", {
        label,
        error: syncErr instanceof Error ? syncErr.message : String(syncErr),
      });
    }

    return {};
  } catch (asyncErr) {
    layoutStderrTrace("marketing_home", "homepage_i18n_async_throw", {
      label,
      error: asyncErr instanceof Error ? asyncErr.message : String(asyncErr),
    });

    try {
      const sync = loadMarketingMessageShardsSync(STATIC_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
      if (Object.keys(sync).length > 0) return sync;
    } catch (syncErr) {
      layoutStderrTrace("marketing_home", "homepage_i18n_sync_throw_after_async_error", {
        label,
        error: syncErr instanceof Error ? syncErr.message : String(syncErr),
      });
    }

    return {};
  }
}

function listPublishedHomeGlobalRegionCardIdsSafe(): readonly string[] {
  try {
    return listPublishedHomeGlobalRegionCardIds();
  } catch (err) {
    layoutStderrTrace("marketing_home", "region_card_ids_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return ["us", "ca"] as const;
  }
}

// ─── Safe server component wrappers ──────────────────────────────────────────
// Next.js Server Components do not support React Error Boundaries internally,
// so we wrap each async server component in its own async function with a
// try/catch. This means a failure in one section degrades gracefully instead
// of crashing the entire page render.

async function SafeGlobalMarketingHomeIntro() {
  try {
    return <GlobalMarketingHomeIntro />;
  } catch (err) {
    layoutStderrTrace("marketing_home", "global_marketing_home_intro_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

async function SafeHomeRestoredWithDeferredStats(props: {
  skipOptionalDbReads: boolean;
  publishedGlobalRegionCardIds: readonly string[];
  skipOptionalDbPerfSegmentT0: number | undefined;
  introAfterHero: React.ReactNode;
}) {
  try {
    return <HomeRestoredWithDeferredStats {...props} />;
  } catch (err) {
    layoutStderrTrace("marketing_home", "home_restored_deferred_stats_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    // Render the intro section alone rather than a blank page
    return <>{props.introAfterHero}</>;
  }
}

async function SafeHomeBlogTeaserSection({ m }: { m: MarketingMessages }) {
  try {
    return await HomeBlogTeaserSectionAsync({ m });
  } catch (err) {
    layoutStderrTrace("marketing_home", "home_blog_teaser_failed_open", {
      error: err instanceof Error ? err.message : String(err),
    });
    return <HomeBlogTeaserSectionShell m={m} posts={[]} />;
  }
}

function SafeFaqJsonLd() {
  try {
    return <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />;
  } catch (err) {
    layoutStderrTrace("marketing_home", "faq_jsonld_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const tDiag = safeNnHomeDiagNowMs();

  try {
    if (safeCheckStaticMetadata() || safeCheckStaticProbe()) {
      try {
        emitNnHomeRouteDiag({
          segment: "metadata_static_short_circuit",
          elapsed_ms: safeNnHomeDiagNowMs() - tDiag,
        });
      } catch {}
      return HOME_FALLBACK_METADATA;
    }
  } catch {
    return HOME_FALLBACK_METADATA;
  }

  let runtime: Awaited<ReturnType<typeof getSentryRuntimePromise>> = null;
  try {
    runtime = await safeAwait(
      getSentryRuntimePromise(),
      "marketing_home.metadata.sentry_import",
      HOME_SENTRY_RUNTIME_BUDGET_MS,
    );
  } catch {
    runtime = null;
  }

  const runMetadataInner = async (): Promise<Metadata> => {
    return safeGenerateMetadata(
      async () => {
        const m = await loadHomePageMarketingMessagesSafe(
          HOME_METADATA_I18N_BUDGET_MS,
          "marketing_home.metadata",
        );

        const title = getRequiredPublicMetadataLine(
          m,
          "pages.home.metaTitleCA",
          m,
          defaultHomeMetaTitle(STATIC_REGION),
        );

        const description = getRequiredPublicMetadataLine(
          m,
          "pages.home.metaDescriptionCA",
          m,
          defaultHomeMetaDescription(STATIC_REGION),
        );

        let alt: ReturnType<typeof marketingAlternatesSharedPage> | null = null;
        try {
          alt = marketingAlternatesSharedPage(STATIC_LOCALE, "/");
        } catch (err) {
          layoutStderrTrace("marketing_home", "metadata_alternates_failed", {
            error: err instanceof Error ? err.message : String(err),
          });
        }

        return {
          title,
          description,
          ...(alt
            ? { alternates: { canonical: alt.canonical, languages: alt.languages } }
            : {}),
          openGraph: {
            title,
            description,
            ...(alt ? { url: alt.canonical } : {}),
            type: "website",
            locale: "en_CA",
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
          },
        };
      },
      {
        pathname: "/",
        routeGroup: "marketing.default.home",
        fallbackMetadata: HOME_FALLBACK_METADATA,
      },
    );
  };

  try {
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
  } catch (err) {
    layoutStderrTrace("marketing_home", "metadata_sentry_span_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return runMetadataInner();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const tDiag = safeNnHomeDiagNowMs();

  // Static probe short-circuit — must be guarded
  try {
    if (safeCheckStaticProbe()) {
      return (
        <div data-nn-home-static-probe="1" className="p-6">
          <p>NN_HOME_STATIC_PROBE</p>
        </div>
      );
    }
  } catch {}

  // Sentry runtime — lazy per-request, failure is non-fatal
  let runtime: Awaited<ReturnType<typeof getSentryRuntimePromise>> = null;
  try {
    runtime = await safeAwait(
      getSentryRuntimePromise(),
      "marketing_home.page.sentry_import",
      HOME_SENTRY_RUNTIME_BUDGET_MS,
    );
  } catch {
    runtime = null;
  }

  const renderHomePage = async () => {
    const perfPageT0 = safeNnHomeDiagNowMs();

    try {
      // ── Headers probe (non-fatal) ──────────────────────────────────────────
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

      try {
        if (isNnTraceHomePerfTrue()) {
          emitNnHomePerfDiagLine({
            tag: "nn_home_perf_fallback_probe",
            pid: process.pid,
            pathname: pathnameProbe,
            request_method: methodProbe || "(method_header_empty)",
            trace_literal_true: true,
          });
        }
      } catch {}

      try {
        void homePerfLogForGetRoot("home.server.03_page_render_start", perfPageT0).catch(() => {});
      } catch {}

      const skipOptionalDbReads = shouldSkipOptionalMarketingDbReads();

      // ── Data fetching (allSettled so one failure doesn't block the other) ──
      const [mResult, regionCardIdsResult] = await Promise.allSettled([
        loadHomePageMarketingMessagesSafe(HOME_PAGE_BODY_I18N_BUDGET_MS, "marketing_home.page_body"),
        Promise.resolve().then(() => listPublishedHomeGlobalRegionCardIdsSafe()),
      ]);

      const m: MarketingMessages =
        mResult.status === "fulfilled" ? mResult.value : {};

      const publishedGlobalRegionCardIds: readonly string[] =
        regionCardIdsResult.status === "fulfilled"
          ? regionCardIdsResult.value
          : ["us", "ca"];

      if (mResult.status === "rejected") {
        layoutStderrTrace("marketing_home", "page_body_i18n_promise_rejected", {
          error:
            mResult.reason instanceof Error
              ? mResult.reason.message
              : String(mResult.reason),
        });
      }

      // ── Resolve display strings with fallbacks ─────────────────────────────
      const title = getRequiredPublicMetadataLine(
        m,
        "pages.home.metaTitleCA",
        m,
        defaultHomeMetaTitle(STATIC_REGION),
      );

      const description = getRequiredPublicMetadataLine(
        m,
        "pages.home.metaDescriptionCA",
        m,
        defaultHomeMetaDescription(STATIC_REGION),
      );

      if (Object.keys(m).length === 0) {
        layoutStderrTrace("marketing_home", "homepage_i18n_empty_continuing_with_fallbacks", {
          title,
          description,
        });
      }

      // ── Breadcrumbs (non-fatal) ────────────────────────────────────────────
      let crumbs: ReturnType<typeof marketingHomeSurfaceBreadcrumbs>["crumbs"] = [];
      let schemaItems: ReturnType<typeof marketingHomeSurfaceBreadcrumbs>["schemaItems"] = [];
      try {
        const b = marketingHomeSurfaceBreadcrumbs();
        crumbs = b.crumbs;
        schemaItems = b.schemaItems;
      } catch (err) {
        layoutStderrTrace("marketing_home", "breadcrumbs_failed_open", {
          error: err instanceof Error ? err.message : String(err),
        });
      }

      // ── JSON-LD (non-fatal) ────────────────────────────────────────────────
      let webPageProps: ReturnType<typeof buildMarketingWebPageJsonLdProps> | null = null;
      try {
        webPageProps = buildMarketingWebPageJsonLdProps({
          locale: STATIC_LOCALE,
          enPath: "/",
          title,
          description,
          inLanguage: "en-CA",
        });
      } catch (err) {
        layoutStderrTrace("marketing_home", "webpage_jsonld_failed", {
          error: err instanceof Error ? err.message : String(err),
        });
      }

      // ── Perf success signal ────────────────────────────────────────────────
      try {
        void homePerfFinalForGetRoot("success", {}).catch(() => {});
      } catch {}

      // ── Render ─────────────────────────────────────────────────────────────
      return (
        <>
          {webPageProps != null ? <WebPageJsonLd {...webPageProps} /> : null}
          {schemaItems.length > 0 ? <BreadcrumbJsonLd items={schemaItems} /> : null}
          <SafeFaqJsonLd />

          {crumbs.length > 0 ? (
            <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
              <BreadcrumbTrail items={crumbs} />
            </div>
          ) : null}

          <SafeHomeRestoredWithDeferredStats
            skipOptionalDbReads={skipOptionalDbReads}
            publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
            skipOptionalDbPerfSegmentT0={skipOptionalDbReads ? perfPageT0 : undefined}
            introAfterHero={<SafeGlobalMarketingHomeIntro />}
          />

          <Suspense fallback={<HomeBlogTeaserSectionShell m={m} posts={[]} />}>
            <SafeHomeBlogTeaserSection m={m} />
          </Suspense>
        </>
      );
    } catch (err) {
      // ── Last-resort emergency fallback ────────────────────────────────────
      try {
        emitNnHomeRouteDiag({
          segment: "page_catch_emergency_fallback",
          elapsed_ms: safeNnHomeDiagNowMs() - tDiag,
        });
      } catch {}

      layoutStderrTrace("marketing_home", "home_page_failed_to_emergency_fallback", {
        error: err instanceof Error ? err.message : String(err),
      });

      try {
        void homePerfFinalForGetRoot("failure", { error_phase: "page" }).catch(() => {});
      } catch {}

      return <MarketingHomeEmergencyFallback />;
    }
  };

  // ── Sentry span wrapper (non-fatal) ────────────────────────────────────────
  try {
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
  } catch (err) {
    layoutStderrTrace("marketing_home", "page_sentry_span_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return renderHomePage();
}