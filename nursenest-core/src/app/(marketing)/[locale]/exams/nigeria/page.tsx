import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamsNigeriaHubShell } from "@/components/marketing/exams-nigeria/exams-nigeria-hub-shell";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/exams/nigeria";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);
  const title = merged["exams.nigeria.metaTitle"] ?? merged["exams.nigeria.title"] ?? "Nigeria RN Licensure";
  const description =
    merged["exams.nigeria.metaDescription"] ??
    merged["exams.nigeria.lead"] ??
    "NMCN RN licensure orientation.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("nigeria"),
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
      routeGroup: "marketing.locale.examsNigeria",
    },
  );
}

export default async function NigeriaExamsHubLocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);
  return <ExamsNigeriaHubShell locale={locale} messages={merged} />;
}
