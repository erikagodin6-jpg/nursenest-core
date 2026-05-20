import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortugalTopicView, parsePortugalTopicParam } from "@/components/marketing/exams-portugal/portugal-topic-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = { params: Promise<{ topic: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const slug = parsePortugalTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages[`exams.portugal.subpage.${slug}.metaTitle`] ??
    messages[`exams.portugal.subpage.${slug}.title`] ??
    "Portugal nursing";
  const description =
    messages[`exams.portugal.subpage.${slug}.metaDescription`] ??
    messages[`exams.portugal.subpage.${slug}.title`] ??
    "Nursing registration in Portugal.";
  const path = `/portugal/${slug}`;

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, path);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("portugal"),
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
      routeGroup: "marketing.default.portugalTopic",
    },
  );
}

export default async function PortugalTopicEnglishPage({ params }: Props) {
  const { topic } = await params;
  const slug = parsePortugalTopicParam(topic);
  if (!slug) notFound();
  return <PortugalTopicView topic={slug} />;
}
