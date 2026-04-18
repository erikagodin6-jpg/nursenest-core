import type { Metadata } from "next";
import { ExamsChinaHubShell } from "@/components/marketing/exams-china/exams-china-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/china";
const CHINA_METADATA_KEYS = ["exams.china.metaTitle", "exams.china.metaDescription"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, CHINA_METADATA_KEYS);
  const title =
    messages["exams.china.metaTitle"] ??
    "Nursing in China: National Nurse Qualification Examination & Working Abroad (2026 Guide)";
  const description =
    messages["exams.china.metaDescription"] ??
    "China nursing exam, National Health Commission, NNQE, and pathways to Canada, US, and UK.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("china"),
        keywords: [
          "National Nurse Qualification Examination",
          "NNQE China",
          "China nursing exam",
          "National Health Commission nursing",
          "护士执业资格考试",
          "NCLEX for Chinese nurses",
          "nurse working abroad from China",
          "China nurse Canada pathway",
          "China nurse Australia AHPRA",
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
      routeGroup: "marketing.default.examsChina",
    },
  );
}

export default async function ChinaExamsHubEnglishPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return <ExamsChinaHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
