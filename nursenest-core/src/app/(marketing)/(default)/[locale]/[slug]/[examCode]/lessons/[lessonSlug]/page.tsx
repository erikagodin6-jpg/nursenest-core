import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PathwayLessonDetailPageLoadingFallback } from "@/components/lessons/pathway-lesson-detail-loading-fallback";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import { loadPathwayLessonWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import {
  pathwayLessonEligibleForPublicMarketingSurface,
  resolveMarketingPathwayLessonRouteResolution,
} from "@/lib/lessons/pathway-lesson-route-access";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
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
      const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, {
        pathname,
      });
      const viewerLessonLocale = await getMarketingLocaleForDefaultRoute();
      const lesson = pathway
        ? await loadPathwayLessonWithLegacySlugRedirect(pathway, lessonSlug, viewerLessonLocale)
        : undefined;
      if (!pathway || !lesson) return {};
      if (!pathwayLessonEligibleForPublicMarketingSurface(lesson)) {
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
      const strictPublic = process.env.PATHWAY_LESSON_STRICT_PUBLIC_QUALITY === "1";
      const gate = lesson.structuralQuality;
      const incomplete = !pathwayLessonEligibleForPublicMarketingSurface(lesson);
      const robots =
        incomplete && (strictPublic || gate?.structureMode === "premium")
          ? ({ index: false, follow: true } as const)
          : ({ index: true, follow: true } as const);
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
        robots,
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
  const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();

  return (
    <Suspense fallback={<PathwayLessonDetailPageLoadingFallback pathway={pathway} />}>
      <PathwayLessonDetailPageBody pathway={pathway} pathname={pathname} lessonSlug={lessonSlug} />
    </Suspense>
  );
}
