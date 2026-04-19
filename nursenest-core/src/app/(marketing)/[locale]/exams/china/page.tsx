import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamsChinaHubShell } from "@/components/marketing/exams-china/exams-china-hub-shell";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/china";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);
  const title = merged["exams.china.metaTitle"] ?? merged["exams.china.title"] ?? "China nursing exams";
  const description =
    merged["exams.china.metaDescription"] ??
    merged["exams.china.lead"] ??
    "NNQE, National Health Commission context, and work abroad pathways.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, PATH);
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
      locale,
      routeGroup: "marketing.locale.examsChina",
    },
  );
}

export default async function ChinaExamsHubLocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);

  return <ExamsChinaHubShell locale={locale} messages={merged} />;
}
