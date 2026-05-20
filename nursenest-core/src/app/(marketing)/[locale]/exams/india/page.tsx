import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamsIndiaHubShell } from "@/components/marketing/exams-india/exams-india-hub-shell";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/india";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);
  const title = merged["exams.india.metaTitle"] ?? merged["exams.india.title"] ?? "Nursing Exams in India";
  const description =
    merged["exams.india.metaDescription"] ??
    merged["exams.india.lead"] ??
    "Nursing exams and registration in India.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, PATH);
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
      locale,
      routeGroup: "marketing.locale.examsIndia",
    },
  );
}

export default async function IndiaExamsHubLocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);

  return <ExamsIndiaHubShell locale={locale} messages={merged} />;
}
