import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticStudySeoView } from "@/components/seo/programmatic-study-seo-view";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { marketingLessonSlugFromRouteParam, marketingProgrammaticStudySeoPath } from "@/lib/lessons/lesson-routes";
import { loadProgrammaticStudySeoPagePayload } from "@/lib/seo/programmatic-study-seo-load";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string; topicSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode, topicSlug } = await params;
  const slugNorm = marketingLessonSlugFromRouteParam(topicSlug);
  const pathname = `/${locale}/${slug}/${examCode}/study/${topicSlug}`;
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
      if (!pathway || !isPathwayPublishedForPublicSite(pathway.id)) return {};
      const canonicalPath = marketingProgrammaticStudySeoPath(pathway, slugNorm);
      if (!canonicalPath) return {};
      const payload = await loadProgrammaticStudySeoPagePayload(pathway, slugNorm);
      if (!payload) return { robots: { index: false, follow: false } };
      const { lesson, introPlainText } = payload;
      const title = `${lesson.topic || lesson.title} — study & practice · ${pathway.displayName} | NurseNest`;
      const description =
        introPlainText.length > 160 ? `${introPlainText.slice(0, 157).trim()}…` : introPlainText;
      const canonical = absoluteUrl(canonicalPath);
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "article", siteName: "NurseNest" },
        twitter: {
          card: "summary_large_image",
          title,
          description: description.length > 160 ? `${description.slice(0, 157)}…` : description,
        },
        robots: { index: true, follow: true },
      };
    },
    { pathname, routeGroup: "marketing.exam_hub.programmatic_study_seo" },
  );
}

export default async function ProgrammaticStudySeoPage({ params }: Props) {
  const { locale, slug, examCode, topicSlug } = await params;
  const slugNorm = marketingLessonSlugFromRouteParam(topicSlug);
  const pathname = `/${locale}/${slug}/${examCode}/study/${topicSlug}`;
  return withCrawlSurfacePageRender("marketing.exam_hub", pathname, async () => {
    const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
    if (!pathway || !isPathwayPublishedForPublicSite(pathway.id)) notFound();
    const canonicalPath = marketingProgrammaticStudySeoPath(pathway, slugNorm);
    if (!canonicalPath) notFound();
    const payload = await loadProgrammaticStudySeoPagePayload(pathway, slugNorm);
    if (!payload) notFound();
    return <ProgrammaticStudySeoView pathway={pathway} payload={payload} canonicalPath={canonicalPath} />;
  });
}
