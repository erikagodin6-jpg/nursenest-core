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
import {
  marketingPathwayLessonsIndexPath,
  marketingExamHubBasePath,
  normalizeMarketingLessonsHubTopicSlug,
} from "@/lib/lessons/lesson-routes";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import {
  listTopicClustersForPublicNavigation,
  normalizePathwayHubSearchQuery,
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-loader";
import {
  PathwayLessonsCurriculumHub,
  prepareLessonsForHubCurriculum,
} from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import {
  pathwayCountryLabel,
  pathwayLessonHubMetaDescription,
  pathwayLessonHubMetaTitle,
  pathwayLessonTopicClusterMetaDescription,
  pathwayLessonTopicClusterMetaTitle,
  pathwayRegionAwareExamName,
} from "@/lib/lessons/pathway-lesson-hub-seo";
import { sliceNormalizedHubLessons } from "@/lib/lessons/pathway-lesson-hub-page-slice";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { verifyMarketingHubLessonRowsResolve } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import { pathwayLessonsHubBreadcrumbs, pathwayTopicClusterBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
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
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  ALLIED_PROFESSION_QUERY_PARAM,
  isAlliedMarketingCorePathwayId,
} from "@/lib/lessons/canonical-lessons-hubs";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;
/** Aggregates + paginated hub queries can run long on cold DB; avoid hard serverless timeouts under spike load. */
export const maxDuration = 60;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams: Promise<{
    q?: string;
    page?: string;
    pageSize?: string;
    topicSlug?: string;
    alliedProfession?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}`;
  const hubPath = `${pathname}/lessons`;
  const sp = await searchParams;
  const q = normalizePathwayHubSearchQuery(sp.q);
  const topicSlugNorm = normalizeMarketingLessonsHubTopicSlug(
    typeof sp.topicSlug === "string" ? sp.topicSlug : undefined,
  );
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
      if (!pathway) return {};
      const pathOnly = buildExamPathwayPath(pathway, "lessons");
      const qs = new URLSearchParams();
      if (topicSlugNorm) qs.set("topicSlug", topicSlugNorm);
      if (q) qs.set("q", q);
      if (page > 1) qs.set("page", String(page));
      const apRaw = typeof sp.alliedProfession === "string" ? sp.alliedProfession.trim().toLowerCase() : "";
      if (apRaw && isAlliedMarketingCorePathwayId(pathway.id)) {
        const ap = getAlliedProfessionByProfessionKey(apRaw);
        if (ap) qs.set(ALLIED_PROFESSION_QUERY_PARAM, ap.professionKey);
      }
      const pathWithQuery = qs.toString() ? `${pathOnly}?${qs.toString()}` : pathOnly;
      const canonical = absoluteUrl(pathWithQuery);

      let title = pathwayLessonHubMetaTitle(pathway);
      let description = pathwayLessonHubMetaDescription(pathway);
      if (topicSlugNorm) {
        const loc = await getMarketingLocaleForDefaultRoute();
        try {
          const topicClusters = await listTopicClustersForPublicNavigation(pathway.id, loc);
          const label =
            topicClusters.find((t) => t.topicSlug === topicSlugNorm)?.label ?? topicSlugNorm.replace(/-/g, " ");
          title = pathwayLessonTopicClusterMetaTitle(pathway, label);
          description = pathwayLessonTopicClusterMetaDescription(pathway, label);
        } catch {
          /* keep hub defaults */
        }
      }

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
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
  const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();

  const base = marketingPathwayLessonsIndexPath(pathway);
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const rawSize = Number(sp.pageSize ?? String(PATHWAY_HUB_PAGE_SIZE_DEFAULT)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;
  const pageSizeRequested = Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(8, Math.floor(rawSize)));
  /** Same normalization as hub list SQL/catalog filters (min length, trim) — avoids listOpts vs loader mismatch. */
  const qEffective = normalizePathwayHubSearchQuery(sp.q);
  const topicSlugNorm = normalizeMarketingLessonsHubTopicSlug(
    typeof sp.topicSlug === "string" ? sp.topicSlug : undefined,
  );
  const rawAlliedProf =
    typeof sp.alliedProfession === "string" ? sp.alliedProfession.trim().toLowerCase() : "";
  const alliedProfessionResolved =
    isAlliedMarketingCorePathwayId(pathway.id) && rawAlliedProf
      ? getAlliedProfessionByProfessionKey(rawAlliedProf)
      : null;
  const alliedProfessionKey = alliedProfessionResolved?.professionKey ?? "";

  let listOpts: { q?: string; topicSlugsIn?: string[] } | undefined;
  const alliedTopics = alliedProfessionResolved?.topicSlugsIn;
  if (alliedTopics && alliedTopics.length > 0) {
    const narrowed =
      topicSlugNorm && alliedTopics.includes(topicSlugNorm) ? [topicSlugNorm] : alliedTopics;
    listOpts = qEffective ? { q: qEffective, topicSlugsIn: narrowed } : { topicSlugsIn: narrowed };
  } else {
    listOpts =
      qEffective && topicSlugNorm
        ? { q: qEffective, topicSlugsIn: [topicSlugNorm] }
        : qEffective
          ? { q: qEffective }
          : topicSlugNorm
            ? { topicSlugsIn: [topicSlugNorm] }
            : undefined;
  }

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
    if (topicSlugNorm) qs.set("topicSlug", topicSlugNorm);
    if (alliedProfessionKey) qs.set(ALLIED_PROFESSION_QUERY_PARAM, alliedProfessionKey);
    const query = qs.toString();
    redirect(query ? `${base}?${query}` : base);
  }

  /** Slug-safe rows from the same loader result used for pagination (`items` / `renderableAll`). */
  const rawHubLessonRows = (pageResult.renderableAll ?? pageResult.items).filter(pathwayLessonHasRenderableHubSlug);
  /** Dedupe + taxonomy guard + linkable href — must match curriculum grid and toolbar count. */
  const hubCurriculumPrepared = prepareLessonsForHubCurriculum(rawHubLessonRows, {
    pathwayId: pathway.id,
    lessonsBasePath: base,
  });
  /** Drop any row that does not hydrate to a marketing-public-complete lesson (same contract as lesson detail). */
  const { kept: hubCurriculumLessons } = await verifyMarketingHubLessonRowsResolve(
    pathway,
    hubCurriculumPrepared,
    lessonContentLocale,
  );
  const hubListCountForChrome = hubCurriculumLessons.length;
  /** Pagination + grid use the same verified ordering as {@link sliceNormalizedHubLessons} (not pre-verify totals). */
  const hubVerifiedPage = sliceNormalizedHubLessons(hubCurriculumLessons, pageRequested, pageSizeRequested);
  if (hubVerifiedPage.total > 0 && pageRequested !== hubVerifiedPage.page) {
    const qs = new URLSearchParams();
    if (hubVerifiedPage.page > 1) qs.set("page", String(hubVerifiedPage.page));
    if (qEffective) qs.set("q", qEffective);
    if (topicSlugNorm) qs.set("topicSlug", topicSlugNorm);
    if (alliedProfessionKey) qs.set(ALLIED_PROFESSION_QUERY_PARAM, alliedProfessionKey);
    const query = qs.toString();
    redirect(query ? `${base}?${query}` : base);
  }
  const hubPageLessons = hubVerifiedPage.items;
  const lessonsOnPageForPagination = hubPageLessons.length;

  let topicClusterLabel: string | null = null;
  if (topicSlugNorm) {
    try {
      const topicClusters = await listTopicClustersForPublicNavigation(pathway.id, lessonContentLocale);
      topicClusterLabel =
        topicClusters.find((t) => t.topicSlug === topicSlugNorm)?.label ?? topicSlugNorm.replace(/-/g, " ");
    } catch {
      topicClusterLabel = topicSlugNorm.replace(/-/g, " ");
    }
  }

  const { crumbs, schemaItems } =
    topicClusterLabel && topicSlugNorm
      ? pathwayTopicClusterBreadcrumbs(pathway, topicSlugNorm, topicClusterLabel)
      : pathwayLessonsHubBreadcrumbs(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const pageTitle = "Lessons";
  const headerDescription =
    alliedProfessionResolved && !topicSlugNorm
      ? `Browse ${alliedProfessionResolved.h1} lessons for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`
      : topicClusterLabel != null
        ? `Lessons in “${topicClusterLabel}” for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`
        : `Browse lessons by clinical area for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`;

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

  const querySuffix = (() => {
    const qs = new URLSearchParams();
    if (qEffective) qs.set("q", qEffective);
    if (topicSlugNorm) qs.set("topicSlug", topicSlugNorm);
    if (alliedProfessionKey) qs.set(ALLIED_PROFESSION_QUERY_PARAM, alliedProfessionKey);
    const s = qs.toString();
    return s ? `?${s}` : "";
  })();
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
      preservedTopicSlug={topicSlugNorm ?? undefined}
      preservedAlliedProfession={alliedProfessionKey || undefined}
      totalCount={hubListCountForChrome}
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
            {qEffective
              ? `No lessons match "${qEffective}".`
              : topicSlugNorm
                ? "No lessons match this topic filter yet."
                : "No lessons available yet for this pathway."}
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {qEffective
              ? "Try a broader search or clear the search to view the full lesson library."
              : topicSlugNorm
                ? "Clear the topic filter to browse the full lesson library, or explore questions and adaptive practice below."
                : "Explore available study surfaces below while this lesson set is finalized."}
          </p>
          {topicSlugNorm && !qEffective ? (
            <p className="mt-3 text-sm">
              <Link href={base} className="font-semibold text-primary hover:underline">
                View all lessons in this pathway
              </Link>
            </p>
          ) : null}
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
  const canShowProgressMap = canShowResume && hubPageLessons.length > 0;

  if (canShowResume) {
    const hubSlugs = canShowProgressMap ? hubPageLessons.map((l) => l.slug).filter(Boolean) : [];
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
            {hubListCountForChrome.toLocaleString()} {hubListCountForChrome === 1 ? "lesson" : "lessons"}
          </span>
        </div>
        <PathwayLessonsCurriculumHub
          lessons={rawHubLessonRows}
          preparedLessons={hubPageLessons}
          lessonsBasePath={base}
          pathwayId={pathway.id}
          progressMap={progressMap}
          canShowProgressMap={canShowProgressMap}
          showLockedState={!canShowResume}
        />
      </section>
      <PathwayLessonPagination
        basePath={base}
        page={hubVerifiedPage.page}
        pageCount={hubVerifiedPage.pageCount}
        total={hubVerifiedPage.total}
        pageSize={hubVerifiedPage.pageSize}
        hubSearch={qEffective}
        topicSlug={topicSlugNorm ?? undefined}
        alliedProfession={alliedProfessionKey || undefined}
        lessonsOnPage={lessonsOnPageForPagination}
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
