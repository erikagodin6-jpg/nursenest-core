import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentBackedStudyResourceHubView } from "@/components/seo/content-backed-study-resource-hub-view";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { loadContentBackedStudyResourceHubPayload } from "@/lib/seo/content-backed-study-resource-hub";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string; bodyKey: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode, bodyKey } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/study-resources/${bodyKey}`;
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
      if (!pathway || !isPathwayPublishedForPublicSite(pathway.id)) return {};
      const payload = await loadContentBackedStudyResourceHubPayload(pathway, bodyKey);
      if (!payload) return { robots: { index: false, follow: false } };
      const canonicalPath = buildExamPathwayPath(pathway, `study-resources/${payload.bodyKey}`);
      const canonical = absoluteUrl(canonicalPath);
      const title = `${payload.bodySystemLabel} study resources · ${pathway.displayName} | NurseNest`;
      const description = `Pathway lessons, ${payload.questionCount}+ scoped practice questions, and flashcard previews for ${payload.bodySystemLabel} (${pathway.shortName}).`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "article" },
        robots: { index: true, follow: true },
      };
    },
    { pathname, routeGroup: "marketing.exam_hub.study_resources" },
  );
}

export default async function ContentBackedStudyResourceHubPage({ params }: Props) {
  const { locale, slug, examCode, bodyKey } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/study-resources/${bodyKey}`;
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway || !isPathwayPublishedForPublicSite(pathway.id)) notFound();
  const payload = await loadContentBackedStudyResourceHubPayload(pathway, bodyKey);
  if (!payload) notFound();
  const canonicalPath = buildExamPathwayPath(pathway, `study-resources/${payload.bodyKey}`);
  return <ContentBackedStudyResourceHubView payload={payload} canonicalPath={canonicalPath} />;
}
