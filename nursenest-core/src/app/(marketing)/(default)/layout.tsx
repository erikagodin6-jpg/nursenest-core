import { headers } from "next/headers";
import { MarketingCountryChromeProvider } from "@/components/marketing/marketing-country-chrome-context";
import { getEffectiveMarketingCountry } from "@/lib/marketing/get-effective-country";
import { readOptionalMarketingRegionToggleForCountry } from "@/lib/marketing/read-optional-marketing-region-cookie.server";
import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import { mergeMinimalMarketingLayoutShellMessages } from "@/lib/marketing-i18n/minimal-marketing-layout-shell-fallback";
import { getMarketingDefaultLayoutChromeMessages } from "@/lib/marketing-i18n/marketing-layout-chrome-messages.server";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { MarketingMobileMotionShell } from "@/lib/ui/marketing-mobile-motion-shell";
import { readMarketingNarrowViewportServerHint } from "@/lib/marketing/read-marketing-narrow-viewport-hint.server";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
import { MarketingDefaultLayoutChromeFailsafeShell } from "@/components/marketing/marketing-default-layout-chrome-failsafe";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { CheckoutGlobalRegionContextPathStamp } from "@/components/marketing/checkout-global-region-context-path-stamp";
import { MarketingHeaderGlobalRegionServerBridge } from "@/lib/region/marketing-header-global-region-server-bridge";
import { readOptionalGlobalRegionSlugFromCookie } from "@/lib/region/read-optional-global-region-cookie.server";
import { resolveDefaultLayoutMarketingExamRegion } from "@/lib/marketing/resolve-default-layout-marketing-exam-region";
import { detectedIpCountryFromHeaders } from "@/lib/region/detected-ip-country.server";
import { safeAwait } from "@/lib/async/safe-await";
import { homePerfFinalForGetRoot, homePerfLogForGetRoot } from "@/lib/observability/home-perf-trace";
import {
  emitNnHomeRouteDiag,
  nnHomeDiagNowMs,
  nnHomeStaticMarketingLayoutEnabled,
  shouldEmitNnHomeRouteDiag,
} from "@/lib/observability/nn-home-isolation-flags";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";
import { loadMarketingLayoutObservability } from "@/lib/observability/deferred-marketing-layout-observability";
import { loadRenderTrace } from "@/lib/observability/deferred-render-trace";
import { getStaffSession } from "@/lib/auth/staff-session";
import { MarketingPublicContentEditProvider } from "@/components/marketing/marketing-public-content-edit-provider";
import { loadMarketingPublicContentOverridesForLocale } from "@/lib/marketing/load-marketing-public-content-overrides";
import type { CountryCode } from "@/lib/marketing/countries/types";

export const dynamic = "force-dynamic";

const MARKETING_LAYOUT_SENTRY_IMPORT_BUDGET_MS = 2000;

function safeNowMs(): number {
  try {
    return nnHomeDiagNowMs();
  } catch {
    return Date.now();
  }
}

function shouldLayerMainPageShards() {
  return true;
}

