import type { Metadata } from "next";
import { MarketingForgotPasswordPage } from "@/components/marketing/marketing-forgot-password-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesForNoindexUtilityPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const FORGOT_PASSWORD_META_KEYS = ["pages.forgotPassword.metaTitle", "pages.forgotPassword.metaDescription"] as const;

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...FORGOT_PASSWORD_META_KEYS]);
      const alt = marketingAlternatesForNoindexUtilityPage(DEFAULT_MARKETING_LOCALE, "/forgot-password");
      return {
        title: m["pages.forgotPassword.metaTitle"]!,
        description: m["pages.forgotPassword.metaDescription"]!,
        alternates: { canonical: alt.canonical },
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

export default function ForgotPasswordPage() {
  return <MarketingForgotPasswordPage />;
}
