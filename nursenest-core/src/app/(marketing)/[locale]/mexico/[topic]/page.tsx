import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MexicoTopicView, parseMexicoTopicParam } from "@/components/marketing/exams-mexico/mexico-topic-view";
import {
  DEFAULT_MARKETING_LOCALE,
  isCoreHostedNonDefaultLocale,
} from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; topic: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, topic } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const slug = parseMexicoTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const merged = { ...en, ...messages };
  const title =
    merged[`exams.mexico.subpage.${slug}.metaTitle`] ??
    merged[`exams.mexico.subpage.${slug}.title`] ??
    "Mexico nursing";
  const description =
    merged[`exams.mexico.subpage.${slug}.metaDescription`] ??
    merged[`exams.mexico.subpage.${slug}.title`] ??
    "Mexico nursing registration.";
  const path = `/mexico/${slug}`;

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, path);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("mexico"),
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
      routeGroup: "marketing.locale.mexicoTopic",
    },
  );
}

export default async function MexicoTopicLocalePage({ params }: Props) {
  const { locale, topic } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const slug = parseMexicoTopicParam(topic);
  if (!slug) notFound();
  return <MexicoTopicView topic={slug} />;
}
