import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PathwayLessonDetailPageLoadingFallback } from "@/components/lessons/pathway-lesson-detail-loading-fallback";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import { marketingLessonSlugFromRouteParam } from "@/lib/lessons/lesson-routes";
import { loadPathwayLessonSeoMetaWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { mergePathwayLessonPublicMetadata } from "@/lib/seo/programmatic-seo-engine/lesson-public-metadata";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";
import { PathwayLessonDetailPageBody } from "./pathway-lesson-detail-page-body";

/**
 * Paywall: full `PathwayLessonRecord` / `sections[]` stay in the body server component. Gate with
 * `canViewFullPathwayLesson` / `visibleSectionsForLesson` before rendering; pass only thin props into
 * `"use client"` surfaces (see `marketing-pathway-lesson-client-contract.ts`). Subscriber-only supplements
 * (takeaways, memory anchor, traps) render only when `fullAccess` is true.
 */

/** Avoid enumerating every lesson at build (large `.next` output + ENOSPC on small disks). */
export const dynamic = "force-dynamic";
export const dynamicParams = true;
/**
 * Per-request render (no shared ISR snapshot). `maxDuration` allows cold DB + related queries under load.
 */
export const maxDuration = 60;

type Props = {
  /** `locale` is pathway countrySlug (`us` / `canada`), not BCP-47 lesson content. */
  params: Promise<{ locale: string; slug: string; examCode: string; lessonSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug: lessonSlugRaw } = await params;
  const lessonSlug = marketingLessonSlugFromRouteParam(lessonSlugRaw) || lessonSlugRaw;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/${lessonSlugRaw}`;
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, {
        pathname,
      });
      const lesson = pathway
        ? await loadPathwayLessonSeoMetaWithLegacySlugRedirect(pathway, lessonSlug)
        : undefined;
      if (!pathway || !lesson) return {};
      if (!lesson.publicComplete) {
        return { title: "Lesson", robots: { index: false, follow: false } };
      }
      const path = pathwayLessonPublicDetailPath(pathway, lesson.slug);
      if (!path) return {};
      const canonical = absoluteUrl(path);
      const merged = mergePathwayLessonPublicMetadata({
        pathway,
        lesson: {
          title: lesson.seoTitle.trim() || lesson.topic,
          topic: lesson.topic,
          bodySystem: lesson.bodySystem,
          seoTitle: lesson.seoTitle,
          seoDescription: lesson.seoDescription,
        },
      });
      const twDesc =
        merged.description.description.length > 160
          ? `${merged.description.description.slice(0, 157)}…`
          : merged.description.description;
      return {
        title: merged.title.title,
        description: merged.description.description,
        keywords: merged.keywords,
        alternates: { canonical },
        openGraph: {
          title: merged.title.title,
          description: merged.description.description,
          url: canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: merged.title.title,
          description: twDesc,
        },
        robots: { index: true, follow: true },
      };
    },
    { pathname, locale: countrySlug, routeGroup: "marketing.exam_hub.lesson_detail" },
  );
}

/**
 * Resolve pathway from URL synchronously, then stream the heavy lesson document behind Suspense so the
 * route never shows `lessons/loading.tsx` hub skeleton (which lacked `header[data-nn-pathway-id]`).
 */
export default async function PathwayLessonDetailPage({ params }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug: lessonSlugRaw } = await params;
  const lessonSlug = marketingLessonSlugFromRouteParam(lessonSlugRaw) || lessonSlugRaw;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/${lessonSlugRaw}`;
  return withCrawlSurfacePageRender("marketing.pathway_lesson", pathname, async () => {
    const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
    if (!pathway) notFound();

    return (
      <Suspense fallback={<PathwayLessonDetailPageLoadingFallback pathway={pathway} />}>
        <PathwayLessonDetailPageBody pathway={pathway} pathname={pathname} lessonSlug={lessonSlug} />
      </Suspense>
    );
  });
}
