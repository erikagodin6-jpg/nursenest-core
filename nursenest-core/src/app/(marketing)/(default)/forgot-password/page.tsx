import type { Metadata } from "next";
import { MarketingForgotPasswordPage } from "@/components/marketing/marketing-forgot-password-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/forgot-password");
      return {
        title: m["pages.forgotPassword.metaTitle"],
        description: m["pages.forgotPassword.metaDescription"],
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: {
          title: m["pages.forgotPassword.metaTitle"],
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
