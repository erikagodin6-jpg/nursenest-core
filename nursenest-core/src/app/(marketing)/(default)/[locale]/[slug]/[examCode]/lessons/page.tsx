import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { loadPathwayLessonsHubAggregates } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import {
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  normalizePathwayHubSearchQuery,
} from "@/lib/lessons/pathway-lesson-loader";
import { PathwayLessonsCurriculumHub } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { pathwayLessonHubMetaDescription, pathwayLessonHubMetaTitle } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { loadPathwayHubSubscriberData } from "@/lib/learner/pathway-lesson-continuation";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamicParams = true;
export const maxDuration = 60;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
};

type SafePageResult = {
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  items: Awaited<ReturnType<typeof loadPathwayLessonsHubAggregates>>["pageResult"]["items"];
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const hubPath = `${pathname}/lessons`;
  const sp = await searchParams;
  const q = normalizePathwayHubSearchQuery(sp.q);

  return safeGenerateMetadata(
    async () => {
      const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
      if (!pathway) return {};

      const path = buildExamPathwayPath(pathway, "lessons");
      const canonical = absoluteUrl(path);
      const title = pathwayLessonHubMetaTitle(pathway);
      const description = pathwayLessonHubMetaDescription(pathway);

      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "website" },
        ...(q ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: hubPath, locale: countrySlug, routeGroup: "marketing.exam_hub.lessons" },
  );
}

export default async function PathwayLessonsHubPage({ params, searchParams }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();

  const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();

  const base = marketingPathwayLessonsIndexPath(pathway);
  const sp = await searchParams;

  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSizeRequested =
    Number(sp.pageSize ?? String(PATHWAY_HUB_PAGE_SIZE_DEFAULT)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;

  const qEffective = normalizePathwayHubSearchQuery(sp.q);
  const listOpts =
    typeof sp.q === "string" && sp.q.trim().length > 0 ? { q: sp.q } : undefined;

  let pageResult: SafePageResult;
  let hubLoadFailed = false;

  try {
    const result = await loadPathwayLessonsHubAggregates(
      pathway,
      {
        pageRequested,
        pageSizeRequested,
        lessonContentLocale,
        listOpts,
        qEffective: qEffective ?? "",
        skipLaunchBundle: pageRequested !== 1 || Boolean(qEffective),
      },
      {
        pathname: `${pathname}/lessons`,
        locale: countrySlug,
        country: countrySlug,
        examCode,
        pathwayId: pathway.id,
        roleTrack,
      },
    );

    pageResult = result.pageResult;

    console.log("[LESSONS HUB] loaded", {
      total: pageResult.total,
      itemCount: pageResult.items.length,
    });
  } catch (err) {
    hubLoadFailed = true;

    console.error("[LESSONS HUB ERROR]", {
      error: err instanceof Error ? err.message : String(err),
    });

    pageResult = {
      total: 0,
      page: 1,
      pageCount: 1,
      pageSize: pageSizeRequested,
      items: [],
    };
  }

  const rawLessons = pageResult.items;

  // ✅ FIXED FILTER (this was the problem)
  const lessons = rawLessons.filter((lesson) => {
    const hasSlug = typeof lesson.slug === "string" && lesson.slug.trim().length > 0;

    if (!hasSlug) {
      console.warn("[LESSON DROPPED]", {
        id: lesson.id,
        slug: lesson.slug,
      });
    }

    return hasSlug || Boolean(lesson.id);
  });

  console.log("[LESSONS HUB] counts", {
    raw: rawLessons.length,
    final: lessons.length,
  });

  if (pageResult.total === 0 || lessons.length === 0) {
    return (
      <LessonsPageShell title="Lessons unavailable">
        <p>Lessons are temporarily unavailable.</p>
      </LessonsPageShell>
    );
  }

  return (
    <LessonsPageShell title={`${pathway.shortName} lessons`}>
      <PathwayLessonsCurriculumHub
        pathway={pathway}
        lessons={lessons}
        lessonsBasePath={base}
        progressMap={{}}
        canShowProgressMap={false}
        showLockedState={true}
      />
    </LessonsPageShell>
  );
}