import type { Metadata } from "next";
import { MarketingLoginPage } from "@/components/marketing/marketing-login-page";
import { resolveLoginMarketingLocaleFromUrlSegment } from "@/lib/i18n/resolve-login-marketing-locale";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

const LOGIN_META_KEYS = ["pages.login.title", "pages.login.description"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLoginMarketingLocaleFromUrlSegment(locale);
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(resolvedLocale, [...LOGIN_META_KEYS]);
      const alt = marketingAlternatesSharedPage(resolvedLocale, "/login");
      return {
        title: m["pages.login.title"]!,
        description: m["pages.login.description"]!,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: { title: m["pages.login.title"]!, url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/login`, locale: resolvedLocale, routeGroup: "marketing.locale.auth" },
  );
}

export default async function LocalizedLoginPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingLoginPage localeMode="localized" localeHint={locale} />;
}
