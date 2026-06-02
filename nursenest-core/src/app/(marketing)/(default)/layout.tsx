import type { ReactNode } from "react";
import { Suspense } from "react";
import { headers } from "next/headers";

import { traceLayout } from "@/build/tracing";
import { MarketingCountryChromeProvider } from "@/components/marketing/marketing-country-chrome-context";
import { getEffectiveMarketingCountry } from "@/lib/marketing/get-effective-country";
import { readOptionalMarketingRegionToggleForCountry } from "@/lib/marketing/read-optional-marketing-region-cookie.server";
import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderServer } from "@/components/layout/site-header-server";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import { mergeMinimalMarketingLayoutShellMessages } from "@/lib/marketing-i18n/minimal-marketing-layout-shell-fallback";
import { getMarketingDefaultLayoutChromeMessages } from "@/lib/marketing-i18n/marketing-layout-chrome-messages.server";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import { CountryPreferenceRoot } from "@/lib/region/use-country-preference";
import { readOptionalCountryPreferenceFromCookie } from "@/lib/region/read-optional-country-preference-cookie.server";
import { countryPreferenceToNursenestRegion, type CountryPreference } from "@/lib/region/country-preference";
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
import { MarketingPublicContentEditProvider } from "@/components/marketing/marketing-public-content-edit-provider";
import { MarketingMainErrorBoundary } from "@/components/marketing/marketing-main-error-boundary";
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";
import type { CountryCode } from "@/lib/marketing/countries/types";

// 🧊 ISR window for public marketing pages.
// Pages are revalidated at most every 300 seconds (5 min) by default.
// Individual route pages can override with their own `revalidate`.
export const revalidate = 300;

// No `force-dynamic`: this layout is ISR-compatible by default.
// Dynamic work (headers, cookies, region detection) is deferred to
// Suspense-wrapped client components or wrapped in try/catch failsafes.
// If a route truly needs request-time data, it can opt in with its own
// `force-dynamic` — but that should be the exception, not the default.

// Sentry is kicked off in the background and never awaited. Waiting even 150ms
// before returning the first byte was measurable TTFB cost on every marketing
// request. Sentry global error handlers are still active; we just skip the
// per-request span wrapper on layout renders.
const MARKETING_LAYOUT_SENTRY_IMPORT_BUDGET_MS = 0; // kept for reference; no longer used

/**
 * Single slot for default marketing main: motion perf + main-column error isolation.
 * Keeps exactly one `{children}` (the segment page) under `MarketingMobileMotionShell` per call site.
 */
function MarketingDefaultMainMotionSlot({
  serverNarrowViewportHint,
  children,
}: {
  serverNarrowViewportHint: boolean;
  children: ReactNode;
}) {
  return (
    <MarketingMobileMotionShell serverNarrowViewportHint={serverNarrowViewportHint}>
      <MarketingMainErrorBoundary name="marketing_default_main">{children}</MarketingMainErrorBoundary>
    </MarketingMobileMotionShell>
  );
}

function defaultMarketingSiteFooter() {
  return <SiteFooter />;
}

function safeNowMs(): number {
  try {
    return nnHomeDiagNowMs();
  } catch {
    return Date.now();
  }
}

function shouldLayerMainPageShards(pathname: string) {
  // The homepage has its own bounded server-island message loading. Avoid
  // pushing the large page-body shard through the client i18n context on `/`;
  // in the hosted standalone runtime that stream has produced TransformStream
  // failures after the page successfully renders.
  return pathname !== "/";
}

/** Auth pages own their full-screen layout — strip the site header and footer so
 *  users see only the focused auth card, not the full marketing chrome. */
