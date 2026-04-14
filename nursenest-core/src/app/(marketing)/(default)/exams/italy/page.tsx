import type { Metadata } from "next";
import { ExamsItalyHubShell } from "@/components/marketing/exams-italy/exams-italy-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

const PATH = "/exams/italy";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.italy.metaTitle"] ?? "Nursing Registration in Italy (2026 Complete Guide)";
  const description =
    messages["exams.italy.metaDescription"] ??
    "Nurse registration Italy, OPI recognition, Italian language, EU mobility, foreign pathways.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        keywords: [
          "nursing exam Italy",
          "nurse registration Italy",
          "how to become a nurse in Italy",
          "Italy nurse recognition",
          "work as a nurse in Italy",
          "OPI infermieri",
          "infermiere Italia",
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
      routeGroup: "marketing.default.examsItaly",
    },
  );
}

export default async function ItalyExamsHubEnglishPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return <ExamsItalyHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
