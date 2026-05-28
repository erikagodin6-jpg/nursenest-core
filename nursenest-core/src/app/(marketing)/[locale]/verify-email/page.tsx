import type { Metadata } from "next";
import { MarketingVerifyEmailPage } from "@/components/marketing/marketing-verify-email-page";
import { resolveLoginMarketingLocaleFromUrlSegment } from "@/lib/i18n/resolve-login-marketing-locale";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesForNoindexUtilityPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const VERIFY_EMAIL_META_KEYS = ["pages.verifyEmail.title", "pages.verifyEmail.description"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLoginMarketingLocaleFromUrlSegment(locale);
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(resolvedLocale, [...VERIFY_EMAIL_META_KEYS]);
      const alt = marketingAlternatesForNoindexUtilityPage(resolvedLocale, "/verify-email");
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
    { pathname: `/${locale}/verify-email`, locale: resolvedLocale, routeGroup: "marketing.locale.auth" },
  );
}

export default async function LocalizedVerifyEmailPage({ params }: Props) {
  const { locale } = await params;
  const resolvedLocale = resolveLoginMarketingLocaleFromUrlSegment(locale);
  return <MarketingVerifyEmailPage locale={resolvedLocale} />;
}
