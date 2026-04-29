import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { PathwayLessonDetailPageLoadingFallback } from "@/components/lessons/pathway-lesson-detail-loading-fallback";
import { MarketingLessonsHubCategoryLessonsSurface } from "@/components/pathway-lessons/marketing-lessons-hub-category-lessons-surface";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import {
  marketingLessonSlugFromRouteParam,
  marketingPathwayLessonsCategoryPath,
  marketingPathwayLessonsIndexPath,
} from "@/lib/lessons/lesson-routes";
import { loadPathwayLessonSeoMetaWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { mergePathwayLessonPublicMetadata } from "@/lib/seo/programmatic-seo-engine/lesson-public-metadata";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { withCrawlSurfacePageRender } from "@/lib/observability/crawl-surface-observability";
import { PathwayLessonDetailPageBody } from "./pathway-lesson-detail-page-body";
import {
  filterMarketingHubLessonsByDisplayCategory,
  getMarketingLessonsHubCatalogLessons,
  marketingHubCategorySlugForCategory,
  MARKETING_HUB_CATEGORY_PAGE_SIZE,
  sortLessonsForMarketingCategoryPage,
} from "@/lib/lessons/marketing-lessons-hub-category";
import { resolveMarketingLessonsHubDynamicSegment } from "@/lib/lessons/marketing-lessons-hub-category-resolve";
import { sliceNormalizedHubLessons } from "@/lib/lessons/pathway-lesson-hub-page-slice";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { lessonsPerfMark } from "@/lib/lessons/lessons-perf";

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
  searchParams?: Promise<{ page?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug: lessonSlugRaw } = await params;
  const lessonSlug = marketingLessonSlugFromRouteParam(lessonSlugRaw) || lessonSlugRaw;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/${lessonSlugRaw}`;
  const sp = searchParams ? await searchParams : {};
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, {
        pathname,
      });
      if (!pathway) return {};

      const lesson = await loadPathwayLessonSeoMetaWithLegacySlugRedirect(pathway, lessonSlug);
      if (lesson?.publicComplete) {
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
      }

      const resolved = await resolveMarketingLessonsHubDynamicSegment(pathway.id, lessonSlug);
      if (resolved === "lesson") return {};
      const { category } = resolved;
      const catPath = marketingPathwayLessonsCategoryPath(pathway, marketingHubCategorySlugForCategory(category));
      const qs = page > 1 ? `?page=${page}` : "";
      const canonical = absoluteUrl(`${catPath}${qs}`);
      const examName = pathwayRegionAwareExamName(pathway);
      const region = pathwayCountryLabel(pathway);
      const title = `${category} lessons — ${pathway.shortName} (${examName})`;
      const description = `Browse ${category.toLowerCase()} lessons for ${pathway.shortName} in ${region}.`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "website" },
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
export default async function PathwayLessonDetailPage({ params, searchParams }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug: lessonSlugRaw } = await params;
  const lessonSlug = marketingLessonSlugFromRouteParam(lessonSlugRaw) || lessonSlugRaw;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/${lessonSlugRaw}`;
  const sp = searchParams ? await searchParams : {};
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();

  return withCrawlSurfacePageRender("marketing.pathway_lesson", pathname, async () => {
    const routeT0 = performance.now();
    lessonsPerfMark("route_start", { surface: "pathway_lesson_detail", pathname });
    try {
    const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
    if (!pathway) notFound();

    const resolved = await resolveMarketingLessonsHubDynamicSegment(pathway.id, lessonSlug);
    if (resolved !== "lesson") {
      const base = marketingPathwayLessonsIndexPath(pathway);
      const categoryBasePath = marketingPathwayLessonsCategoryPath(
        pathway,
        marketingHubCategorySlugForCategory(resolved.category),
      );
      const filtered = sortLessonsForMarketingCategoryPage(
        filterMarketingHubLessonsByDisplayCategory(
          getMarketingLessonsHubCatalogLessons(pathway.id),
          resolved.category,
        ),
        pathway.id,
      );
      const hubSlice = sliceNormalizedHubLessons(filtered, pageRequested, MARKETING_HUB_CATEGORY_PAGE_SIZE);
      if (filtered.length > 0 && pageRequested !== hubSlice.page) {
        const qs = new URLSearchParams();
        if (hubSlice.page > 1) qs.set("page", String(hubSlice.page));
        const q = qs.toString();
        redirect(q ? `${categoryBasePath}?${q}` : categoryBasePath);
      }
      return (
        <MarketingLessonsHubCategoryLessonsSurface
          pathway={pathway}
          base={base}
          routePathLessonsCategory={pathname}
          lessonContentLocale={lessonContentLocale}
          category={resolved.category}
          pageRequested={pageRequested}
        />
      );
    }

    return (
      <Suspense fallback={<PathwayLessonDetailPageLoadingFallback pathway={pathway} />}>
        <PathwayLessonDetailPageBody
          pathway={pathway}
          pathname={pathname}
          lessonSlug={lessonSlug}
          lessonContentLocale={lessonContentLocale}
        />
      </Suspense>
    );
    } finally {
      lessonsPerfMark("route_end", {
        surface: "pathway_lesson_detail",
        elapsed_ms: Math.round(performance.now() - routeT0),
      });
    }
  });
}
