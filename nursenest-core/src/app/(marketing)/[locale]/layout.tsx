import { notFound } from "next/navigation";
import { MarketingLocaleUrlSync } from "@/components/i18n/marketing-locale-url-sync";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE, isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export default async function MarketingLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  /** Cookie sync: `cookies().set` is not allowed in RSC; {@link MarketingLocaleUrlSync} calls the server action. */
  const messages = await loadMarketingMessages(locale);
  const fallbackMessages =
    locale === DEFAULT_MARKETING_LOCALE ? undefined : await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return (
    <MarketingI18nProvider key={locale} locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      <MarketingLocaleUrlSync locale={locale} />
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
