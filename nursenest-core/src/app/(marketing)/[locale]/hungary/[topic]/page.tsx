import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  HUNGARY_TOPIC_SLUGS,
  HungaryTopicView,
  parseHungaryTopicParam,
} from "@/components/marketing/exams-hungary/hungary-topic-view";
import {
  CORE_HOSTED_MARKETING_LOCALES,
  DEFAULT_MARKETING_LOCALE,
  isCoreHostedNonDefaultLocale,
} from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; topic: string }> };

export function generateStaticParams() {
  const out: { locale: string; topic: string }[] = [];
  for (const loc of CORE_HOSTED_MARKETING_LOCALES) {
    for (const topic of HUNGARY_TOPIC_SLUGS) {
      out.push({ locale: loc, topic });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, topic } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const slug = parseHungaryTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };
  const title =
    merged[`exams.hungary.subpage.${slug}.metaTitle`] ??
    merged[`exams.hungary.subpage.${slug}.title`] ??
    "Hungary nursing";
  const description =
    merged[`exams.hungary.subpage.${slug}.metaDescription`] ??
    merged[`exams.hungary.subpage.${slug}.title`] ??
    "Hungary nursing registration.";
  const path = `/hungary/${slug}`;

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, path);
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
      locale,
      routeGroup: "marketing.locale.hungaryTopic",
    },
  );
}

export default async function HungaryTopicLocalePage({ params }: Props) {
  const { locale, topic } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const slug = parseHungaryTopicParam(topic);
  if (!slug) notFound();
  return <HungaryTopicView topic={slug} />;
}
