import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PathwayLessonDetailPageLoadingFallback } from "@/components/lessons/pathway-lesson-detail-loading-fallback";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import { loadPathwayLessonSeoMetaWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
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
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/${lessonSlug}`;
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
      const keywords = [
        pathway.shortName,
        pathway.displayName,
        lesson.topic,
        lesson.bodySystem,
        "nurse practitioner",
        pathway.countrySlug === "canada" ? "Canada NP" : "NP exam",
        "clinical reasoning",
      ]
        .filter(Boolean)
        .join(", ");
      return {
        title: lesson.seoTitle,
        description: lesson.seoDescription,
        keywords: keywords.split(", ").slice(0, 24),
        alternates: { canonical },
        openGraph: {
          title: lesson.seoTitle,
          description: lesson.seoDescription,
          url: canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: lesson.seoTitle,
          description:
            lesson.seoDescription.length > 160 ? `${lesson.seoDescription.slice(0, 157)}…` : lesson.seoDescription,
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
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/${lessonSlug}`;
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
