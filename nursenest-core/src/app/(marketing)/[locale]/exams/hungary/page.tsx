import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamsHungaryHubShell } from "@/components/marketing/exams-hungary/exams-hungary-hub-shell";
import { DEFAULT_MARKETING_LOCALE, isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/hungary";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };
  const title = merged["exams.hungary.metaTitle"] ?? merged["exams.hungary.title"] ?? "Hungary nursing";
  const description =
    merged["exams.hungary.metaDescription"] ??
    merged["exams.hungary.lead"] ??
    "Nursing registration in Hungary.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("hungary"),
        keywords: [
          "nursing exam Hungary",
          "nurse registration Hungary",
          "how to become a nurse in Hungary",
          "Hungarian nurse recognition",
          "work as a nurse in Hungary",
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
      routeGroup: "marketing.locale.examsHungary",
    },
  );
}

export default async function HungaryExamsHubLocalePage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };

  return <ExamsHungaryHubShell locale={locale} messages={merged} />;
}
