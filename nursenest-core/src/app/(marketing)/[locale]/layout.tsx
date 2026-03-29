import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
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
  const messages = await loadMarketingMessages(locale);
  return (
    <MarketingI18nProvider key={locale} locale={locale} messages={messages}>
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
