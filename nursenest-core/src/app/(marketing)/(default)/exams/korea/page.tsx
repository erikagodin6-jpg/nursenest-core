import type { Metadata } from "next";
import { ExamsKoreaHubShell } from "@/components/marketing/exams-korea/exams-korea-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/korea";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.korea.metaTitle"] ??
    "Korean Nursing Licensing Examination & International Pathways (2026 Guide)";
  const description =
    messages["exams.korea.metaDescription"] ??
    "Korean national nurse exam, Korea Health Personnel Licensing Examination Institute context, and abroad pathways.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("south-korea"),
        keywords: [
          "nursing exam Korea",
          "Korean Nursing Licensing Examination",
          "how to become a nurse in Korea",
          "Korean nurse license exam",
          "work abroad for Korean nurses",
          "NCLEX for Korean nurses",
          "KHPLEI",
          "Korea Health Personnel Licensing Examination Institute",
          "South Korea nurse exam",
          "Korean nurse UK NMC",
          "Korean nurse Australia",
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
      routeGroup: "marketing.default.examsKorea",
    },
  );
}

export default async function KoreaExamsHubEnglishPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return <ExamsKoreaHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
