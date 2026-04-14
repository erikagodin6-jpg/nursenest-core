import type { Metadata } from "next";
import { ExamsJapanHubShell } from "@/components/marketing/exams-japan/exams-japan-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

const PATH = "/exams/japan";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.japan.metaTitle"] ??
    "Nursing Licensing Exams in Japan (2026 Complete Guide)";
  const description =
    messages["exams.japan.metaDescription"] ??
    "Japan National Nursing Examination, MHLW context, domestic licensure, and abroad pathways.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        keywords: [
          "nursing exam Japan",
          "Japan National Nursing Examination",
          "how to become a nurse in Japan",
          "Japanese nursing exam",
          "work abroad for Japanese nurses",
          "NCLEX for Japanese nurses",
          "EPA Japan nursing",
          "看護師国家試験",
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
      routeGroup: "marketing.default.examsJapan",
    },
  );
}

export default async function JapanExamsHubEnglishPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return <ExamsJapanHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
