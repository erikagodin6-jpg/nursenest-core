import type { Metadata } from "next";
import { ExamsAustraliaHubShell } from "@/components/marketing/exams-australia/exams-australia-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

const PATH = "/exams/australia";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.australia.metaTitle"] ??
    "Nursing Registration in Australia (AHPRA, OSCE, Bridging Programs 2026 Guide)";
  const description =
    messages["exams.australia.metaDescription"] ??
    "AHPRA nursing registration, OSCE nursing Australia, OBA, and how to become a nurse in Australia.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        keywords: [
          "nursing exam Australia",
          "AHPRA nursing registration",
          "OSCE nursing Australia",
          "how to become a nurse in Australia",
          "Australia nursing exam for international nurses",
          "OBA nursing Australia",
          "NMBA registration",
          "internationally qualified nurse Australia",
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
      routeGroup: "marketing.default.examsAustralia",
    },
  );
}

export default async function AustraliaExamsHubEnglishPage() {
  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  return <ExamsAustraliaHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
