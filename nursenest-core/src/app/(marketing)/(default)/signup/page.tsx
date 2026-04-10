import type { Metadata } from "next";
import { MarketingSignupPage } from "@/components/marketing/marketing-signup-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/signup");
      return {
        title: m["pages.signup.title"],
        description: m["pages.signup.description"],
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: {
          title: m["pages.signup.title"],
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/signup", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.auth" },
  );
}

export default async function SignupPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingSignupPage locale={locale} />;
}
