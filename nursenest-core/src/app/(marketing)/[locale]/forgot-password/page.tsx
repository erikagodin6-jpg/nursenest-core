import type { Metadata } from "next";
import { MarketingForgotPasswordPage } from "@/components/marketing/marketing-forgot-password-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
  const title = m["pages.forgotPassword.metaTitle"] ?? "Forgot password";
  const description = m["pages.forgotPassword.metaDescription"] ?? "Reset your NurseNest password";
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/forgot-password` },
    robots: { index: false, follow: true },
  };
}

export default async function LocalizedForgotPasswordPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingForgotPasswordPage locale={locale} />;
}
