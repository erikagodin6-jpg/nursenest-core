import type { Metadata } from "next";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { ToolsHubClient } from "@/components/tools/tools-hub-client";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export async function generateMetadata(): Promise<Metadata> {
  const m = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
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
}

export default function ToolsHubPage() {
  return (
    <>
      <ToolsHubClient />
      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <MarketingStudyCrossLinks />
      </div>
    </>
  );
}
