import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  assertMarketingLayoutMessagesIntegrity,
  resolveDefaultEnglishMarketingLayoutMessages,
} from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
import { safeAwait } from "@/lib/async/safe-await";
import { renderTrace } from "@/lib/observability/render-trace";
import {
  captureSentrySoftError,
  withSentryServerSpan,
} from "@/lib/observability/sentry-route-observability";

const MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS = 1200;

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  return withSentryServerSpan(
    {
      name: "marketing.layout.default.render",
      op: "ui.server.render",
      attributes: { route: "shared-marketing-default", locale: DEFAULT_MARKETING_LOCALE },
    },
    async () => {
      renderTrace("marketing layout start", { route: "shared-marketing-default" });
      const resolvedLocale: string = DEFAULT_MARKETING_LOCALE;
      const serverRegion: MarketingRegionToggle = "US";
      let messages: Record<string, string> = {};
      let fallbackMessages: Record<string, string> | undefined = undefined;

      try {
        const loadedMessages = await safeAwait(
          loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS),
          "marketing_layout.chrome_messages",
          MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS,
        );
        messages = resolveDefaultEnglishMarketingLayoutMessages({
          route: "shared-marketing-default",
          messages: loadedMessages ?? {},
        });
        fallbackMessages = undefined;
      } catch (e) {
        console.error("[marketing-default-layout] failed to load messages", {
          error: e instanceof Error ? e.message : String(e),
        });
        captureSentrySoftError({
          scope: "marketing_layout",
          event: "chrome_messages_failed",
          error: e,
          route: "shared-marketing-default",
          feature: "marketing_layout",
          meta: { locale: DEFAULT_MARKETING_LOCALE },
        });
      }
      renderTrace("marketing layout after messages", {
        route: "shared-marketing-default",
        locale: resolvedLocale,
        messageCount: Object.keys(messages).length,
      });
      assertMarketingLayoutMessagesIntegrity({
        route: "shared-marketing-default",
        locale: resolvedLocale,
        messages,
        fallbackMessages,
      });

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
                  <PageTransitionShell>{children}</PageTransitionShell>
                </main>
                <SiteFooter />
              </div>
            </MarketingFeedbackShell>
          </NursenestRegionRoot>
        </MarketingI18nProvider>
      );
    },
  );
}
