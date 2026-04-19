import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { SiteFooterServer } from "@/components/layout/site-footer.server";
import { SiteHeaderServer } from "@/components/layout/site-header.server";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { MarketingSurfaceProviders } from "../marketing-surface-providers";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import {
  MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS,
  MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
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
const MARKETING_BUILD_PHASE = "phase-production-build";

function defaultLayoutMessageShards() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE
    ? MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS
    : MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS;
}

function shouldLayerMainPageShards() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE;
}

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
          loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, defaultLayoutMessageShards()),
          "marketing_layout.chrome_messages",
          MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS,
        );
        messages = loadedMessages ?? {};
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
        <MarketingSurfaceProviders>
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
                  <SiteHeaderServer />
                  <PathwayLessonProgressRefreshListener />
                  <main className="flex min-h-0 flex-1 flex-col">
                    {shouldLayerMainPageShards() ? (
                      <MarketingMainI18nShards locale={resolvedLocale}>
                        <PageTransitionShell>{children}</PageTransitionShell>
                      </MarketingMainI18nShards>
                    ) : (
                      <PageTransitionShell>{children}</PageTransitionShell>
                    )}
                  </main>
                  <SiteFooterServer />
                </div>
              </MarketingFeedbackShell>
            </NursenestRegionRoot>
          </MarketingI18nProvider>
        </MarketingSurfaceProviders>
      );
    },
  );
}
