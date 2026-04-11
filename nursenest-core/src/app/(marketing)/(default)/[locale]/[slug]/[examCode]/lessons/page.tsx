import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { loadPathwayLessonsHubAggregates } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import {
  PATHWAY_HUB_PAGE_SIZE_MAX,
  normalizePathwayHubSearchQuery,
} from "@/lib/lessons/pathway-lesson-loader";
import { PathwayLessonsCurriculumHub } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { pathwayLessonHubMetaDescription, pathwayLessonHubMetaTitle } from "@/lib/lessons/pathway-lesson-hub-seo";
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
  // Single-page mode: always load page 1 at the architecture ceiling — no hub-level pagination.
  const qEffective = normalizePathwayHubSearchQuery(sp.q);
  const listOpts = typeof sp.q === "string" && sp.q.trim().length > 0 ? { q: sp.q } : undefined;

  const { pageResult } = await loadPathwayLessonsHubAggregates(
    pathway,
    {
      pageRequested: 1,
      pageSizeRequested: PATHWAY_HUB_PAGE_SIZE_MAX,
      lessonContentLocale,
      listOpts,
      qEffective: qEffective ?? "",
      skipLaunchBundle: Boolean(qEffective),
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

  const lessons = pageResult.items.filter(pathwayLessonHasRenderableHubSlug);
  const { schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);
  const pageTitle = `${pathway.shortName} lessons`;
  const headerDescription = `Browse ${pathway.shortName} lessons by clinical area.`;

  if (pageResult.total === 0) {
    const querySuffix = qEffective ? `?q=${encodeURIComponent(qEffective)}` : "";
    const canadaHref =
      pathway.countrySlug === "canada"
        ? `${base}${querySuffix}`
        : `${equivalentExamHubUrlAfterRegionToggle(base, "CA") ?? base}${querySuffix}`;
    const usHref =
      pathway.countrySlug === "us"
        ? `${base}${querySuffix}`
        : `${equivalentExamHubUrlAfterRegionToggle(base, "US") ?? base}${querySuffix}`;

    return (
      <LessonsPageShell
        title={pageTitle}
        subtitle={headerDescription}
        toolbar={
          <LessonsToolbar
            searchBasePath={base}
            initialQuery={qEffective ?? undefined}
            countryOptions={[
              { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
              { label: "US", href: usHref, active: pathway.countrySlug === "us" },
            ]}
          />
        }
      >
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mt-6 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">
            {qEffective ? `No lessons match "${qEffective}".` : `No lessons are published for ${pathway.shortName} yet.`}
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {qEffective ? "Try a broader search or clear the search to view the full lesson library." : "Check back here for structured lessons as this pathway library grows."}
          </p>
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

  const querySuffix = qEffective ? `?q=${encodeURIComponent(qEffective)}` : "";
  const canadaHref =
    pathway.countrySlug === "canada"
      ? `${base}${querySuffix}`
      : `${equivalentExamHubUrlAfterRegionToggle(base, "CA") ?? base}${querySuffix}`;
  const usHref =
    pathway.countrySlug === "us"
      ? `${base}${querySuffix}`
      : `${equivalentExamHubUrlAfterRegionToggle(base, "US") ?? base}${querySuffix}`;

  return (
    <LessonsPageShell
      title={pageTitle}
      subtitle={headerDescription}
      toolbar={
        <LessonsToolbar
          searchBasePath={base}
          initialQuery={qEffective ?? undefined}
          countryOptions={[
            { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
            { label: "US", href: usHref, active: pathway.countrySlug === "us" },
          ]}
        />
      }
    >
      <BreadcrumbJsonLd items={schemaItems} />
      <div id="pathway-lesson-library" className="mt-8 scroll-mt-24">
        <details open className="group/lesson-library">
          <summary className="mb-4 flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm font-medium text-[var(--semantic-brand)] shadow-[var(--semantic-shadow-soft)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]">
            <span className="text-[var(--theme-muted-text)]">
              {pageResult.total} {pageResult.total === 1 ? "lesson" : "lessons"}
            </span>
            <span className="group-open/lesson-library:hidden">Show full lesson list</span>
            <span className="hidden group-open/lesson-library:inline">Hide full lesson list</span>
          </summary>
          <PathwayLessonsCurriculumHub
            lessons={lessons}
            lessonsBasePath={base}
            progressMap={progressMap}
            canShowProgressMap={canShowProgressMap}
            showLockedState={!canShowResume}
          />
        </details>
      </div>
    </LessonsPageShell>
  );
}
