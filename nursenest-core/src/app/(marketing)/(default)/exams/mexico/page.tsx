import type { Metadata } from "next";
import { ExamsMexicoHubShell } from "@/components/marketing/exams-mexico/exams-mexico-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/mexico";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingLayoutShardsOverlay(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.mexico.metaTitle"] ?? "Nursing Licensing and Registration in Mexico (2026 Complete Guide)";
  const description =
    messages["exams.mexico.metaDescription"] ??
    "Nurse registration Mexico, nursing licensing, NCLEX for Mexican nurses, and work abroad to the USA and Canada—orientation only.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
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
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.examsMexico",
    },
  );
}

export default async function MexicoExamsHubEnglishPage() {
  const messages = await loadMarketingLayoutShardsOverlay(DEFAULT_MARKETING_LOCALE);
  return <ExamsMexicoHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
