import type { Metadata } from "next";
import { FaqLegalMarketingView } from "@/components/legal/faq-legal-marketing-view";
import { FaqProductScreenshotsSection } from "@/components/marketing/faq-product-screenshots-section";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
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
    },
    { pathname: "/faq", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.faq" },
  );
}

export default async function FaqPage() {
  return (
    <>
      {/* Legal / billing FAQ (existing markdown-driven content) */}
      <FaqLegalMarketingView path="/faq" />

      {/* Visual product FAQ — what does the platform actually look like? */}
      <FaqProductScreenshotsSection />
    </>
  );
}
