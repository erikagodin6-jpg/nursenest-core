import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return (
    <MarketingI18nProvider key={DEFAULT_MARKETING_LOCALE} locale={DEFAULT_MARKETING_LOCALE} messages={messages}>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <div className="nn-marketing-surface flex min-h-screen flex-col bg-[var(--theme-page-bg)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </MarketingI18nProvider>
  );
}
