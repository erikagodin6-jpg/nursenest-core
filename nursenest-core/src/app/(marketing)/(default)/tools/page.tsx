import type { Metadata } from "next";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { ToolsHubClient } from "@/components/tools/tools-hub-client";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_CHROME_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { renderTrace } from "@/lib/observability/render-trace";
import { withSentryServerSpan } from "@/lib/observability/sentry-route-observability";

export const dynamic = "force-dynamic";

const TOOLS_METADATA_KEYS = ["tools.hub.metaTitle", "tools.hub.metaDescription"] as const;

export async function generateMetadata(): Promise<Metadata> {
  return withSentryServerSpan(
    {
      name: "marketing.route.metadata.tools",
      op: "ui.server.metadata",
      attributes: { route: "/tools", routeGroup: "marketing.default.tools" },
    },
    async () => {
      renderTrace("tools metadata start", { route: "/tools" });
      return safeGenerateMetadata(
        async () => {
          const m = await loadMarketingMetadataMessages(
            DEFAULT_MARKETING_LOCALE,
            TOOLS_METADATA_KEYS,
            MARKETING_CHROME_MESSAGE_SHARDS,
          );
          renderTrace("tools metadata after inputs", {
            route: "/tools",
            messageCount: Object.keys(m).length,
          });
          const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/tools");
          return {
            title: m["tools.hub.metaTitle"],
            description: m["tools.hub.metaDescription"],
            alternates: { canonical: alt.canonical, languages: alt.languages },
            openGraph: {
              title: m["tools.hub.metaTitle"],
              description: m["tools.hub.metaDescription"],
              url: alt.canonical,
              type: "website",
            },
          };
        },
        { pathname: "/tools", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.tools" },
      );
    },
  );
}

export default async function ToolsHubPage() {
  return withSentryServerSpan(
    {
      name: "marketing.route.render.tools",
      op: "ui.server.render",
      attributes: { route: "/tools", routeGroup: "marketing.default.tools" },
    },
    async () => {
      renderTrace("tools page start", { route: "/tools" });
      return (
        <>
          <ToolsHubClient />
          <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
            <MarketingStudyCrossLinks />
          </div>
        </>
      );
    },
  );
}
