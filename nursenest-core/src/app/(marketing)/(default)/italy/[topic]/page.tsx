import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ITALY_TOPIC_SLUGS,
  ItalyTopicView,
  parseItalyTopicParam,
} from "@/components/marketing/exams-italy/italy-topic-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return ITALY_TOPIC_SLUGS.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const slug = parseItalyTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages[`exams.italy.subpage.${slug}.metaTitle`] ??
    messages[`exams.italy.subpage.${slug}.title`] ??
    "Italy nursing";
  const description =
    messages[`exams.italy.subpage.${slug}.metaDescription`] ??
    messages[`exams.italy.subpage.${slug}.title`] ??
    "Nursing registration in Italy.";
  const path = `/italy/${slug}`;

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
      routeGroup: "marketing.default.italyTopic",
    },
  );
}

export default async function ItalyTopicEnglishPage({ params }: Props) {
  const { topic } = await params;
  const slug = parseItalyTopicParam(topic);
  if (!slug) notFound();
  return <ItalyTopicView topic={slug} />;
}
