import type { Metadata } from "next";
import { MarketingVerifyEmailPage } from "@/components/marketing/marketing-verify-email-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesForNoindexUtilityPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

const VERIFY_EMAIL_META_KEYS = ["pages.verifyEmail.title", "pages.verifyEmail.description"] as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...VERIFY_EMAIL_META_KEYS]);
      const alt = marketingAlternatesForNoindexUtilityPage(DEFAULT_MARKETING_LOCALE, "/verify-email");
      return {
        title: m["pages.verifyEmail.title"] ?? "Verify your email · NurseNest",
        description: m["pages.verifyEmail.description"] ?? "Confirm your email to continue adaptive nursing study.",
        alternates: { canonical: alt.canonical },
        robots: { index: false, follow: true },
        openGraph: {
          title: m["pages.verifyEmail.title"] ?? "Verify your email · NurseNest",
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/verify-email", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.auth" },
  );
}

export default async function VerifyEmailPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingVerifyEmailPage locale={locale} />;
}
