import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import "../(marketing)/marketing-dark-utilities.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return (
    <MarketingI18nProvider key={DEFAULT_MARKETING_LOCALE} locale={DEFAULT_MARKETING_LOCALE} messages={messages}>
      <div className="nn-marketing-surface flex min-h-screen flex-col bg-[var(--theme-page-bg)]">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </MarketingI18nProvider>
  );
}
