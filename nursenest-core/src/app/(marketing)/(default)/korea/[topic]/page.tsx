import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KoreaTopicView, parseKoreaTopicParam } from "@/components/marketing/exams-korea/korea-topic-view";
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
  const slug = parseKoreaTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages[`exams.korea.subpage.${slug}.metaTitle`] ??
    messages[`exams.korea.subpage.${slug}.title`] ??
    "Korea nursing";
  const description =
    messages[`exams.korea.subpage.${slug}.metaDescription`] ??
    messages[`exams.korea.subpage.${slug}.title`] ??
    "Korean national nurse exam.";
  const path = `/korea/${slug}`;

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, path);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("south-korea"),
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
      routeGroup: "marketing.default.koreaTopic",
    },
  );
}

export default async function KoreaTopicEnglishPage({ params }: Props) {
  const { topic } = await params;
  const slug = parseKoreaTopicParam(topic);
  if (!slug) notFound();
  return <KoreaTopicView topic={slug} />;
}
