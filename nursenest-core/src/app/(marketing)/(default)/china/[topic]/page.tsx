import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChinaTopicView, parseChinaTopicParam } from "@/components/marketing/exams-china/china-topic-view";
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
  const slug = parseChinaTopicParam(topic);
  if (!slug) notFound();

  const messages = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title =
    messages[`exams.china.subpage.${slug}.metaTitle`] ??
    messages[`exams.china.subpage.${slug}.title`] ??
    "China nursing";
  const description =
    messages[`exams.china.subpage.${slug}.metaDescription`] ??
    messages[`exams.china.subpage.${slug}.title`] ??
    "China nursing exam and work abroad.";
  const path = `/china/${slug}`;

  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, path);
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("china"),
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
      routeGroup: "marketing.default.chinaTopic",
    },
  );
}

export default async function ChinaTopicEnglishPage({ params }: Props) {
  const { topic } = await params;
  const slug = parseChinaTopicParam(topic);
  if (!slug) notFound();
  return <ChinaTopicView topic={slug} />;
}
