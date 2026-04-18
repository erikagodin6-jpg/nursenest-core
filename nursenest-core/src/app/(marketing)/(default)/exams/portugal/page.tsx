import type { Metadata } from "next";
import { ExamsPortugalHubShell } from "@/components/marketing/exams-portugal/exams-portugal-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/portugal";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.portugal.metaTitle"] ?? "Nursing Registration in Portugal (2026 Complete Guide)";
  const description =
    messages["exams.portugal.metaDescription"] ??
    "Nurse registration Portugal, recognition, Portuguese language, EU mobility, domestic and foreign pathways.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("portugal"),
        keywords: [
          "nursing exam Portugal",
          "nurse registration Portugal",
          "how to become a nurse in Portugal",
          "Portugal nurse recognition",
          "work as a nurse in Portugal",
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
      routeGroup: "marketing.default.examsPortugal",
    },
  );
}

export default async function PortugalExamsHubEnglishPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return <ExamsPortugalHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
