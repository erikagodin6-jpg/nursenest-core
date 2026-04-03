import type { Metadata } from "next";
import { MarketingSignupPage } from "@/components/marketing/marketing-signup-page";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create your NurseNest Core account",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default async function SignupPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingSignupPage locale={locale} />;
}
