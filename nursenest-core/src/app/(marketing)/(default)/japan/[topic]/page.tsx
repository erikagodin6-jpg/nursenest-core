import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  JAPAN_TOPIC_SLUGS,
  JapanTopicView,
  parseJapanTopicParam,
} from "@/components/marketing/exams-japan/japan-topic-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return JAPAN_TOPIC_SLUGS.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const slug = parseJapanTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages[`exams.japan.subpage.${slug}.metaTitle`] ??
    messages[`exams.japan.subpage.${slug}.title`] ??
    "Japan nursing";
  const description =
    messages[`exams.japan.subpage.${slug}.metaDescription`] ??
    messages[`exams.japan.subpage.${slug}.title`] ??
    "Japan National Nursing Examination and pathways.";
  const path = `/japan/${slug}`;

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, path);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
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
      routeGroup: "marketing.default.japanTopic",
    },
  );
}

export default async function JapanTopicEnglishPage({ params }: Props) {
  const { topic } = await params;
  const slug = parseJapanTopicParam(topic);
  if (!slug) notFound();
  return <JapanTopicView topic={slug} />;
}
