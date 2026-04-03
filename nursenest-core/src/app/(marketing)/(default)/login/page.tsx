import type { Metadata } from "next";
import { MarketingLoginPage } from "@/components/marketing/marketing-login-page";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to NurseNest Core",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default async function LoginPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingLoginPage locale={locale} />;
}
