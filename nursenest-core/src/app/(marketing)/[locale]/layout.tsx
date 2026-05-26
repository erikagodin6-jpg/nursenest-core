import { traceLayout, withBuildTrace, createTraceInfo } from "@/build/tracing";
import { PremiumLayoutVersionMarker } from "@/components/layout/premium-layout-version-marker";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { MarketingCountryChromeProvider } from "@/components/marketing/marketing-country-chrome-context";
import { getEffectiveMarketingCountry } from "@/lib/marketing/get-effective-country";
import { readOptionalMarketingRegionToggleForCountry } from "@/lib/marketing/read-optional-marketing-region-cookie.server";
import { MarketingLocaleUrlSync } from "@/components/i18n/marketing-locale-url-sync";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import {
  getMarketingDefaultLayoutChromeMessages,
  getMarketingLocaleLayoutChromePayload,
} from "@/lib/marketing-i18n/marketing-layout-chrome-messages.server";
import { mergeMinimalMarketingLayoutShellMessages } from "@/lib/marketing-i18n/minimal-marketing-layout-shell-fallback";
import { MarketingMainErrorBoundary } from "@/components/marketing/marketing-main-error-boundary";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { resolveMarketingExamRegionToggle } from "@/lib/marketing/resolve-default-layout-marketing-exam-region";
import { detectedIpCountryFromHeaders } from "@/lib/region/detected-ip-country.server";
import { MarketingMobileMotionShell } from "@/lib/ui/marketing-mobile-motion-shell";
import { readMarketingNarrowViewportServerHint } from "@/lib/marketing/read-marketing-narrow-viewport-hint.server";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
import { CheckoutGlobalRegionContextPathStamp } from "@/components/marketing/checkout-global-region-context-path-stamp";
import { MarketingHeaderGlobalRegionServerBridge } from "@/lib/region/marketing-header-global-region-server-bridge";
import { readOptionalGlobalRegionSlugFromCookie } from "@/lib/region/read-optional-global-region-cookie.server";
import { MarketingPublicContentEditProvider } from "@/components/marketing/marketing-public-content-edit-provider";
const marketingLocaleLayoutSentryRuntimePromise = import("@/lib/observability/sentry-runtime");

// ISR-compatible: headers() wrapped in try/catch with fallbacks (lines 155-161)
// Child routes can specify their own revalidate settings
// This layout degrades gracefully when headers unavailable during static generation
// Removing force-dynamic unlocks ISR for 50-100+ child routes

const publicContentTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "loadMarketingPublicContentOverridesForLocale",
  phase: "layout",
});

const staffSessionTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "getStaffSession",
  phase: "layout",
});

const localeChromeTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "getMarketingLocaleLayoutChromePayload",
  phase: "layout",
});

const defaultChromeTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "getMarketingDefaultLayoutChromeMessages",
  phase: "layout",
});

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

