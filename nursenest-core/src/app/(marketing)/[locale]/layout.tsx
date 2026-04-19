import { notFound } from "next/navigation";
import { MarketingLocaleUrlSync } from "@/components/i18n/marketing-locale-url-sync";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import { getMarketingLocaleLayoutChromePayload } from "@/lib/marketing-i18n/marketing-layout-chrome-messages.server";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { MarketingMainErrorBoundary } from "@/components/marketing/marketing-main-error-boundary";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
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
    const { captureSentryRuntimeSoftError } = await import("@/lib/observability/sentry-runtime");
    captureSentryRuntimeSoftError({
      scope: "marketing_layout",
      event: "locale_chrome_failed",
      error: e,
      route: "marketing-locale-layout",
      feature: "marketing_layout",
      meta: { locale },
    });
  }
  assertMarketingLayoutMessagesIntegrity({
    route: "marketing-locale-layout",
    locale,
    messages,
    fallbackMessages,
  });

  return (
    <MarketingI18nProvider key={locale} locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      <NursenestRegionRoot serverRegion={serverRegion}>
        <MarketingLocaleUrlSync locale={locale} />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <MarketingFeedbackShell>
          <div className="nn-marketing-surface flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              <MarketingMainI18nShards locale={locale}>
                <MarketingMainErrorBoundary name="marketing_locale_main">
                  <PageTransitionShell>{children}</PageTransitionShell>
                </MarketingMainErrorBoundary>
              </MarketingMainI18nShards>
            </main>
            <SiteFooter />
          </div>
        </MarketingFeedbackShell>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}
