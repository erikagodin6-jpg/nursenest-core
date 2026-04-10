import type { Metadata } from "next";
import { MarketingLoginPage } from "@/components/marketing/marketing-login-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMessages(locale);
      const alt = marketingAlternatesSharedPage(locale, "/login");
      return {
        title: m["pages.login.title"],
        description: m["pages.login.description"],
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: { title: m["pages.login.title"], url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/login`, locale, routeGroup: "marketing.locale.auth" },
  );
}

export default async function LocalizedLoginPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingLoginPage locale={locale} />;
}
