import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PORTUGAL_TOPIC_SLUGS,
  PortugalTopicView,
  parsePortugalTopicParam,
} from "@/components/marketing/exams-portugal/portugal-topic-view";
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
    for (const topic of PORTUGAL_TOPIC_SLUGS) {
      out.push({ locale: loc, topic });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, topic } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const slug = parsePortugalTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };
  const title =
    merged[`exams.portugal.subpage.${slug}.metaTitle`] ??
    merged[`exams.portugal.subpage.${slug}.title`] ??
    "Portugal nursing";
  const description =
    merged[`exams.portugal.subpage.${slug}.metaDescription`] ??
    merged[`exams.portugal.subpage.${slug}.title`] ??
    "Portugal nursing registration.";
  const path = `/portugal/${slug}`;

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
      routeGroup: "marketing.locale.portugalTopic",
    },
  );
}

export default async function PortugalTopicLocalePage({ params }: Props) {
  const { locale, topic } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const slug = parsePortugalTopicParam(topic);
  if (!slug) notFound();
  return <PortugalTopicView topic={slug} />;
}
