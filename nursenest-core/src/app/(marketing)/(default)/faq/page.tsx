import type { Metadata } from "next";
import { FaqLegalMarketingView } from "@/components/legal/faq-legal-marketing-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export async function generateMetadata(): Promise<Metadata> {
  const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/faq");
  return {
    title: "FAQ | NurseNest",
    description:
      "Answers about NurseNest subscriptions, cancellations, refunds, account sharing, content protection, billing disputes, and privacy.",
    alternates: { canonical: alt.canonical, languages: alt.languages },
    robots: { index: true, follow: true },
    openGraph: {
      title: "FAQ | NurseNest",
      url: alt.canonical,
      type: "website",
    },
  };
}

export default async function FaqPage() {
  return <FaqLegalMarketingView path="/faq" />;
}
