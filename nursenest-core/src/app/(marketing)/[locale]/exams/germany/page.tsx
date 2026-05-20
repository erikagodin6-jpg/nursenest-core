import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamsGermanyHubShell } from "@/components/marketing/exams-germany/exams-germany-hub-shell";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/germany";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);
  const title = merged["exams.germany.metaTitle"] ?? merged["exams.germany.title"] ?? "Germany nursing";
  const description =
    merged["exams.germany.metaDescription"] ??
    merged["exams.germany.lead"] ??
    "Nursing recognition in Germany.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("germany"),
        keywords: [
          "nursing exam Germany",
          "nurse recognition Germany",
          "Kenntnisprüfung nursing Germany",
          "how to work as a nurse in Germany",
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
      routeGroup: "marketing.locale.examsGermany",
    },
  );
}

export default async function GermanyExamsHubLocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const merged = await loadMarketingLayoutShardsOverlay(locale);

  return <ExamsGermanyHubShell locale={locale} messages={merged} />;
}
