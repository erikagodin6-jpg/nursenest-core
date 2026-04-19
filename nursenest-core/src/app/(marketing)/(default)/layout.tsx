import { MarketingMainI18nShards } from "@/components/i18n/marketing-main-i18n-shards";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { MarketingI18nProvider } from "@/components/marketing/marketing-i18n-provider";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/seo-json-ld";
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

const MARKETING_LAYOUT_MESSAGES_TIMEOUT_MS = 1200;
const MARKETING_BUILD_PHASE = "phase-production-build";
type RenderTraceFn = typeof import("@/lib/observability/render-trace")["renderTrace"];
type MarketingLayoutObservability = Pick<
  typeof import("@/lib/observability/sentry-route-observability"),
  "captureSentrySoftError" | "withSentryServerSpan"
>;

let marketingLayoutRenderTraceCache: RenderTraceFn | null | undefined;
let marketingLayoutObservabilityCache: MarketingLayoutObservability | null | undefined;

function loadRenderTrace(): RenderTraceFn | null {
  if (process.env.NEXT_PHASE === MARKETING_BUILD_PHASE) return null;
  if (marketingLayoutRenderTraceCache !== undefined) return marketingLayoutRenderTraceCache;
  try {
    const moduleId = ["@/lib/observability", "render-trace"].join("/");
    marketingLayoutRenderTraceCache = (require(moduleId) as { renderTrace?: RenderTraceFn }).renderTrace ?? null;
  } catch {
    marketingLayoutRenderTraceCache = null;
  }
  return marketingLayoutRenderTraceCache;
}

function loadMarketingLayoutObservability(): MarketingLayoutObservability | null {
  if (process.env.NEXT_PHASE === MARKETING_BUILD_PHASE) return null;
  if (marketingLayoutObservabilityCache !== undefined) return marketingLayoutObservabilityCache;
  try {
    const moduleId = ["@/lib/observability", "sentry-route-observability"].join("/");
    marketingLayoutObservabilityCache = require(moduleId) as MarketingLayoutObservability;
  } catch {
    marketingLayoutObservabilityCache = null;
  }
  return marketingLayoutObservabilityCache;
}

async function withMarketingLayoutSpan<T>(
  opts: Parameters<NonNullable<MarketingLayoutObservability>["withSentryServerSpan"]>[0],
  fn: () => Promise<T>,
): Promise<T> {
  const observability = loadMarketingLayoutObservability();
  if (!observability) return fn();
  return observability.withSentryServerSpan(opts, fn);
}

function captureMarketingLayoutSoftError(
  opts: Parameters<NonNullable<MarketingLayoutObservability>["captureSentrySoftError"]>[0],
): void {
  loadMarketingLayoutObservability()?.captureSentrySoftError(opts);
}

function defaultLayoutMessageShards() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE
    ? MARKETING_BUILD_LAYOUT_MESSAGE_SHARDS
    : MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS;
}

function shouldLayerMainPageShards() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE;
}

export default async function MarketingDefaultLocaleLayout({ children }: { children: React.ReactNode }) {
  return withMarketingLayoutSpan(
    {
      name: "marketing.layout.default.render",
      op: "ui.server.render",
      attributes: { route: "shared-marketing-default", locale: DEFAULT_MARKETING_LOCALE },
    },
    async () => {
      loadRenderTrace()?.("marketing layout start", { route: "shared-marketing-default" });
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
        captureMarketingLayoutSoftError({
          scope: "marketing_layout",
          event: "chrome_messages_failed",
          error: e,
          route: "shared-marketing-default",
          feature: "marketing_layout",
          meta: { locale: DEFAULT_MARKETING_LOCALE },
        });
      }
      loadRenderTrace()?.("marketing layout after messages", {
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
    },
  );
}
