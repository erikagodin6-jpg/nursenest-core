import type { Metadata } from "next";
import { FaqLegalMarketingView } from "@/components/legal/faq-legal-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "FAQ | NurseNest",
  description:
    "Answers about NurseNest subscriptions, cancellations, refunds, account sharing, content protection, billing disputes, and privacy.",
  alternates: { canonical: absoluteUrl("/faq") },
  robots: { index: true, follow: true },
  openGraph: {
    title: "FAQ | NurseNest",
    url: absoluteUrl("/faq"),
    type: "website",
  },
};

export default async function FaqPage() {
  return <FaqLegalMarketingView path="/faq" />;
}
