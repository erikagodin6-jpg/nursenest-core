import type { Metadata } from "next";
import { FaqLegalMarketingView } from "@/components/legal/faq-legal-marketing-view";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, "/faq");
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
    { pathname: `/${locale}/faq`, locale, routeGroup: "marketing.locale.legal" },
  );
}

export default async function LocalizedFaqPage({ params }: Props) {
  const { locale } = await params;
  return <FaqLegalMarketingView path={`/${locale}/faq`} />;
}
