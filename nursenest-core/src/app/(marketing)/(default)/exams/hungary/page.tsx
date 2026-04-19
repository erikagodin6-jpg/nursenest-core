import type { Metadata } from "next";
import { ExamsHungaryHubShell } from "@/components/marketing/exams-hungary/exams-hungary-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/hungary";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingLayoutShardsOverlay(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.hungary.metaTitle"] ?? "Nursing Registration in Hungary (2026 Complete Guide)";
  const description =
    messages["exams.hungary.metaDescription"] ??
    "Nurse registration Hungary, recognition, Hungarian language, EU mobility, domestic and foreign pathways.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("hungary"),
        keywords: [
          "nursing exam Hungary",
          "nurse registration Hungary",
          "how to become a nurse in Hungary",
          "Hungarian nurse recognition",
          "work as a nurse in Hungary",
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
      routeGroup: "marketing.default.examsHungary",
    },
  );
}

export default async function HungaryExamsHubEnglishPage() {
  const messages = await loadMarketingLayoutShardsOverlay(DEFAULT_MARKETING_LOCALE);
  return <ExamsHungaryHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
