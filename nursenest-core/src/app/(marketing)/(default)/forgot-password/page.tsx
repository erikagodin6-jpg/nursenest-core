import type { Metadata } from "next";
import { MarketingForgotPasswordPage } from "@/components/marketing/marketing-forgot-password-page";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your NurseNest password",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: true },
};

export default async function ForgotPasswordPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingForgotPasswordPage locale={locale} />;
}
