import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  let resolvedLocale: string = DEFAULT_MARKETING_LOCALE;
  let serverRegion: MarketingRegionToggle = "US";
  let messages: Record<string, string> = {};
  let fallbackMessages: Record<string, string> | undefined = undefined;

  try {
    resolvedLocale = await getMarketingLocaleForDefaultRoute();
    serverRegion = (await getMarketingRegionFromCookies()) as MarketingRegionToggle;
    const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
    messages =
      resolvedLocale === DEFAULT_MARKETING_LOCALE ? en : await loadMarketingMessages(resolvedLocale);
    /** Always supply English so missing overlay keys resolve to canonical copy in production. */
    fallbackMessages = en;
  } catch (e) {
    console.error("[marketing-default-layout] failed to load locale/region data", {
      error: e instanceof Error ? e.message : String(e),
      locale: resolvedLocale,
    });
    // Continue with defaults — pages will render in English without crashing.
  }

  return (
    <MarketingI18nProvider
      key={resolvedLocale}
      locale={resolvedLocale}
      messages={messages}
      fallbackMessages={fallbackMessages}
    >
      <NursenestRegionRoot serverRegion={serverRegion}>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <div className="nn-marketing-surface flex min-h-screen flex-col">
          <SiteHeader />
          <PathwayLessonProgressRefreshListener />
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          <SiteFooter />
        </div>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}
