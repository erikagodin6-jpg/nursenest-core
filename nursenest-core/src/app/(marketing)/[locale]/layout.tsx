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
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
import { CheckoutGlobalRegionContextPathStamp } from "@/components/marketing/checkout-global-region-context-path-stamp";
import { MarketingHeaderGlobalRegionServerBridge } from "@/lib/region/marketing-header-global-region-server-bridge";
import { readOptionalGlobalRegionSlugFromCookie } from "@/lib/region/read-optional-global-region-cookie.server";

import { getStaffSession } from "@/lib/auth/staff-session";
const marketingLocaleLayoutSentryRuntimePromise = import("@/lib/observability/sentry-runtime");

export const dynamic = "force-dynamic";

export default async function MarketingLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  let serverRegion: MarketingRegionToggle = "US";
  let messages: Record<string, string> = {};
  let fallbackMessages: Record<string, string> | undefined = undefined;

  try {
    /** Cookie sync: `cookies().set` is not allowed in RSC; {@link MarketingLocaleUrlSync} calls the server action. */
    serverRegion = (await getMarketingRegionFromCookies()) as MarketingRegionToggle;
    const payload = await getMarketingLocaleLayoutChromePayload(locale);
    messages = payload.messages;
    fallbackMessages = payload.fallbackMessages;
  } catch (e) {
    console.error("[marketing-locale-layout] failed to load locale/region data", {
      error: e instanceof Error ? e.message : String(e),
      locale,
    });
    const { captureSentryRuntimeSoftError } = await marketingLocaleLayoutSentryRuntimePromise;
    captureSentryRuntimeSoftError({
      scope: "marketing_layout",
      event: "locale_chrome_failed",
      error: e,
      route: "marketing-locale-layout",
      feature: "marketing_layout",
      meta: { locale },
    });
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
    const { captureSentryRuntimeSoftError } = await marketingLocaleLayoutSentryRuntimePromise;
    captureSentryRuntimeSoftError({
      scope: "marketing_layout",
      event: "locale_layout_integrity_merge",
      error: integrityErr,
      route: "marketing-locale-layout",
      feature: "marketing_layout",
      meta: { locale },
    });
    try {
      messages = mergeMinimalMarketingLayoutShellMessages(await getMarketingDefaultLayoutChromeMessages());
    } catch {
      messages = mergeMinimalMarketingLayoutShellMessages(messages);
    }
  }

  let marketingRequestPath = "/";
  try {
    marketingRequestPath = (await headers()).get("x-nn-request-pathname")?.trim() ?? "/";
  } catch {
    marketingRequestPath = "/";
  }
  const marketingRegionCookie = await readOptionalMarketingRegionToggleForCountry();
  const marketingCountry = getEffectiveMarketingCountry(marketingRequestPath, marketingRegionCookie);
  const serverGlobalRegionCookie = await readOptionalGlobalRegionSlugFromCookie();
  const staffSession = await getStaffSession().catch(() => null);

  return (
    <MarketingI18nProvider key={locale} locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      <NursenestRegionRoot serverRegion={serverRegion}>
        <MarketingCountryChromeProvider country={marketingCountry}>
          <MarketingLocaleUrlSync locale={locale} />
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          <MarketingFeedbackShell>
            <MarketingHeaderGlobalRegionServerBridge serverGlobalRegion={serverGlobalRegionCookie}>
              <CheckoutGlobalRegionContextPathStamp />
              <div className="nn-marketing-surface flex min-h-screen flex-col">
                <SiteHeader serverHasStaffSession={staffSession != null} />
                <main className="flex-1">
                  <MarketingMainI18nShards locale={locale}>
                    <MarketingMainErrorBoundary name="marketing_locale_main">
                      <PageTransitionShell>{children}</PageTransitionShell>
                    </MarketingMainErrorBoundary>
                  </MarketingMainI18nShards>
                </main>
                <SiteFooter serverHasStaffSession={staffSession != null} />
              </div>
            </MarketingHeaderGlobalRegionServerBridge>
          </MarketingFeedbackShell>
        </MarketingCountryChromeProvider>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}
