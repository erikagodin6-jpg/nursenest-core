import type { Metadata } from "next";
import { MarketingResetPasswordPage } from "@/components/marketing/marketing-reset-password-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
  const title = m["pages.resetPassword.metaTitle"] ?? "Reset password";
  const description = m["pages.resetPassword.metaDescription"] ?? "Set a new NurseNest password";
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/reset-password` },
    robots: { index: false, follow: true },
  };
}

export default async function LocalizedResetPasswordPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  return <MarketingResetPasswordPage locale={locale} token={token} />;
}
