import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  const resolvedLocale = await getMarketingLocaleForDefaultRoute();
  const messages = await loadMarketingMessages(resolvedLocale);
  return (
    <MarketingI18nProvider
      key={resolvedLocale}
      locale={resolvedLocale}
      messages={messages}
    >
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <div className="nn-marketing-surface flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </MarketingI18nProvider>
  );
}
