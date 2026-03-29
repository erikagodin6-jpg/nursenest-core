import type { Metadata } from "next";
import { MarketingSignupPage } from "@/components/marketing/marketing-signup-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
  return {
    title: m["pages.signup.title"],
    description: m["pages.signup.description"],
    alternates: { canonical: `/${locale}/signup` },
    robots: { index: false, follow: true },
  };
}

export default async function LocalizedSignupPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingSignupPage locale={locale} />;
}
