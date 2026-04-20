import { headers } from "next/headers";
import { MarketingCountryChromeProvider } from "@/components/marketing/marketing-country-chrome-context";
import { getEffectiveMarketingCountry } from "@/lib/marketing/get-effective-country";
import { readOptionalMarketingRegionToggleForCountry } from "@/lib/marketing/read-optional-marketing-region-cookie.server";
import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import { mergeMinimalMarketingLayoutShellMessages } from "@/lib/marketing-i18n/minimal-marketing-layout-shell-fallback";
import { getMarketingDefaultLayoutChromeMessages } from "@/lib/marketing-i18n/marketing-layout-chrome-messages.server";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
import { safeAwait } from "@/lib/async/safe-await";
import { homePerfFinalForGetRoot, homePerfLogForGetRoot } from "@/lib/observability/home-perf-trace";
import {
  emitNnHomeRouteDiag,
  nnHomeDiagNowMs,
  nnHomeStaticMarketingLayoutEnabled,
  shouldEmitNnHomeRouteDiag,
} from "@/lib/observability/nn-home-isolation-flags";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";

/** Single module promise — avoids per-request `import()` bookkeeping on hot marketing layout path. */
const marketingDefaultLayoutSentryRuntimePromise = import("@/lib/observability/sentry-runtime");

const MARKETING_LAYOUT_SENTRY_IMPORT_BUDGET_MS = 2000;

/** Keep `pages.*` off the layout merge; load under `<main>` via `MarketingMainI18nShards` (build + runtime). */
function shouldLayerMainPageShards() {
  return true;
}

