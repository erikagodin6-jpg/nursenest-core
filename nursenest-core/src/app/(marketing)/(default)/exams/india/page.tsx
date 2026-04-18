import type { Metadata } from "next";
import { ExamsIndiaHubShell } from "@/components/marketing/exams-india/exams-india-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/exams/india";
const INDIA_METADATA_KEYS = ["exams.india.metaTitle", "exams.india.metaDescription"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, INDIA_METADATA_KEYS);
  const title = messages["exams.india.metaTitle"] ?? "Nursing Exams in India (2026 Complete Guide)";
  const description =
    messages["exams.india.metaDescription"] ??
    "Nursing exams, Indian Nursing Council, state registration, AIIMS, government jobs, and international pathways for Indian nurses.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("india"),
        keywords: [
          "nursing exam India",
          "Indian Nursing Council exam",
          "how to become a nurse in India",
          "AIIMS nursing exam",
          "India nursing registration process",
          "state nursing council India",
          "NCLEX for Indian nurses",
          "India nurse NCLEX pathway",
          "nursing government jobs India",
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
      routeGroup: "marketing.default.examsIndia",
    },
  );
}

export default async function IndiaExamsHubEnglishPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return <ExamsIndiaHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
