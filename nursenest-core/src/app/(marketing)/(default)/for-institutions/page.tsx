import type { Metadata } from "next";
import { MarketingForInstitutionsPage } from "@/components/marketing/marketing-for-institutions-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

const FOR_INSTITUTIONS_METADATA_KEYS = [
  "pages.forInstitutions.title",
  "pages.forInstitutions.description",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(
        DEFAULT_MARKETING_LOCALE,
        FOR_INSTITUTIONS_METADATA_KEYS,
        MARKETING_PAGE_BODY_MESSAGE_SHARDS,
      );
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/for-institutions");
      return {
        title: m["pages.forInstitutions.title"],
        description: m["pages.forInstitutions.description"],
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: {
          title: m["pages.forInstitutions.title"],
          description: m["pages.forInstitutions.description"],
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/for-institutions", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.for_institutions" },
  );
}

export default async function ForInstitutionsPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingForInstitutionsPage locale={locale} />;
}
