import type { Metadata } from "next";
import { MarketingForgotPasswordPage } from "@/components/marketing/marketing-forgot-password-page";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

const FORGOT_PASSWORD_META_KEYS = ["pages.forgotPassword.metaTitle", "pages.forgotPassword.metaDescription"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(locale, [...FORGOT_PASSWORD_META_KEYS]);
      const title = m["pages.forgotPassword.metaTitle"] ?? "Forgot password";
      const description = m["pages.forgotPassword.metaDescription"] ?? "Reset your NurseNest password";
      const alt = marketingAlternatesSharedPage(locale, "/forgot-password");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: { title, url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/forgot-password`, locale, routeGroup: "marketing.locale.auth" },
  );
}

export default async function LocalizedForgotPasswordPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingForgotPasswordPage locale={locale} />;
}
