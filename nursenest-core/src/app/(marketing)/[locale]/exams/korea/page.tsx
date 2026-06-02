import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamsKoreaHubShell } from "@/components/marketing/exams-korea/exams-korea-hub-shell";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/korea";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);
  const title = merged["exams.korea.metaTitle"] ?? merged["exams.korea.title"] ?? "Korea nursing exams";
  const description =
    merged["exams.korea.metaDescription"] ??
    merged["exams.korea.lead"] ??
    "Korean national nurse exam and international pathways.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, PATH);
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
      locale,
      routeGroup: "marketing.locale.examsKorea",
    },
  );
}

export default async function KoreaExamsHubLocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);

  return <ExamsKoreaHubShell locale={locale} messages={merged} />;
}
