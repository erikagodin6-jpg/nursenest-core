import type { Metadata } from "next";
import { MarketingResetPasswordPage } from "@/components/marketing/marketing-reset-password-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const RESET_PASSWORD_META_KEYS = ["pages.resetPassword.metaTitle", "pages.resetPassword.metaDescription"] as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...RESET_PASSWORD_META_KEYS]);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/reset-password");
      return {
        title: m["pages.resetPassword.metaTitle"]!,
        description: m["pages.resetPassword.metaDescription"]!,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: {
          title: m["pages.resetPassword.metaTitle"]!,
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/reset-password", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.auth" },
  );
}

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingResetPasswordPage locale={locale} token={token} />;
}