/** Minimal chrome for `/` when `NN_HOME_STATIC_MARKETING_LAYOUT` — matches fatal-shell shape (no header/footer). */
function marketingDefaultLayoutStaticShellForHome({
  children,
  serverRegion,
  trustClientPersistedRegion,
}: {
  children: React.ReactNode;
  serverRegion: MarketingRegionToggle;
  trustClientPersistedRegion: boolean;
}) {
  const shellMessages = mergeMinimalMarketingLayoutShellMessages({});
  return (
    <MarketingI18nProvider
      key={DEFAULT_MARKETING_LOCALE}
      locale={DEFAULT_MARKETING_LOCALE}
      messages={shellMessages}
      fallbackMessages={undefined}
    >
      <NursenestRegionRoot serverRegion={serverRegion} trustClientPersistedRegion={trustClientPersistedRegion}>
        <div className="nn-marketing-surface flex min-h-screen flex-col">
          <main className="flex min-h-0 flex-1 flex-col">
            <PageTransitionShell>{children}</PageTransitionShell>
          </main>
        </div>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  const layoutBootT0 = nnHomeDiagNowMs();

  if (nnHomeStaticMarketingLayoutEnabled()) {
    try {
      const hpEarly = (await headers()).get("x-nn-request-pathname")?.trim() ?? "";
      if (hpEarly === "/") {
        try {
          console.error(
            `[nursenest-core] NN_HOME_STATIC_MARKETING_LAYOUT=1: minimal default marketing layout for / (no Sentry span, no chrome shards)`,
          );
        } catch {
          /* noop */
        }
        if (shouldEmitNnHomeRouteDiag()) {
          emitNnHomeRouteDiag({
            segment: "layout_static_marketing_shell_short_circuit",
            pathname: hpEarly,
            elapsed_ms: nnHomeDiagNowMs() - layoutBootT0,
          });
        }
        const staticShellRegionCookie = await readOptionalMarketingRegionToggleForCountry();
        const staticShellServerRegion: MarketingRegionToggle = staticShellRegionCookie ?? "CA";
        return marketingDefaultLayoutStaticShellForHome({
          children,
          serverRegion: staticShellServerRegion,
          trustClientPersistedRegion: staticShellRegionCookie !== undefined,
        });
      }
    } catch {
      /* fall through — e.g. headers unavailable */
    }
  }

  const runtime = await safeAwait(
    marketingDefaultLayoutSentryRuntimePromise,
    "marketing_default_layout.sentry_import",
    MARKETING_LAYOUT_SENTRY_IMPORT_BUDGET_MS,
  );

  if (shouldEmitNnHomeRouteDiag()) {
    let hp0 = "";
    try {
      hp0 = (await headers()).get("x-nn-request-pathname")?.trim() ?? "";
    } catch {
      hp0 = "(headers_unavailable)";
    }
    if (hp0 === "/") {
      emitNnHomeRouteDiag({
        segment: "layout_after_sentry_import",
        pathname: hp0,
        elapsed_ms: nnHomeDiagNowMs() - layoutBootT0,
        has_sentry_span: Boolean(runtime?.withSentryRuntimeSpan),
      });
    }
  }

  const marketingDefaultLayoutInner = async () => {
    const perfLayoutT0 = nnHomeDiagNowMs();
    if (shouldEmitNnHomeRouteDiag()) {
      let hp = "";
      try {
        hp = (await headers()).get("x-nn-request-pathname")?.trim() ?? "";
      } catch {
        hp = "(headers_unavailable)";
      }
      if (hp === "/") {
        emitNnHomeRouteDiag({
          segment: "layout_marketing_default_enter",
          pathname: hp,
          elapsed_ms: nnHomeDiagNowMs() - perfLayoutT0,
        });
      }
    }
    try {
      layoutStderrTrace("marketing_layout", "marketing layout start", { route: "shared-marketing-default" });
      const resolvedLocale: string = DEFAULT_MARKETING_LOCALE;
      let messages: Record<string, string> = {};
      let fallbackMessages: Record<string, string> | undefined = undefined;

      if (shouldEmitNnHomeRouteDiag()) {
        let hpc = "";
        try {
          hpc = (await headers()).get("x-nn-request-pathname")?.trim() ?? "";
        } catch {
          hpc = "";
        }
        if (hpc === "/") {
          emitNnHomeRouteDiag({
            segment: "layout_chrome_load_start",
            elapsed_ms: nnHomeDiagNowMs() - perfLayoutT0,
          });
        }
      }

      try {
        messages = await getMarketingDefaultLayoutChromeMessages();
        fallbackMessages = undefined;
      } catch (e) {
        console.error("[marketing-default-layout] failed to load messages", {
          error: e instanceof Error ? e.message : String(e),
        });
        runtime?.captureSentryRuntimeSoftError?.({
          scope: "marketing_layout",
          event: "chrome_messages_failed",
          error: e,
          route: "shared-marketing-default",
          feature: "marketing_layout",
          meta: { locale: DEFAULT_MARKETING_LOCALE },
        });
      }

      if (shouldEmitNnHomeRouteDiag()) {
        let hpd = "";
        try {
          hpd = (await headers()).get("x-nn-request-pathname")?.trim() ?? "";
        } catch {
          hpd = "";
        }
        if (hpd === "/") {
          emitNnHomeRouteDiag({
            segment: "layout_chrome_load_done",
            elapsed_ms: nnHomeDiagNowMs() - perfLayoutT0,
            message_count: Object.keys(messages).length,
          });
        }
      }

      messages = mergeMinimalMarketingLayoutShellMessages(messages);
      void homePerfLogForGetRoot("home.server.after_layout_chrome_messages", perfLayoutT0, {
        message_count: Object.keys(messages).length,
      }).catch(() => {
        /* perf must not affect render */
      });
      layoutStderrTrace("marketing_layout", "marketing layout after messages", {
        route: "shared-marketing-default",
        locale: resolvedLocale,
        messageCount: Object.keys(messages).length,
      });
      try {
        assertMarketingLayoutMessagesIntegrity({
          route: "shared-marketing-default",
          locale: resolvedLocale,
          messages,
          fallbackMessages,
        });
      } catch (integrityErr) {
        runtime?.captureSentryRuntimeSoftError?.({
          scope: "marketing_layout",
          event: "marketing_layout_integrity_soft_fail",
          error: integrityErr,
          route: "shared-marketing-default",
          feature: "marketing_layout",
          meta: { locale: DEFAULT_MARKETING_LOCALE },
        });
      }

      if (shouldEmitNnHomeRouteDiag()) {
        let hp2 = "";
        try {
          hp2 = (await headers()).get("x-nn-request-pathname")?.trim() ?? "";
        } catch {
          hp2 = "(headers_unavailable)";
        }
        if (hp2 === "/") {
          emitNnHomeRouteDiag({
            segment: "layout_marketing_default_before_shell_return",
            elapsed_ms: nnHomeDiagNowMs() - perfLayoutT0,
          });
        }
      }

      let marketingRequestPath = "/";
      try {
        marketingRequestPath = (await headers()).get("x-nn-request-pathname")?.trim() ?? "/";
      } catch {
        marketingRequestPath = "/";
      }
      const marketingRegionCookie = await readOptionalMarketingRegionToggleForCountry();
      /** Canada-first on unprefixed marketing: no cookie means CA, not US (see `readOptionalMarketingRegionToggleForCountry`). */
      const serverRegion: MarketingRegionToggle = marketingRegionCookie ?? "CA";
      const trustClientPersistedRegion = marketingRegionCookie !== undefined;
      const marketingCountry = getEffectiveMarketingCountry(marketingRequestPath, marketingRegionCookie);

      return (
        <MarketingI18nProvider
          key={resolvedLocale}
          locale={resolvedLocale}
          messages={messages}
          fallbackMessages={fallbackMessages}
        >
          <NursenestRegionRoot serverRegion={serverRegion} trustClientPersistedRegion={trustClientPersistedRegion}>
            <MarketingCountryChromeProvider country={marketingCountry}>
              <OrganizationJsonLd />
              <WebSiteJsonLd />
              <MarketingFeedbackShell>
                <div className="nn-marketing-surface flex min-h-screen flex-col">
                  <SiteHeader />
                  <PathwayLessonProgressRefreshListener />
                  <main className="flex min-h-0 flex-1 flex-col">
                    {shouldLayerMainPageShards() ? (
                      <MarketingMainI18nShards locale={resolvedLocale}>
                        <PageTransitionShell>{children}</PageTransitionShell>
                      </MarketingMainI18nShards>
                    ) : (
                      <PageTransitionShell>{children}</PageTransitionShell>
                    )}
                  </main>
                  <SiteFooter />
                </div>
              </MarketingFeedbackShell>
            </MarketingCountryChromeProvider>
          </NursenestRegionRoot>
        </MarketingI18nProvider>
      );
    } catch (e) {
      void homePerfFinalForGetRoot("failure", { error_phase: "layout" }).catch(() => {
        /* perf */
      });
      runtime?.captureSentryRuntimeSoftError?.({
        scope: "marketing_layout",
        event: "marketing_layout_fatal_soft_shell",
        error: e,
        route: "shared-marketing-default",
        feature: "marketing_layout",
        meta: { locale: DEFAULT_MARKETING_LOCALE },
      });
      const shellMessages = mergeMinimalMarketingLayoutShellMessages({});
      return (
        <MarketingI18nProvider
          key={DEFAULT_MARKETING_LOCALE}
          locale={DEFAULT_MARKETING_LOCALE}
          messages={shellMessages}
          fallbackMessages={undefined}
        >
          <NursenestRegionRoot serverRegion={"CA"} trustClientPersistedRegion={false}>
            <div className="nn-marketing-surface flex min-h-screen flex-col">
              <main className="flex min-h-0 flex-1 flex-col">
                <PageTransitionShell>{children}</PageTransitionShell>
              </main>
            </div>
          </NursenestRegionRoot>
        </MarketingI18nProvider>
      );
    }
  };

  if (runtime?.withSentryRuntimeSpan) {
    return runtime.withSentryRuntimeSpan(
      {
        name: "marketing.layout.default.render",
        op: "ui.server.render",
        attributes: { route: "shared-marketing-default", locale: DEFAULT_MARKETING_LOCALE },
      },
      marketingDefaultLayoutInner,
    );
  }
  return marketingDefaultLayoutInner();
}
