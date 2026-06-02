import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MarketingLoginPage } from "@/components/marketing/marketing-login-page";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveAuthReturnDestination } from "@/lib/auth/auth-flow-governance";
import { resolveLoginMarketingLocaleFromUrlSegment } from "@/lib/i18n/resolve-login-marketing-locale";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesForNoindexUtilityPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string | string[] | undefined }>;
};

export const dynamic = "force-dynamic";

const LOGIN_META_KEYS = ["pages.login.title", "pages.login.description"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLoginMarketingLocaleFromUrlSegment(locale);
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(resolvedLocale, [...LOGIN_META_KEYS]);
      const alt = marketingAlternatesForNoindexUtilityPage(resolvedLocale, "/login");
      return {
        title: m["pages.login.title"]!,
        description: m["pages.login.description"]!,
        alternates: { canonical: alt.canonical },
        robots: { index: false, follow: true },
        openGraph: { title: m["pages.login.title"]!, url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/login`, locale: resolvedLocale, routeGroup: "marketing.locale.auth" },
  );
}

export default async function LocalizedLoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedLocale = resolveLoginMarketingLocaleFromUrlSegment(locale);
  const session = await getProtectedRouteSession("marketing.localized.login");
  const userId = (session?.user as { id?: string } | undefined)?.id?.trim() ?? "";
  if (userId) {
    const sp = await searchParams;
    const rawCallback = Array.isArray(sp.callbackUrl) ? sp.callbackUrl[0] : sp.callbackUrl;
    redirect(resolveAuthReturnDestination(rawCallback ?? null, { locale: resolvedLocale }) ?? "/app");
  }

  return <MarketingLoginPage localeMode="localized" localeHint={locale} />;
}
