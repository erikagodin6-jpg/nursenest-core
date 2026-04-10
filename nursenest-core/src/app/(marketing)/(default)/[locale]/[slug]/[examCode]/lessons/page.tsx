import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { PathwayLessonContentLocaleBanner } from "@/components/lessons/pathway-lesson-content-locale-banner";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { loadPathwayLessonsHubAggregates } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import {
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  normalizePathwayHubSearchQuery,
} from "@/lib/lessons/pathway-lesson-loader";
import { PathwayLessonsCurriculumHub } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { pathwayLessonHubMetaDescription, pathwayLessonHubMetaTitle } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { Search } from "lucide-react";
import { pathwayLessonsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  loadPathwayHubSubscriberData,
  pathwayHubResumeHasContent,
  type PathwayHubResumePayload,
} from "@/lib/learner/pathway-lesson-continuation";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamicParams = true;
/** Aggregates + paginated hub queries can run long on cold DB; avoid hard serverless timeouts under spike load. */
export const maxDuration = 60;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
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
  const pageSizeRequested = Number(sp.pageSize ?? String(PATHWAY_HUB_PAGE_SIZE_DEFAULT)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;
  const qEffective = normalizePathwayHubSearchQuery(sp.q);
  const listOpts = typeof sp.q === "string" && sp.q.trim().length > 0 ? { q: sp.q } : undefined;

  const { pageResult } = await loadPathwayLessonsHubAggregates(
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

  const hubQuerySuffix = (page: number) => {
    const qs = new URLSearchParams();
    if (page > 1) qs.set("page", String(page));
    if (qEffective) qs.set("q", qEffective);
    const s = qs.toString();
    return s ? `?${s}` : "";
  };

  if (pageResult.total === 0) {
    if (pageRequested > 1) redirect(`${base}${hubQuerySuffix(1)}`);
  } else if (pageRequested !== pageResult.page) {
    redirect(`${base}${hubQuerySuffix(pageResult.page)}`);
  }

  const lessons = pageResult.items.filter(pathwayLessonHasRenderableHubSlug);
  const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);

  if (pageResult.total === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <header className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
          <p className="text-sm font-medium text-[var(--theme-muted-text)]">{pathway.displayName}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)]">Lessons</h1>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Browse {pathway.shortName} lessons by body system.</p>
          <form action={base} method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="pathway-lessons-search" className="sr-only">
              Search lessons
            </label>
            <div className="relative max-w-xl flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-muted-text)]" />
              <input
                id="pathway-lessons-search"
                name="q"
                defaultValue={qEffective ?? ""}
                placeholder="Search lessons"
                className="min-h-11 w-full rounded-full border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--theme-heading-text)] outline-none transition focus:border-[var(--semantic-brand)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--semantic-brand)_16%,transparent)]"
              />
            </div>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold">
              Search
            </button>
          </form>
        </header>
        {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}
        <div className="mt-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">
            {qEffective ? `No lessons match "${qEffective}".` : `No lessons are published for ${pathway.shortName} yet.`}
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {qEffective ? "Try a broader search or clear the search to view the full lesson library." : "Check back here for structured lessons as this pathway library grows."}
          </p>
        </div>
      </div>
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
      ? { hasAccess: false, reason: "no_access" as const, tier: null, country: null }
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <header className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <p className="text-sm font-medium text-[var(--theme-muted-text)]">{pathway.displayName}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)]">Lessons</h1>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Browse {pathway.shortName} lessons by body system.</p>
        <form action={base} method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="pathway-lessons-search" className="sr-only">
            Search lessons
          </label>
          <div className="relative max-w-xl flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-muted-text)]" />
            <input
              id="pathway-lessons-search"
              name="q"
              defaultValue={qEffective ?? ""}
              placeholder="Search lessons"
              className="min-h-11 w-full rounded-full border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--theme-heading-text)] outline-none transition focus:border-[var(--semantic-brand)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--semantic-brand)_16%,transparent)]"
            />
          </div>
          <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold">
            Search
          </button>
          {qEffective ? (
            <a
              href={base}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[var(--semantic-panel-muted)]"
            >
              Clear
            </a>
          ) : null}
        </form>
      </header>
      {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}

      <div id="pathway-lesson-library" className="mt-8 scroll-mt-24">
        <PathwayLessonsCurriculumHub
          lessons={lessons}
          lessonsBasePath={base}
          progressMap={progressMap}
          canShowProgressMap={canShowProgressMap}
          showLockedState={!canShowResume}
        />
      </div>

      <PathwayLessonPagination
        basePath={base}
        page={pageResult.page}
        pageCount={pageResult.pageCount}
        total={pageResult.total}
        pageSize={pageResult.pageSize}
        hubSearch={qEffective}
      />
    </div>
  );
}
