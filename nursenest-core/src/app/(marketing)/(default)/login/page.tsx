import type { Metadata } from "next";
import { MarketingLoginPage } from "@/components/marketing/marketing-login-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";


export const dynamic = "force-dynamic";

const LOGIN_META_KEYS = ["pages.login.title", "pages.login.description"] as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...LOGIN_META_KEYS]);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/login");
      return {
        title: m["pages.login.title"]!,
        description: m["pages.login.description"]!,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: {
          title: m["pages.login.title"]!,
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/login", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.auth" },
  );
}

export default async function LoginPage() {
  /**
   * Unprefixed marketing layout pins `MarketingI18nProvider` + `pages` shards to English (`DEFAULT_MARKETING_LOCALE`).
   * Using the locale cookie here caused SSR/client drift and missing keys vs `<main>` shard merges.
   */
  return <MarketingLoginPage localeMode="pinned-english" />;
}
