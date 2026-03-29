import type { Metadata } from "next";
import { MarketingLoginPage } from "@/components/marketing/marketing-login-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
  return {
    title: m["pages.login.title"],
    description: m["pages.login.description"],
    alternates: { canonical: `/${locale}/login` },
    robots: { index: false, follow: true },
  };
}

export default async function LocalizedLoginPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingLoginPage locale={locale} />;
}
