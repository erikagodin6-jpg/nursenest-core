import type { Metadata } from "next";
import { MarketingForgotPasswordPage } from "@/components/marketing/marketing-forgot-password-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const FORGOT_PASSWORD_META_KEYS = ["pages.forgotPassword.metaTitle", "pages.forgotPassword.metaDescription"] as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...FORGOT_PASSWORD_META_KEYS]);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/forgot-password");
      return {
        title: m["pages.forgotPassword.metaTitle"]!,
        description: m["pages.forgotPassword.metaDescription"]!,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: {
          title: m["pages.forgotPassword.metaTitle"]!,
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/forgot-password", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.auth" },
  );
}

export default async function ForgotPasswordPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingForgotPasswordPage locale={locale} />;
}
