import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { assertMarketingLayoutMessagesIntegrity } from "@/lib/marketing-i18n/marketing-layout-message-integrity";
import { mergeMinimalMarketingLayoutShellMessages } from "@/lib/marketing-i18n/minimal-marketing-layout-shell-fallback";
import { getMarketingDefaultLayoutChromeMessages } from "@/lib/marketing-i18n/marketing-layout-chrome-messages.server";
import { NursenestRegionRoot } from "@/lib/region/use-nursenest-region";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";
import { MarketingFeedbackShell } from "@/components/feedback/marketing-feedback-shell";
import { homePerfFinalForGetRoot, homePerfLogForGetRoot } from "@/lib/observability/home-perf-trace";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";

/** Single module promise — avoids per-request `import()` bookkeeping on hot marketing layout path. */
const marketingDefaultLayoutSentryRuntimePromise = import("@/lib/observability/sentry-runtime");

/** Keep `pages.*` off the layout merge; load under `<main>` via `MarketingMainI18nShards` (build + runtime). */
function shouldLayerMainPageShards() {
  return true;
}

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  const { withSentryRuntimeSpan, captureSentryRuntimeSoftError } = await marketingDefaultLayoutSentryRuntimePromise;
  return withSentryRuntimeSpan(
    {
      name: "marketing.layout.default.render",
      op: "ui.server.render",
      attributes: { route: "shared-marketing-default", locale: DEFAULT_MARKETING_LOCALE },
    },
    async () => {
      const perfLayoutT0 = Date.now();
      try {
        layoutStderrTrace("marketing_layout", "marketing layout start", { route: "shared-marketing-default" });
        const resolvedLocale: string = DEFAULT_MARKETING_LOCALE;
        const serverRegion: MarketingRegionToggle = "US";
        let messages: Record<string, string> = {};
        let fallbackMessages: Record<string, string> | undefined = undefined;

        try {
          messages = await getMarketingDefaultLayoutChromeMessages();
          fallbackMessages = undefined;
        } catch (e) {
          console.error("[marketing-default-layout] failed to load messages", {
            error: e instanceof Error ? e.message : String(e),
          });
          captureSentryRuntimeSoftError({
            scope: "marketing_layout",
            event: "chrome_messages_failed",
            error: e,
            route: "shared-marketing-default",
            feature: "marketing_layout",
            meta: { locale: DEFAULT_MARKETING_LOCALE },
          });
        }
        messages = mergeMinimalMarketingLayoutShellMessages(messages);
        void homePerfLogForGetRoot("home.server.after_layout_chrome_messages", perfLayoutT0, {
          message_count: Object.keys(messages).length,
        }).catch(() => {
          /* perf must not affect render */
        });
        layoutStderrTrace("marketing_layout", "marketing layout after messages", {
          route: "shared-marketing-default",
          locale: resolvedLocale,
          messageCount: Object.keys(messages).length,
        });
        try {
          assertMarketingLayoutMessagesIntegrity({
            route: "shared-marketing-default",
            locale: resolvedLocale,
            messages,
            fallbackMessages,
          });
        } catch (integrityErr) {
          captureSentryRuntimeSoftError({
            scope: "marketing_layout",
            event: "marketing_layout_integrity_soft_fail",
            error: integrityErr,
            route: "shared-marketing-default",
            feature: "marketing_layout",
            meta: { locale: DEFAULT_MARKETING_LOCALE },
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
                    {shouldLayerMainPageShards() ? (
                      <MarketingMainI18nShards locale={resolvedLocale}>
                        <PageTransitionShell>{children}</PageTransitionShell>
                      </MarketingMainI18nShards>
                    ) : (
                      <PageTransitionShell>{children}</PageTransitionShell>
                    )}
                  </main>
                  <SiteFooter />
                </div>
              </MarketingFeedbackShell>
            </NursenestRegionRoot>
          </MarketingI18nProvider>
        );
      } catch (e) {
        void homePerfFinalForGetRoot("failure", { error_phase: "layout" }).catch(() => {
          /* perf */
        });
        captureSentryRuntimeSoftError({
          scope: "marketing_layout",
          event: "marketing_layout_fatal_soft_shell",
          error: e,
          route: "shared-marketing-default",
          feature: "marketing_layout",
          meta: { locale: DEFAULT_MARKETING_LOCALE },
        });
        const shellMessages = mergeMinimalMarketingLayoutShellMessages({});
        return (
          <MarketingI18nProvider
            key={DEFAULT_MARKETING_LOCALE}
            locale={DEFAULT_MARKETING_LOCALE}
            messages={shellMessages}
            fallbackMessages={undefined}
          >
            <NursenestRegionRoot serverRegion={"US"}>
              <div className="nn-marketing-surface flex min-h-screen flex-col">
                <main className="flex min-h-0 flex-1 flex-col">
                  <PageTransitionShell>{children}</PageTransitionShell>
                </main>
              </div>
            </NursenestRegionRoot>
          </MarketingI18nProvider>
        );
      }
    },
  );
}
