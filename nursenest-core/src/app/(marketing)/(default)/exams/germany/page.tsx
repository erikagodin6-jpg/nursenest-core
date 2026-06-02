import type { Metadata } from "next";
import { ExamsGermanyHubShell } from "@/components/marketing/exams-germany/exams-germany-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/germany";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingLayoutShardsOverlay(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.germany.metaTitle"] ??
    "Nursing Registration and Recognition in Germany (2026 Complete Guide)";
  const description =
    messages["exams.germany.metaDescription"] ??
    "Anerkennung, Kenntnisprüfung, B2 German, EU vs non-EU nursing pathways in Germany.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("germany"),
        keywords: [
          "nursing exam Germany",
          "nurse recognition Germany",
          "Anerkennung nurse Germany",
          "Kenntnisprüfung nursing Germany",
          "how to work as a nurse in Germany",
          "German nurse registration",
          "Pflege Anerkennung",
        ],
        openGraph: {
          title,
          description,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
        },
      };
    },
    {
      pathname: PATH,
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.examsGermany",
    },
  );
}

export default async function GermanyExamsHubEnglishPage() {
  const messages = await loadMarketingLayoutShardsOverlay(DEFAULT_MARKETING_LOCALE);
  return <ExamsGermanyHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