function isAuthOnlyRoute(pathname: string): boolean {
  const normalized = pathname.split("?")[0]?.replace(/\/+$/, "") ?? "";
  const AUTH_PATHS = [
    "/login", "/signup", "/signin", "/sign-up",
    "/forgot-password", "/reset-password", "/verify-email",
  ];
  // Also handle locale-prefixed variants: /{locale}/login etc.
  return AUTH_PATHS.some(
    (p) => normalized === p || normalized.endsWith(p),
  );
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

async function loadPublicContentOverridesForLocaleSafe(locale: string): Promise<Record<string, string>> {
  try {
    const { loadMarketingPublicContentOverridesForLocale } = await import(
      "@/lib/marketing/load-marketing-public-content-overrides"
    );
    return await loadMarketingPublicContentOverridesForLocale(locale);
  } catch {
    return {};
  }
}

async function getStaffSessionSafe() {
  try {
    const { getStaffSession } = await import("@/lib/auth/staff-session");
    return await getStaffSession();
  } catch {
    return null;
  }
}

/** Safe wrapper around headers() — returns null if called during static generation. */
async function getHeadersSafe(): Promise<Headers | null> {
  try {
    // During ISR revalidation or static generation, headers() throws.
    // Catch silently and fall back to defaults.
    return await headers();
  } catch {
    return null;
  }
}

function marketingDefaultLayoutStaticShellForHome({
  children,
  serverRegion,
  trustClientPersistedRegion,
  serverGlobalRegion,
  serverCountryPreference,
  marketingCountry,
  serverNarrowViewportHint,
}: {
  children: ReactNode;
  serverRegion: MarketingRegionToggle;
  trustClientPersistedRegion: boolean;
  serverGlobalRegion: GlobalRegionSlug | null;
  serverCountryPreference: CountryPreference | null;
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
        <CountryPreferenceRoot serverCountry={serverCountryPreference}>
          <MarketingCountryChromeProvider country={marketingCountry}>
            <MarketingFeedbackShell>
              <MarketingHeaderGlobalRegionServerBridge serverGlobalRegion={serverGlobalRegion}>
                <CheckoutGlobalRegionContextPathStamp />
                <MarketingDefaultLayoutChromeFailsafeShell>
                  <PremiumLayoutVersionMarker surface="marketing-default-static-home" />
                  <MarketingDefaultMainMotionSlot serverNarrowViewportHint={serverNarrowViewportHint}>
                    {children}
                  </MarketingDefaultMainMotionSlot>
                  {defaultMarketingSiteFooter()}
                </MarketingDefaultLayoutChromeFailsafeShell>
              </MarketingHeaderGlobalRegionServerBridge>
            </MarketingFeedbackShell>
          </MarketingCountryChromeProvider>
        </CountryPreferenceRoot>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}

/**
 * ⚡ Deferred dynamic region provider.
 *
 * Runs during ISR revalidation — reads headers, cookies, region cookies.
 * Wrapped in try/catch so a failure here never kills the page render.
 * Returns default (CA/canada) if anything fails.
 */
async function DeferredRegionShell({ children }: { children: ReactNode }) {
  try {
    const rawHeaderList = await getHeadersSafe();

    let marketingRequestPath = "/";
    let detectedIpCountry: string | null = null;
    if (rawHeaderList) {
      try {
        marketingRequestPath = rawHeaderList.get("x-nn-request-pathname")?.trim() ?? "/";
        detectedIpCountry = detectedIpCountryFromHeaders(rawHeaderList);
      } catch {
        marketingRequestPath = "/";
        detectedIpCountry = null;
      }
    }

    const [marketingRegionCookie, serverGlobalRegionCookie, serverNarrowViewportHint, serverCountryPreference] = await Promise.all([
      readOptionalMarketingRegionToggleForCountry().catch(() => undefined),
      readOptionalGlobalRegionSlugFromCookie().catch(() => null),
      readNarrowViewportHintSafe(),
      readOptionalCountryPreferenceFromCookie().catch(() => null),
    ]);

    const serverRegion: MarketingRegionToggle =
      marketingRegionCookie
      ?? (serverCountryPreference
        ? countryPreferenceToNursenestRegion(serverCountryPreference)
        : resolveDefaultLayoutMarketingExamRegion({
          marketingRegionCookie,
          globalRegionSlug: serverGlobalRegionCookie,
          detectedIpCountry,
        }));

    const trustClientPersistedRegion = marketingRegionCookie !== undefined;

    const marketingCountry = getEffectiveMarketingCountry(
      marketingRequestPath,
      marketingRegionCookie ?? serverRegion,
    );

    return (
      <NursenestRegionRoot serverRegion={serverRegion} trustClientPersistedRegion={trustClientPersistedRegion}>
        <CountryPreferenceRoot serverCountry={serverCountryPreference}>
          <MarketingCountryChromeProvider country={marketingCountry}>
            <MarketingHeaderGlobalRegionServerBridge serverGlobalRegion={serverGlobalRegionCookie}>
              <CheckoutGlobalRegionContextPathStamp />
              {children}
            </MarketingHeaderGlobalRegionServerBridge>
          </MarketingCountryChromeProvider>
        </CountryPreferenceRoot>
      </NursenestRegionRoot>
    );
  } catch {
    // Fallback defaults — never crash the page
    return (
      <NursenestRegionRoot serverRegion={"CA"} trustClientPersistedRegion={false}>
        <CountryPreferenceRoot serverCountry={null}>
          <MarketingCountryChromeProvider country={"canada"}>
            <MarketingHeaderGlobalRegionServerBridge serverGlobalRegion={null}>
              {children}
            </MarketingHeaderGlobalRegionServerBridge>
          </MarketingCountryChromeProvider>
        </CountryPreferenceRoot>
      </NursenestRegionRoot>
    );
  }
}

const MarketingDefaultLocaleLayout = traceLayout(
  import.meta,
  async function MarketingDefaultLocaleLayout({ children }: { children: ReactNode }) {
    const layoutBootT0 = safeNowMs();

    // Fire-and-forget observability — never awaited
    void loadRenderTrace()
      .then((m) => m.renderTrace("marketing_default_layout", { route: "shared-marketing-default" }))
      .catch(() => {});
    void loadMarketingLayoutObservability().catch(() => {});
    void getMarketingDefaultLayoutSentryRuntimePromise().catch(() => {});

    // Early short-circuit for homepage: always use the minimal shell on `/`.
    // During crawl-load incidents the full marketing chrome can become the
    // shared bottleneck for the origin. The homepage must remain a 200 shell
    // even when optional chrome, staff, override, or message dependencies slow
    // down. The env flag still allows forcing the same path in targeted probes.
    try {
      const headerList = await getHeadersSafe();
      const hpEarly = headerList?.get("x-nn-request-pathname")?.trim() ?? "/";

      if (hpEarly === "/" || nnHomeStaticMarketingLayoutEnabled()) {
        if (hpEarly === "/") {
          try {
            layoutStderrTrace(
              "marketing_layout",
              "minimal static marketing shell for /",
              { note: "no Sentry span, no chrome shards" },
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
            if (headerList) {
              staticShellDetectedIp = detectedIpCountryFromHeaders(headerList);
            }
          } catch {
            staticShellDetectedIp = null;
          }

          const staticShellCountryPreference = await readOptionalCountryPreferenceFromCookie().catch(() => null);
          const staticShellServerRegion: MarketingRegionToggle =
            staticShellRegionCookie
            ?? (staticShellCountryPreference
              ? countryPreferenceToNursenestRegion(staticShellCountryPreference)
              : resolveDefaultLayoutMarketingExamRegion({
                marketingRegionCookie: staticShellRegionCookie,
                globalRegionSlug: staticShellGlobalRegion,
                detectedIpCountry: staticShellDetectedIp,
              }));

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
            serverCountryPreference: staticShellCountryPreference,
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

    const marketingDefaultLayoutInner = async () => {
      const perfLayoutT0 = safeNowMs();

      try {
        layoutStderrTrace("marketing_layout", "marketing layout start", {
          route: "shared-marketing-default",
        });

        const resolvedLocale: string = DEFAULT_MARKETING_LOCALE;

        // Fan out all independent reads in parallel — all wrapped in try/catch
        // so no single failure can crash the layout.
        const rawHeaderList = await getHeadersSafe();

        let marketingRequestPath = "/";
        let detectedIpCountry: string | null = null;
        if (rawHeaderList) {
          try {
            marketingRequestPath = rawHeaderList.get("x-nn-request-pathname")?.trim() ?? "/";
            detectedIpCountry = detectedIpCountryFromHeaders(rawHeaderList);
          } catch {
            marketingRequestPath = "/";
            detectedIpCountry = null;
          }
        }

        // Fire staff session in background — never awaited for render
        // SiteHeader + SiteFooter are client components that call useSession()
        // to detect staff roles client-side.
        // Only call during request-time (when headers are available) to avoid contaminating ISR build
        if (rawHeaderList) {
          void getStaffSessionSafe().catch(() => null);
        }
        const staffSession = null; // always null for server render; client-side useSession() handles staff UI

        const [
          serverNarrowViewportHint,
          rawMessages,
          marketingRegionCookie,
          serverGlobalRegionCookie,
          publicContentOverrides,
        ] = await Promise.all([
          readNarrowViewportHintSafe(),
          getMarketingDefaultLayoutChromeMessages().catch((e) => {
            console.error("[marketing-default-layout] failed to load messages", {
              error: e instanceof Error ? e.message : String(e),
            });
            return {} as Record<string, string>;
          }),
          readOptionalMarketingRegionToggleForCountry().catch(() => undefined),
          readOptionalGlobalRegionSlugFromCookie().catch(() => null),
          loadPublicContentOverridesForLocaleSafe(DEFAULT_MARKETING_LOCALE),
        ]);

        let messages: Record<string, string> = rawMessages ?? {};
        const fallbackMessages: Record<string, string> | undefined = undefined;

        try {
          if (shouldEmitNnHomeRouteDiag() && marketingRequestPath === "/") {
            emitNnHomeRouteDiag({
              segment: "layout_marketing_default_enter",
              pathname: marketingRequestPath,
              elapsed_ms: safeNowMs() - perfLayoutT0,
              message_count: Object.keys(messages).length,
            });
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
          // Integrity failure is soft — render continues with fallback messages
        }

        try {
          if (shouldEmitNnHomeRouteDiag() && marketingRequestPath === "/") {
            emitNnHomeRouteDiag({
              segment: "layout_marketing_default_before_shell_return",
              elapsed_ms: safeNowMs() - perfLayoutT0,
            });
          }
        } catch {}

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

        const defaultLayoutSiteFooter = defaultMarketingSiteFooter();
        const authOnly = isAuthOnlyRoute(marketingRequestPath);

        return (
          <MarketingI18nProvider
            key={resolvedLocale}
            locale={resolvedLocale}
            messages={messages}
            fallbackMessages={fallbackMessages}
          >
            <MarketingPublicContentEditProvider isStaff={Boolean(staffSession)}>
              <DeferredRegionShell>
                <MarketingFeedbackShell>
                  <div className="nn-marketing-surface nn-marketing-brand-root flex min-h-screen flex-col">
                    <PremiumLayoutVersionMarker surface="marketing-default" />
                    {!authOnly && <SiteHeaderServer serverHasStaffSession={staffSession != null} />}
                    {!authOnly && shouldLayerMainPageShards(marketingRequestPath) ? (
                      <MarketingMainI18nShards
                        locale={resolvedLocale}
                        publicContentOverrides={publicContentOverrides}
                        trailingChrome={defaultLayoutSiteFooter}
                      >
                        <main className="flex min-h-0 flex-1 flex-col">
                          <MarketingDefaultMainMotionSlot serverNarrowViewportHint={serverNarrowViewportHint}>
                            {children}
                          </MarketingDefaultMainMotionSlot>
                        </main>
                      </MarketingMainI18nShards>
                    ) : authOnly ? (
                      // Auth-only: no site chrome — the auth shell owns the full viewport
                      <MarketingMainI18nShards
                        locale={resolvedLocale}
                        publicContentOverrides={publicContentOverrides}
                        trailingChrome={null}
                      >
                        <main className="flex min-h-0 flex-1 flex-col">
                          <MarketingDefaultMainMotionSlot serverNarrowViewportHint={serverNarrowViewportHint}>
                            {children}
                          </MarketingDefaultMainMotionSlot>
                        </main>
                      </MarketingMainI18nShards>
                    ) : (
                      <>
                        <main className="flex min-h-0 flex-1 flex-col">
                          <MarketingDefaultMainMotionSlot serverNarrowViewportHint={serverNarrowViewportHint}>
                            {children}
                          </MarketingDefaultMainMotionSlot>
                        </main>
                        {defaultLayoutSiteFooter}
                      </>
                    )}
                  </div>
                </MarketingFeedbackShell>
              </DeferredRegionShell>
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

        // 🛡️ Failsafe shell: renders children with minimal chrome even if everything fails above.
        // This is the last line of defense — public routes MUST render.
        const shellMessages = mergeMinimalMarketingLayoutShellMessages({});
        let failsafeGlobalRegion: GlobalRegionSlug | null = null;
        let failsafeServerRegion: MarketingRegionToggle = "CA";
        let failsafeMarketingCountry: CountryCode = "canada";

        try {
          const headerList = await getHeadersSafe();
          const pathname = headerList?.get("x-nn-request-pathname")?.trim() ?? "/";
          failsafeGlobalRegion = await readOptionalGlobalRegionSlugFromCookie().catch(() => null);
          const marketingRegionCookie = await readOptionalMarketingRegionToggleForCountry().catch(() => undefined);
          const detectedIpCountry = headerList ? detectedIpCountryFromHeaders(headerList) : null;

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
                      <PremiumLayoutVersionMarker surface="marketing-default-failsafe" />
                      <MarketingDefaultMainMotionSlot serverNarrowViewportHint={failsafeNarrowHint}>
                        {children}
                      </MarketingDefaultMainMotionSlot>
                      {defaultMarketingSiteFooter()}
                    </MarketingDefaultLayoutChromeFailsafeShell>
                  </MarketingHeaderGlobalRegionServerBridge>
                </MarketingFeedbackShell>
              </MarketingCountryChromeProvider>
            </NursenestRegionRoot>
          </MarketingI18nProvider>
        );
      }
    };

    // ✅ Remove the Sentry span wrapper — it was adding overhead without benefit.
    // The Sentry runtime is loaded in the background and never awaited.
    return marketingDefaultLayoutInner();
  },
  { name: "MarketingDefaultLocaleLayout" },
);

export default MarketingDefaultLocaleLayout;
