import type { Metadata } from "next";
import { ExamsMiddleEastHubShell } from "@/components/marketing/exams-middle-east/exams-middle-east-hub-shell";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


export const revalidate = 86400;

const PATH = "/exams/middle-east";

export async function generateMetadata(): Promise<Metadata> {
  const messages = await loadMarketingLayoutShardsOverlay(DEFAULT_MARKETING_LOCALE);
  const title =
    messages["exams.middleEast.metaTitle"] ??
    "Nursing Licensing Exams in the Middle East (Saudi, UAE, Qatar 2026 Guide)";
  const description =
    messages["exams.middleEast.metaDescription"] ??
    "Prometric nursing exam, Saudi nursing exam, DHA exam nursing, HAAD exam nurse, and how to work as a nurse in UAE.";

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
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
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.examsMiddleEast",
    },
  );
}

export default async function MiddleEastExamsHubEnglishPage() {
  const messages = await loadMarketingLayoutShardsOverlay(DEFAULT_MARKETING_LOCALE);
  return <ExamsMiddleEastHubShell locale={DEFAULT_MARKETING_LOCALE} messages={messages} />;
}
