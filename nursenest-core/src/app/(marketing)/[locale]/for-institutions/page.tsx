import type { Metadata } from "next";
import { MarketingForInstitutionsPage } from "@/components/marketing/marketing-for-institutions-page";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

const FOR_INSTITUTIONS_META_KEYS = ["pages.forInstitutions.title", "pages.forInstitutions.description"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(locale, [...FOR_INSTITUTIONS_META_KEYS]);
      const alt = marketingAlternatesSharedPage(locale, "/for-institutions");
      return {
        title: m["pages.forInstitutions.title"]!,
        description: m["pages.forInstitutions.description"]!,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: {
          title: m["pages.forInstitutions.title"]!,
          description: m["pages.forInstitutions.description"]!,
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: `/${locale}/for-institutions`, locale, routeGroup: "marketing.locale.for_institutions" },
  );
}

export default async function LocalizedForInstitutionsPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingForInstitutionsPage locale={locale} />;
}
