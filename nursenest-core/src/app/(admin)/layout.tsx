import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { ADMIN_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const messages = await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, ADMIN_UI_MESSAGE_SHARDS);
  return (
    <MarketingI18nProvider key={DEFAULT_MARKETING_LOCALE} locale={DEFAULT_MARKETING_LOCALE} messages={messages}>
      <MarketingFeedbackShell>
        <div className="nn-marketing-surface flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </MarketingFeedbackShell>
    </MarketingI18nProvider>
  );
}
