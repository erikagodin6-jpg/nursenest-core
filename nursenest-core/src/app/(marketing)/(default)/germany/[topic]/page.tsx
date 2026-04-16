import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GermanyTopicView, parseGermanyTopicParam } from "@/components/marketing/exams-germany/germany-topic-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const slug = parseGermanyTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages[`exams.germany.subpage.${slug}.metaTitle`] ??
    messages[`exams.germany.subpage.${slug}.title`] ??
    "Germany nursing";
  const description =
    messages[`exams.germany.subpage.${slug}.metaDescription`] ??
    messages[`exams.germany.subpage.${slug}.title`] ??
    "Nursing recognition and registration in Germany.";
  const path = `/germany/${slug}`;

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, path);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("germany"),
        openGraph: {
          title,
          description,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: { card: "summary_large_image", title, description },
      };
    },
    {
      pathname: path,
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.germanyTopic",
    },
  );
}

export default async function GermanyTopicEnglishPage({ params }: Props) {
  const { topic } = await params;
  const slug = parseGermanyTopicParam(topic);
  if (!slug) notFound();
  return <GermanyTopicView topic={slug} />;
}
