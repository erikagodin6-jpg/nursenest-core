import type { Metadata } from "next";
import { ExamsFranceHubShell } from "@/components/marketing/exams-france/exams-france-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

const PATH = "/exams/france";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.france.metaTitle"] ?? "Nursing Registration in France (2026 Complete Guide)";
  const description =
    messages["exams.france.metaDescription"] ??
    "Nurse registration France, recognition, French language, EU pathways, Ordre infirmier.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        keywords: [
          "nursing exam France",
          "nurse registration France",
          "how to become a nurse in France",
          "France nurse recognition",
          "work as a nurse in France",
          "Ordre infirmier",
          "infirmier France",
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
      routeGroup: "marketing.default.examsFrance",
    },
  );
}

export default async function FranceExamsHubEnglishPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return <ExamsFranceHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
