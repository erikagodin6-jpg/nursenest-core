import { notFound } from "next/navigation";
import { MarketingLocaleUrlSync } from "@/components/i18n/marketing-locale-url-sync";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE, isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { MarketingMainErrorBoundary } from "@/components/marketing/marketing-main-error-boundary";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";

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
    const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
    messages = locale === DEFAULT_MARKETING_LOCALE ? en : await loadMarketingMessages(locale);
    /** Always supply English so missing overlay keys resolve to canonical copy in production. */
    fallbackMessages = en;
  } catch (e) {
    console.error("[marketing-locale-layout] failed to load locale/region data", {
      error: e instanceof Error ? e.message : String(e),
      locale,
    });
    // Continue with defaults — localized pages render in English without crashing.
  }

  return (
    <MarketingI18nProvider key={locale} locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      <NursenestRegionRoot serverRegion={serverRegion}>
        <MarketingLocaleUrlSync locale={locale} />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <div className="nn-marketing-surface flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <MarketingMainErrorBoundary name="marketing_locale_main">
              <PageTransitionShell>{children}</PageTransitionShell>
            </MarketingMainErrorBoundary>
          </main>
          <SiteFooter />
        </div>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}
