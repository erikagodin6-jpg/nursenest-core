import type { Metadata } from "next";
import { ToolsHubClient } from "@/components/tools/tools-hub-client";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
  return {
    title: m["tools.hub.metaTitle"],
    description: m["tools.hub.metaDescription"],
    alternates: { canonical: `/${locale}/tools` },
  };
}

export default function LocalizedToolsHubPage() {
  return <ToolsHubClient />;
}
