import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGlobalCommandPalette } from "@/components/admin/admin-global-command-palette";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
import { MarketingI18nProvider } from "@/components/i18n/marketing-i18n-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { ADMIN_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

export const dynamic = "force-dynamic";

/** Heavy DB-backed admin UIs; avoid platform timeouts during cold DB + large aggregates. */
export const maxDuration = 120;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  let messages: Awaited<ReturnType<typeof loadMarketingMessageShards>> = {};
  try {
    messages = await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, ADMIN_LAYOUT_MESSAGE_SHARDS);
  } catch (e) {
    console.error("[AdminGroupLayout] loadMarketingMessageShards", e);
  }
  return (
    <MarketingI18nProvider key={DEFAULT_MARKETING_LOCALE} locale={DEFAULT_MARKETING_LOCALE} messages={messages}>
      <MarketingFeedbackShell>
        <div className="nn-marketing-surface flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <Suspense fallback={null}>
            <AdminGlobalCommandPalette />
          </Suspense>
          <SiteFooter />
        </div>
      </MarketingFeedbackShell>
    </MarketingI18nProvider>
  );
}
