import type { Metadata } from "next";
import { MarketingSignupPage } from "@/components/marketing/marketing-signup-page";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesForNoindexUtilityPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const SIGNUP_META_KEYS = ["pages.signup.title", "pages.signup.description"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(locale, [...SIGNUP_META_KEYS]);
      const alt = marketingAlternatesForNoindexUtilityPage(locale, "/signup");
      return {
        title: m["pages.signup.title"]!,
        description: m["pages.signup.description"]!,
        alternates: { canonical: alt.canonical },
        robots: { index: false, follow: true },
        openGraph: { title: m["pages.signup.title"]!, url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/signup`, locale, routeGroup: "marketing.locale.auth" },
  );
}

export default async function LocalizedSignupPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingSignupPage locale={locale} />;
}
