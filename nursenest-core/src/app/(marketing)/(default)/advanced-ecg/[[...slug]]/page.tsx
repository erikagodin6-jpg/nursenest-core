import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdvancedEcgMarketingPageView } from "@/components/marketing/advanced-ecg-marketing-page";
import { getAdvancedEcgMarketingPageBySegments } from "@/lib/advanced-ecg/advanced-ecg-marketing-pages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAdvancedEcgMarketingPageBySegments(slug);
  if (!page) {
    return {
      title: "Advanced ECG page unavailable | NurseNest",
      robots: { index: false, follow: true },
    };
  }
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage("en", page.path);
      return {
        title: page.title,
        description: page.description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: {
          title: page.title,
          description: page.description,
          url: alt.canonical,
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: page.title,
          description: page.description,
        },
      };
    },
    { pathname: page.path, routeGroup: "marketing.default.advanced-ecg" },
  );
}

export default async function AdvancedEcgMarketingPage({ params }: Props) {
  const { slug } = await params;
  const page = getAdvancedEcgMarketingPageBySegments(slug);
  if (!page) notFound();
  return <AdvancedEcgMarketingPageView locale="en" segments={slug} />;
}
