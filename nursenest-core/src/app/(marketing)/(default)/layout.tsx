import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";

export const dynamic = "force-dynamic";

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  const resolvedLocale: string = DEFAULT_MARKETING_LOCALE;
  const serverRegion: MarketingRegionToggle = "US";
  let messages: Record<string, string> = {};
  let fallbackMessages: Record<string, string> | undefined = undefined;

  try {
    messages = await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_CHROME_MESSAGE_SHARDS);
    fallbackMessages = undefined;
  } catch (e) {
    console.error("[marketing-default-layout] failed to load messages", {
      error: e instanceof Error ? e.message : String(e),
    });
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
        <MarketingFeedbackShell>
          <div className="nn-marketing-surface flex min-h-screen flex-col">
            <SiteHeader />
            <PathwayLessonProgressRefreshListener />
            <main className="flex min-h-0 flex-1 flex-col">
              <MarketingMainI18nShards locale={DEFAULT_MARKETING_LOCALE}>
                <PageTransitionShell>{children}</PageTransitionShell>
              </MarketingMainI18nShards>
            </main>
            <SiteFooter />
          </div>
        </MarketingFeedbackShell>
      </NursenestRegionRoot>
    </MarketingI18nProvider>
  );
}
