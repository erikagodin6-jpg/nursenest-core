import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { loadPathwayLessonsHubAggregates } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { marketingPathwayLessonsIndexPath, marketingExamHubBasePath } from "@/lib/lessons/lesson-routes";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import {
  normalizePathwayHubSearchQuery,
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-loader";
import { PathwayLessonsCurriculumHub } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import {
  pathwayCountryLabel,
  pathwayLessonHubMetaDescription,
  pathwayLessonHubMetaTitle,
  pathwayRegionAwareExamName,
} from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
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
import { StudyModeCards, defaultLessonModeCards } from "@/components/study/study-mode-cards";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { CAT_MIN_COMPLETE_POOL } from "@/lib/practice-tests/cat-pool";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;
/** Aggregates + paginated hub queries can run long on cold DB; avoid hard serverless timeouts under spike load. */
export const maxDuration = 60;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const hubPath = `${pathname}/lessons`;
  const sp = await searchParams;
  const q = normalizePathwayHubSearchQuery(sp.q);
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
      if (!pathway) return {};
      const path = buildExamPathwayPath(pathway, "lessons");
      const canonical = absoluteUrl(path);
      const canonicalWithPage = page > 1 ? `${canonical}?page=${page}` : canonical;
      const title = pathwayLessonHubMetaTitle(pathway);
      const description = pathwayLessonHubMetaDescription(pathway);
      return {
        title,
        description,
        alternates: { canonical: canonicalWithPage },
        openGraph: { title, description, url: canonicalWithPage, type: "website" },
        ...(q ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: hubPath, locale: countrySlug, routeGroup: "marketing.exam_hub.lessons" },
  );
}