const MarketingLocaleLayout = traceLayout(
  import.meta,
  async function MarketingLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  let messages: Record<string, string> = {};
  let fallbackMessages: Record<string, string> | undefined = undefined;

  try {
    const payload = await withBuildTrace(localeChromeTrace, () => getMarketingLocaleLayoutChromePayload(locale));
    messages = payload.messages;
    fallbackMessages = payload.fallbackMessages;
  } catch (e) {
    console.error("[marketing-locale-layout] failed to load locale/region data", {
      error: e instanceof Error ? e.message : String(e),
      locale,
    });
    try {
      const { captureSentryRuntimeSoftError } = await marketingLocaleLayoutSentryRuntimePromise;
      captureSentryRuntimeSoftError({
        scope: "marketing_layout",
        event: "locale_chrome_failed",
        error: e,
        route: "marketing-locale-layout",
        feature: "marketing_layout",
        meta: { locale },
      });
    } catch {
      /* Sentry import failed — continue without telemetry */
    }
  }
  try {
    assertMarketingLayoutMessagesIntegrity({
      route: "marketing-locale-layout",
      locale,
      messages,
      fallbackMessages,
    });
  } catch (integrityErr) {
    console.error("[marketing-locale-layout] layout message integrity failed — recovering English chrome", {
      error: integrityErr instanceof Error ? integrityErr.message : String(integrityErr),
      locale,
    });
    try {
      const { captureSentryRuntimeSoftError } = await marketingLocaleLayoutSentryRuntimePromise;
      captureSentryRuntimeSoftError({
        scope: "marketing_layout",
        event: "locale_layout_integrity_merge",
        error: integrityErr,
        route: "marketing-locale-layout",
        feature: "marketing_layout",
        meta: { locale },
      });
    } catch {
      /* Sentry import failed — continue without telemetry */
    }
    try {
      messages = mergeMinimalMarketingLayoutShellMessages(
        await withBuildTrace(defaultChromeTrace, () => getMarketingDefaultLayoutChromeMessages()),
      );
    } catch {
      messages = mergeMinimalMarketingLayoutShellMessages(messages);
    }
  }

  let marketingRequestPath = "/";
  let detectedIpCountry: string | null = null;
  try {
    const headerList = await headers();
    marketingRequestPath = headerList.get("x-nn-request-pathname")?.trim() ?? "/";
    detectedIpCountry = detectedIpCountryFromHeaders(headerList);
  } catch {
    marketingRequestPath = "/";
  }
  const marketingRegionCookie = await readOptionalMarketingRegionToggleForCountry();
  const serverGlobalRegionCookie = await readOptionalGlobalRegionSlugFromCookie();
  const examRegionToggle = resolveMarketingExamRegionToggle({
    marketingRegionCookie,
    globalRegionSlug: serverGlobalRegionCookie,
    detectedIpCountry,
  });
  /** When only `nn_global_region` is set to us|canada, keep chrome country aligned with exam region. */
  const marketingCountryToggle: MarketingRegionToggle =
    marketingRegionCookie ??
    (serverGlobalRegionCookie === "us" ? "US" : serverGlobalRegionCookie === "canada" ? "CA" : examRegionToggle);
  const marketingCountry = getEffectiveMarketingCountry(marketingRequestPath, marketingCountryToggle);
  // PERF: getStaffSessionSafe() removed from blocking Promise.all — saves ~100ms TTFB.
  // Header/footer are client components with useSession(); staff UI activates client-side.
  void Promise.resolve(withBuildTrace(staffSessionTrace, () => getStaffSessionSafe())).catch(() => null);
  const staffSession = null;
  const [publicContentOverrides, serverNarrowViewportHint] = await Promise.all([
    withBuildTrace(publicContentTrace, () => loadPublicContentOverridesForLocaleSafe(locale)),
    readMarketingNarrowViewportServerHint(),
  ]);

  return (
    <MarketingI18nProvider key={locale} locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      <MarketingPublicContentEditProvider isStaff={Boolean(staffSession)}>
        <NursenestRegionRoot
          serverRegion={examRegionToggle}
          trustClientPersistedRegion={marketingRegionCookie !== undefined}
        >
          <MarketingCountryChromeProvider country={marketingCountry}>
            <MarketingLocaleUrlSync locale={locale} />
            <OrganizationJsonLd />
            <WebSiteJsonLd />
            <MarketingFeedbackShell>
              <MarketingHeaderGlobalRegionServerBridge serverGlobalRegion={serverGlobalRegionCookie}>
                <CheckoutGlobalRegionContextPathStamp />
                <div className="nn-marketing-surface nn-marketing-brand-root flex min-h-screen flex-col">
                  <SiteHeader serverHasStaffSession={staffSession != null} />
                  <MarketingMainI18nShards
                    locale={locale}
                    publicContentOverrides={publicContentOverrides}
                    trailingChrome={<SiteFooter />}
                  >
                    <main className="flex min-h-0 flex-1 flex-col">
                      <MarketingMainErrorBoundary name="marketing_locale_main">
                        <PremiumLayoutVersionMarker surface="marketing-locale" />
                        <MarketingMobileMotionShell serverNarrowViewportHint={serverNarrowViewportHint}>
                          {children}
                        </MarketingMobileMotionShell>
                      </MarketingMainErrorBoundary>
                    </main>
                  </MarketingMainI18nShards>
                </div>
              </MarketingHeaderGlobalRegionServerBridge>
            </MarketingFeedbackShell>
          </MarketingCountryChromeProvider>
        </NursenestRegionRoot>
      </MarketingPublicContentEditProvider>
    </MarketingI18nProvider>
  );
  },
  { name: "MarketingLocaleLayout" },
);

export default MarketingLocaleLayout;
