import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamsMiddleEastHubShell } from "@/components/marketing/exams-middle-east/exams-middle-east-hub-shell";
import { DEFAULT_MARKETING_LOCALE, isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/middle-east";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };
  const title = merged["exams.middleEast.metaTitle"] ?? merged["exams.middleEast.title"] ?? "Middle East nursing exams";
  const description =
    merged["exams.middleEast.metaDescription"] ??
    merged["exams.middleEast.lead"] ??
    "Gulf nursing licensing, Prometric, DHA, HAAD, and expat pathways.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("uae"),
        keywords: [
          "Prometric nursing exam",
          "Saudi nursing exam",
          "DHA exam nursing",
          "HAAD exam nurse",
          "how to work as a nurse in UAE",
          "Gulf nursing license",
          "DataFlow nursing verification",
          "Qatar nursing exam",
          "Middle East nurse licensing",
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
      routeGroup: "marketing.locale.examsMiddleEast",
    },
  );
}

export default async function MiddleEastExamsHubLocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };

  return <ExamsMiddleEastHubShell locale={locale} messages={merged} />;
}
