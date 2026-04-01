import type { Metadata } from "next";
import { FaqLegalMarketingView } from "@/components/legal/faq-legal-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = `/${locale}/faq`;
  return {
    title: "FAQ | NurseNest",
    description:
      "Answers about NurseNest subscriptions, cancellations, refunds, account sharing, content protection, billing disputes, and privacy.",
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
    openGraph: {
      title: "FAQ | NurseNest",
      url: absoluteUrl(path),
      type: "website",
    },
  };
}

export default async function LocalizedFaqPage({ params }: Props) {
  const { locale } = await params;
  return <FaqLegalMarketingView path={`/${locale}/faq`} />;
}