export default async function PathwayLessonsHubPage({ params, searchParams }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
  const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();

  const base = marketingPathwayLessonsIndexPath(pathway);
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const rawSize = Number(sp.pageSize ?? String(PATHWAY_HUB_PAGE_SIZE_DEFAULT)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;
  const pageSizeRequested = Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(8, Math.floor(rawSize)));
  const qEffective = normalizePathwayHubSearchQuery(sp.q);
  const listOpts = typeof sp.q === "string" && sp.q.trim().length > 0 ? { q: sp.q } : undefined;

  const { pageResult, questionSnapshot } = await loadPathwayLessonsHubAggregates(
    pathway,
    {
      pageRequested,
      pageSizeRequested,
      lessonContentLocale,
      listOpts,
      qEffective: qEffective ?? "",
      skipLaunchBundle: Boolean(qEffective),
      includeLessonCount: false,
      includeLaunchBundle: false,
      includeTopics: false,
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
  if (pageResult.total > 0 && pageRequested !== pageResult.page) {
    const qs = new URLSearchParams();
    if (pageResult.page > 1) qs.set("page", String(pageResult.page));
    if (qEffective) qs.set("q", qEffective);
    const query = qs.toString();
    redirect(query ? `${base}?${query}` : base);
  }

  const lessons = pageResult.items.filter(pathwayLessonHasRenderableHubSlug);
  const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const pageTitle = "Lessons";
  const headerDescription = `Browse lessons by clinical area for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`;

  const overviewHref = marketingExamHubBasePath(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const canStartCat = questionSnapshot.status === "ok" && questionSnapshot.adaptiveEligibleCount >= CAT_MIN_COMPLETE_POOL;

  const lessonHubSurfaceChips = [
    { label: "Practice questions", href: questionsHref },
    { label: canStartCat ? "Adaptive CAT" : "Adaptive CAT unavailable", href: catHref },
    { label: "Flashcards", href: HUB.flashcards },
    { label: "Practice exams", href: HUB.practiceExams },
    { label: "Exam overview", href: overviewHref },
  ];

  const querySuffix = qEffective ? `?q=${encodeURIComponent(qEffective)}` : "";
  const canadaHref =
    pathway.countrySlug === "canada"
      ? `${base}${querySuffix}`
      : `${equivalentExamHubUrlAfterRegionToggle(base, "CA") ?? base}${querySuffix}`;
  const usHref =
    pathway.countrySlug === "us"
      ? `${base}${querySuffix}`
      : `${equivalentExamHubUrlAfterRegionToggle(base, "US") ?? base}${querySuffix}`;

  const toolbar = (
    <LessonsToolbar
      searchBasePath={base}
      initialQuery={qEffective ?? undefined}
      totalCount={pageResult.total}
      countryOptions={[
        { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
        { label: "US", href: usHref, active: pathway.countrySlug === "us" },
      ]}
    />
  );

  if (pageResult.total === 0) {
    return (
      <LessonsPageShell
        title={pageTitle}
        subtitle={headerDescription}
        toolbar={toolbar}
        backLink={{ label: `${examName} overview`, href: overviewHref }}
      >
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
        <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
        <div className="mt-6 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">
            {qEffective ? `No lessons match "${qEffective}".` : "No lessons available yet for this topic."}
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {qEffective
              ? "Try a broader search or clear the search to view the full lesson library."
              : "Explore available study surfaces below while this lesson set is finalized."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={buildExamPathwayPath(pathway, "questions")}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Explore available questions
            </Link>
            <Link
              href={buildExamPathwayPath(pathway, "cat")}
              aria-disabled={!canStartCat}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
            >
              {canStartCat ? "Start adaptive exam" : "Adaptive exam unavailable"}
            </Link>
          </div>
        </div>
      </LessonsPageShell>
    );
  }

  const session = await getOptionalPublicSession({
    pathname: `${pathname}/lessons`,
    surface: "marketing.exam_hub.lessons",
  });
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  let learnerPath: string | null = null;
  if (userId && isDatabaseUrlConfigured()) {
    try {
      const u = await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } });
      learnerPath = u?.learnerPath ?? null;
    } catch {
      learnerPath = null;
    }
  }
  const scope =
    entitlement === "error"
      ? { hasAccess: false, reason: "no_access" as const, tier: null, country: null, alliedCareer: null }
      : entitlement;

  let progressMap: Record<string, PathwayLessonProgressStatus> = {};

  const canShowResume =
    Boolean(userId) && scope.hasAccess && canViewFullPathwayLesson(scope, pathway, learnerPath);
  const canShowProgressMap = canShowResume && lessons.length > 0;

  if (canShowResume) {
    const hubSlugs = canShowProgressMap ? lessons.map((l) => l.slug).filter(Boolean) : [];
    const { progressMap: map } = await loadPathwayHubSubscriberData(
      userId,
      scope,
      learnerPath,
      pathway,
      base,
      hubSlugs,
    );
    progressMap = map;
  }

  const studyCards = defaultLessonModeCards({
    lessonsHref: base,
    questionsHref,
    catHref,
    pathwayShortName: pathway.shortName,
  });

  return (
    <LessonsPageShell
      title={pageTitle}
      subtitle={headerDescription}
      toolbar={toolbar}
      backLink={{ label: `${examName} overview`, href: overviewHref }}
    >
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <LessonHubSurfaceChips links={lessonHubSurfaceChips} />

      <section id="pathway-lesson-library" className="mt-4 scroll-mt-24" aria-labelledby="lesson-library-heading">
        {/* Section toolbar: heading + count badge */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
          <h2 id="lesson-library-heading" className="text-base font-semibold text-[var(--theme-heading-text)]">
            Lesson library
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {pageResult.total.toLocaleString()} {pageResult.total === 1 ? "lesson" : "lessons"}
          </span>
        </div>
        <PathwayLessonsCurriculumHub
          lessons={lessons}
          lessonsBasePath={base}
          pathwayId={pathway.id}
          progressMap={progressMap}
          canShowProgressMap={canShowProgressMap}
          showLockedState={!canShowResume}
        />
      </section>
      <PathwayLessonPagination
        basePath={base}
        page={pageResult.page}
        pageCount={pageResult.pageCount}
        total={pageResult.total}
        pageSize={pageResult.pageSize}
        hubSearch={qEffective}
      />

      <section className="mt-10">
        <StudyModeCards heading="Other ways to study" cards={studyCards} />
      </section>

      <StudyBottomNav
        relatedLinks={[
          { label: "Practice questions", href: questionsHref },
          { label: canStartCat ? "Adaptive CAT" : "Adaptive CAT unavailable", href: catHref },
          { label: "Practice exams", href: HUB.practiceExams },
          { label: "Exam overview", href: overviewHref },
        ]}
      />
    </LessonsPageShell>
  );
}
