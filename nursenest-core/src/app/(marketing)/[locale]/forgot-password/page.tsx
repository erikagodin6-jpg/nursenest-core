import type { Metadata } from "next";
import { MarketingForgotPasswordPage } from "@/components/marketing/marketing-forgot-password-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
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
}

export default async function LocalizedForgotPasswordPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingForgotPasswordPage locale={locale} />;
}
