import type { Metadata } from "next";
import { MarketingResetPasswordPage } from "@/components/marketing/marketing-reset-password-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export async function generateMetadata(): Promise<Metadata> {
  const m = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/reset-password");
  return {
    title: m["pages.resetPassword.metaTitle"],
    description: m["pages.resetPassword.metaDescription"],
    alternates: { canonical: alt.canonical, languages: alt.languages },
    robots: { index: false, follow: true },
    openGraph: {
      title: m["pages.resetPassword.metaTitle"],
      url: alt.canonical,
      type: "website",
    },
  };
}

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingResetPasswordPage locale={locale} token={token} />;
}
