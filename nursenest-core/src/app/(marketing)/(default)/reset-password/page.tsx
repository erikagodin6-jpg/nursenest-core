import type { Metadata } from "next";
import { MarketingResetPasswordPage } from "@/components/marketing/marketing-reset-password-page";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new NurseNest password",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingResetPasswordPage locale={locale} token={token} />;
}
