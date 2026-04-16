import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamsMexicoHubShell } from "@/components/marketing/exams-mexico/exams-mexico-hub-shell";
import { DEFAULT_MARKETING_LOCALE, isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/mexico";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };
  const title = merged["exams.mexico.metaTitle"] ?? merged["exams.mexico.title"] ?? "Mexico nursing";
  const description =
    merged["exams.mexico.metaDescription"] ??
    merged["exams.mexico.lead"] ??
    "Nursing registration in Mexico.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("mexico"),
        keywords: [
          "nursing exam Mexico",
          "nurse registration Mexico",
          "how to become a nurse in Mexico",
          "Mexico nurse licensing",
          "NCLEX for Mexican nurses",
          "work abroad for nurses from Mexico",
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
      routeGroup: "marketing.locale.examsMexico",
    },
  );
}

export default async function MexicoExamsHubLocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };

  return <ExamsMexicoHubShell locale={locale} messages={merged} />;
}