function getMarketingDefaultLayoutSentryRuntimePromise() {
  return import("@/lib/observability/sentry-runtime").catch((err) => {
    layoutStderrTrace("marketing_layout", "sentry_runtime_import_failed", {
      route: "shared-marketing-default",
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  });
}

async function readNarrowViewportHintSafe(): Promise<boolean> {
  try {
    return await readMarketingNarrowViewportServerHint();
  } catch (err) {
    layoutStderrTrace("marketing_layout", "narrow_viewport_hint_failed", {
      route: "shared-marketing-default",
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

async function getHeaderPathnameSafe(): Promise<string> {
  try {
    return (await headers()).get("x-nn-request-pathname")?.trim() ?? "/";
  } catch {
    return "/";
  }
}

function marketingDefaultLayoutStaticShellForHome({
  children,
  serverRegion,
  trustClientPersistedRegion,
  serverGlobalRegion,
  marketingCountry,
  serverNarrowViewportHint,
}: {
  children: React.ReactNode;
  serverRegion: MarketingRegionToggle;
  trustClientPersistedRegion: boolean;
  serverGlobalRegion: GlobalRegionSlug | null;
  marketingCountry: CountryCode;
  serverNarrowViewportHint: boolean;
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
        <MarketingCountryChromeProvider country={marketingCountry}>
          <MarketingFeedbackShell>
            <MarketingHeaderGlobalRegionServerBridge serverGlobalRegion={serverGlobalRegion}>
              <CheckoutGlobalRegionContextPathStamp />
              <MarketingDefaultLayoutChromeFailsafeShell>
                <MarketingMobileMotionShell serverNarrowViewportHint={serverNarrowViewportHint}>
                  {children}
                </MarketingMobileMotionShell>
              </MarketingDefaultLayoutChromeFailsafeShell>
            </MarketingHeaderGlobalRegionServerBridge>
          </MarketingFeedbackShell>
        </MarketingCountryChromeProvider>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  const layoutBootT0 = safeNowMs();

  try {
    void loadRenderTrace()
      .then((m) => m.renderTrace("marketing_default_layout", { route: "shared-marketing-default" }))
      .catch(() => {});
  } catch {}

  try {
    void loadMarketingLayoutObservability().catch(() => {});
  } catch {}

  try {
    if (nnHomeStaticMarketingLayoutEnabled()) {
      const hpEarly = await getHeaderPathnameSafe();

      if (hpEarly === "/") {
        try {
          console.error(
            "[nursenest-core] NN_HOME_STATIC_MARKETING_LAYOUT=1: minimal default marketing layout for / (no Sentry span, no chrome shards)",
          );
        } catch {}

        try {
          if (shouldEmitNnHomeRouteDiag()) {
            emitNnHomeRouteDiag({
              segment: "layout_static_marketing_shell_short_circuit",
              pathname: hpEarly,
              elapsed_ms: safeNowMs() - layoutBootT0,
            });
          }
        } catch {}

        const staticShellRegionCookie = await readOptionalMarketingRegionToggleForCountry().catch(() => undefined);
        const staticShellGlobalRegion = await readOptionalGlobalRegionSlugFromCookie().catch(() => null);

        let staticShellDetectedIp: string | null = null;
        try {
          staticShellDetectedIp = detectedIpCountryFromHeaders(await headers());
        } catch {
          staticShellDetectedIp = null;
        }

        const staticShellServerRegion: MarketingRegionToggle = resolveDefaultLayoutMarketingExamRegion({
          marketingRegionCookie: staticShellRegionCookie,
          globalRegionSlug: staticShellGlobalRegion,
          detectedIpCountry: staticShellDetectedIp,
        });

        const staticShellMarketingCountry = getEffectiveMarketingCountry(
          hpEarly || "/",
          staticShellRegionCookie ?? staticShellServerRegion,
        );

        const staticShellNarrowHint = await readNarrowViewportHintSafe();

        return marketingDefaultLayoutStaticShellForHome({
          children,
          serverRegion: staticShellServerRegion,
          trustClientPersistedRegion: staticShellRegionCookie !== undefined,
          serverGlobalRegion: staticShellGlobalRegion,
          marketingCountry: staticShellMarketingCountry,
          serverNarrowViewportHint: staticShellNarrowHint,
        });
      }
    }
  } catch (err) {
    layoutStderrTrace("marketing_layout", "static_marketing_layout_probe_failed_open", {
      route: "shared-marketing-default",
      error: err instanceof Error ? err.message : String(err),
    });
  }

  const runtime = await safeAwait(
    getMarketingDefaultLayoutSentryRuntimePromise(),
    "marketing_default_layout.sentry_import",
    MARKETING_LAYOUT_SENTRY_IMPORT_BUDGET_MS,
  ).catch(() => null);

  try {
    if (shouldEmitNnHomeRouteDiag()) {
      const hp0 = await getHeaderPathnameSafe();

      if (hp0 === "/") {
        emitNnHomeRouteDiag({
          segment: "layout_after_sentry_import",
          pathname: hp0,
          elapsed_ms: safeNowMs() - layoutBootT0,
          has_sentry_span: Boolean(runtime?.withSentryRuntimeSpan),
        });
      }
    }
  } catch {}

  const marketingDefaultLayoutInner = async () => {
    const perfLayoutT0 = safeNowMs();

    try {
      if (shouldEmitNnHomeRouteDiag()) {
        const hp = await getHeaderPathnameSafe();

        if (hp === "/") {
          emitNnHomeRouteDiag({
            segment: "layout_marketing_default_enter",
            pathname: hp,
            elapsed_ms: safeNowMs() - perfLayoutT0,
          });
        }
      }

      const serverNarrowViewportHint = await readNarrowViewportHintSafe();

      layoutStderrTrace("marketing_layout", "marketing layout start", {
        route: "shared-marketing-default",
      });

      const resolvedLocale: string = DEFAULT_MARKETING_LOCALE;
      let messages: Record<string, string> = {};
      let fallbackMessages: Record<string, string> | undefined = undefined;

      try {
        if (shouldEmitNnHomeRouteDiag()) {
          const hpc = await getHeaderPathnameSafe();

          if (hpc === "/") {
            emitNnHomeRouteDiag({
              segment: "layout_chrome_load_start",
              elapsed_ms: safeNowMs() - perfLayoutT0,
            });
          }
        }
      } catch {}

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

      try {
        if (shouldEmitNnHomeRouteDiag()) {
          const hpd = await getHeaderPathnameSafe();

          if (hpd === "/") {
            emitNnHomeRouteDiag({
              segment: "layout_chrome_load_done",
              elapsed_ms: safeNowMs() - perfLayoutT0,
              message_count: Object.keys(messages).length,
            });
          }
        }
      } catch {}

      messages = mergeMinimalMarketingLayoutShellMessages(messages);

      try {
        void homePerfLogForGetRoot("home.server.after_layout_chrome_messages", perfLayoutT0, {
          message_count: Object.keys(messages).length,
        }).catch(() => {});
      } catch {}

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

      try {
        if (shouldEmitNnHomeRouteDiag()) {
          const hp2 = await getHeaderPathnameSafe();

          if (hp2 === "/") {
            emitNnHomeRouteDiag({
              segment: "layout_marketing_default_before_shell_return",
              elapsed_ms: safeNowMs() - perfLayoutT0,
            });
          }
        }
      } catch {}

      let marketingRequestPath = "/";
      let detectedIpCountry: string | null = null;

      try {
        const headerList = await headers();
        marketingRequestPath = headerList.get("x-nn-request-pathname")?.trim() ?? "/";
        detectedIpCountry = detectedIpCountryFromHeaders(headerList);
      } catch {
        marketingRequestPath = "/";
        detectedIpCountry = null;
      }

      const marketingRegionCookie = await readOptionalMarketingRegionToggleForCountry().catch(() => undefined);
      const serverGlobalRegionCookie = await readOptionalGlobalRegionSlugFromCookie().catch(() => null);

      const serverRegion: MarketingRegionToggle = resolveDefaultLayoutMarketingExamRegion({
        marketingRegionCookie,
        globalRegionSlug: serverGlobalRegionCookie,
        detectedIpCountry,
      });

      const trustClientPersistedRegion = marketingRegionCookie !== undefined;

      const marketingCountry = getEffectiveMarketingCountry(
        marketingRequestPath,
        marketingRegionCookie ?? serverRegion,
      );

      const [publicContentOverrides, staffSession] = await Promise.all([
        loadMarketingPublicContentOverridesForLocale(resolvedLocale).catch(() => ({} as Record<string, string>)),
        getStaffSession().catch(() => null),
      ]);

      return (
        <MarketingI18nProvider
          key={resolvedLocale}
          locale={resolvedLocale}
          messages={messages}
          fallbackMessages={fallbackMessages}
        >
          <MarketingPublicContentEditProvider isStaff={Boolean(staffSession)}>
            <NursenestRegionRoot serverRegion={serverRegion} trustClientPersistedRegion={trustClientPersistedRegion}>
              <MarketingCountryChromeProvider country={marketingCountry}>
                <OrganizationJsonLd />
                <WebSiteJsonLd />
                <MarketingFeedbackShell>
                  <MarketingHeaderGlobalRegionServerBridge serverGlobalRegion={serverGlobalRegionCookie}>
                    <CheckoutGlobalRegionContextPathStamp />
                    <div className="nn-marketing-surface flex min-h-screen flex-col">
                      <SiteHeader serverHasStaffSession={staffSession != null} />
                      <main className="flex min-h-0 flex-1 flex-col">
                        {shouldLayerMainPageShards() ? (
                          <MarketingMainI18nShards
                            locale={resolvedLocale}
                            publicContentOverrides={publicContentOverrides}
                          >
                            <MarketingMobileMotionShell serverNarrowViewportHint={serverNarrowViewportHint}>
                              {children}
                            </MarketingMobileMotionShell>
                          </MarketingMainI18nShards>
                        ) : (
                          <MarketingMobileMotionShell serverNarrowViewportHint={serverNarrowViewportHint}>
                            {children}
                          </MarketingMobileMotionShell>
                        )}
                      </main>
                      <SiteFooter serverHasStaffSession={staffSession != null} />
                    </div>
                  </MarketingHeaderGlobalRegionServerBridge>
                </MarketingFeedbackShell>
              </MarketingCountryChromeProvider>
            </NursenestRegionRoot>
          </MarketingPublicContentEditProvider>
        </MarketingI18nProvider>
      );
    } catch (e) {
      try {
        void homePerfFinalForGetRoot("failure", { error_phase: "layout" }).catch(() => {});
      } catch {}

      layoutStderrTrace("marketing_layout", "marketing_default_layout_failsafe_enter", {
        route: "shared-marketing-default",
        error: e instanceof Error ? e.message : String(e),
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
      let failsafeGlobalRegion: GlobalRegionSlug | null = null;
      let failsafeServerRegion: MarketingRegionToggle = "CA";
      let failsafeMarketingCountry: CountryCode = "canada";

      try {
        const headerList = await headers();
        const pathname = headerList.get("x-nn-request-pathname")?.trim() ?? "/";
        failsafeGlobalRegion = await readOptionalGlobalRegionSlugFromCookie().catch(() => null);
        const marketingRegionCookie = await readOptionalMarketingRegionToggleForCountry().catch(() => undefined);
        const detectedIpCountry = detectedIpCountryFromHeaders(headerList);

        failsafeServerRegion = resolveDefaultLayoutMarketingExamRegion({
          marketingRegionCookie,
          globalRegionSlug: failsafeGlobalRegion,
          detectedIpCountry,
        });

        failsafeMarketingCountry = getEffectiveMarketingCountry(
          pathname,
          marketingRegionCookie ?? failsafeServerRegion,
        );
      } catch {}

      const failsafeNarrowHint = await readNarrowViewportHintSafe();

      return (
        <MarketingI18nProvider
          key={DEFAULT_MARKETING_LOCALE}
          locale={DEFAULT_MARKETING_LOCALE}
          messages={shellMessages}
          fallbackMessages={undefined}
        >
          <NursenestRegionRoot serverRegion={failsafeServerRegion} trustClientPersistedRegion={false}>
            <MarketingCountryChromeProvider country={failsafeMarketingCountry}>
              <MarketingFeedbackShell>
                <MarketingHeaderGlobalRegionServerBridge serverGlobalRegion={failsafeGlobalRegion}>
                  <CheckoutGlobalRegionContextPathStamp />
                  <MarketingDefaultLayoutChromeFailsafeShell>
                    <MarketingMobileMotionShell serverNarrowViewportHint={failsafeNarrowHint}>
                      {children}
                    </MarketingMobileMotionShell>
                  </MarketingDefaultLayoutChromeFailsafeShell>
                </MarketingHeaderGlobalRegionServerBridge>
              </MarketingFeedbackShell>
            </MarketingCountryChromeProvider>
          </NursenestRegionRoot>
        </MarketingI18nProvider>
      );
    }
  };

  try {
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
  } catch (err) {
    layoutStderrTrace("marketing_layout", "sentry_span_failed_falling_back", {
      route: "shared-marketing-default",
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return marketingDefaultLayoutInner();
}