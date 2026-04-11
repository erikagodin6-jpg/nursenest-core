import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { PathwayLessonsCurriculumHub } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { PathwayLessonContentLocaleBanner } from "@/components/lessons/pathway-lesson-content-locale-banner";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { Search } from "lucide-react";
import { ALLIED_LESSON_HUB_PAGE_SIZE } from "@/lib/allied/allied-marketing-constants";
import { countPublishedPathwayLessonsForAlliedMarketing } from "@/lib/allied/count-allied-pathway-lessons";
import {
  getAlliedProfessionByHeroSegment,
  getAlliedProfessionByProfessionKey,
  getPathwayOrThrow,
  isAlliedHeroExamPrepSlug,
} from "@/lib/allied/allied-professions-registry";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import { pathwayCountryLabel } from "@/lib/lessons/pathway-lesson-hub-seo";
import {
  getPathwayLessonsPage,
  normalizePathwayHubSearchQuery,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-loader";
import {
  pathwayLessonHasRenderableHubSlug,
} from "@/lib/lessons/pathway-lesson-types";
import { alliedHealthLessonsIndexPath, alliedHealthSegmentPath } from "@/lib/lessons/lesson-routes";
import { alliedLessonsHubBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
};

function resolveProfession(slug: string) {
  if (isAlliedHeroExamPrepSlug(slug)) {
    const byHero = getAlliedProfessionByHeroSegment(slug);
    return byHero ? { prof: byHero, mode: "hero" as const } : null;
  }
  const byKey = getAlliedProfessionByProfessionKey(slug);
  return byKey ? { prof: byKey, mode: "key" as const } : null;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  return safeGenerateMetadata(
    async () => {
      const resolved = resolveProfession(slug);
      const sp = await searchParams;
      const page = Math.max(1, Number(sp.page ?? "1") || 1);
      if (!resolved) return { title: "Not found" };
      const { prof } = resolved;
      const pathway = getPathwayOrThrow(prof.pathwayId);
      if (!pathway) return { title: "Not found" };
      const loc = defaultPathwayLessonContentLocaleForExamHubRoute();
      const lessonTotal =
        pathway != null
          ? await countPublishedPathwayLessonsForAlliedMarketing(
              pathway.id,
              loc,
              prof.topicSlugsIn,
            )
          : null;
      const emptyHub = lessonTotal === 0;
      const basePath = alliedHealthLessonsIndexPath(prof.professionKey);
      const canonical = page > 1 ? `${basePath}?page=${page}` : basePath;
      const place = pathwayCountryLabel(pathway);
      const title =
        page > 1
          ? `${prof.h1} exam prep lessons (page ${page}) · ${place} | NurseNest`
          : `${prof.h1} allied exam prep lessons · ${place} | NurseNest`;
      const description = `Clinical lessons for ${prof.h1} (${pathway.shortName}, ${place}): previews are public here; pair with pathway-matched questions in the app. Paginated for fast loads.`;
      return {
        title,
        description,
        alternates: { canonical: absoluteUrl(canonical) },
        openGraph: { title, description, url: absoluteUrl(canonical), type: "website" },
        ...(page > 1 || emptyHub ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: `/allied-health/${slug}/lessons`, routeGroup: "marketing.default.allied_health.lessons" },
  );
}

export default async function AlliedHealthSlugLessonsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolved = resolveProfession(slug);
  if (!resolved) notFound();
  const { prof, mode } = resolved;

  if (mode === "hero") {
    redirect(alliedHealthLessonsIndexPath(prof.professionKey));
  }

  const pathway = getPathwayOrThrow(prof.pathwayId);
  if (!pathway) notFound();

  const professionHeroPath = alliedHealthSegmentPath(prof.segment);
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const base = alliedHealthLessonsIndexPath(prof.professionKey);
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const rawSize = Number(sp.pageSize ?? String(ALLIED_LESSON_HUB_PAGE_SIZE)) || ALLIED_LESSON_HUB_PAGE_SIZE;
  const pageSizeRequested = Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(8, Math.floor(rawSize)));
  const qEffective = normalizePathwayHubSearchQuery(sp.q);
  const listOptsRaw: { topicSlugsIn?: string[]; q?: string } = {};
  if (prof.topicSlugsIn && prof.topicSlugsIn.length > 0) listOptsRaw.topicSlugsIn = prof.topicSlugsIn;
  if (typeof sp.q === "string" && sp.q.trim().length > 0) listOptsRaw.q = sp.q;
  const listOpts = Object.keys(listOptsRaw).length > 0 ? listOptsRaw : undefined;

  let pageResult;
  try {
    pageResult = await getPathwayLessonsPage(
      pathway.id,
      pageRequested,
      pageSizeRequested,
      lessonContentLocale,
      listOpts,
    );
  } catch {
    pageResult = null;
  }

  if (!pageResult) {
    return (
      <div className="nn-marketing-surface mx-auto max-w-3xl px-4 py-12">
        <p className="text-muted">We couldn’t load lessons right now. Try again shortly.</p>
        <Link href={professionHeroPath} className="mt-4 inline-block text-primary hover:underline">
          Back to profession
        </Link>
      </div>
    );
  }

  if (pageResult.total === 0) {
    if (pageRequested > 1) {
      redirect(base);
    }
    const { crumbs, schemaItems } = alliedLessonsHubBreadcrumbs(prof.h1, professionHeroPath, base, 1);
    return (
      <div className="nn-marketing-surface mx-auto max-w-3xl px-4 py-12">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <Link href={professionHeroPath} className="text-sm font-medium text-primary hover:underline">
          ← {prof.h1}
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-[var(--theme-heading-text)]">Lessons · {prof.h1}</h1>
        <p className="mt-3 text-muted">
          No published lessons for this filter yet. Check back after import, or browse the full pathway hub.
        </p>
        <Link href={professionHeroPath} className="mt-4 inline-block font-semibold text-primary hover:underline">
          Back to overview
        </Link>
        <p className="mt-4 text-xs text-muted">
          This page is not indexed for search until content exists.
        </p>
      </div>
    );
  }

  if (pageRequested !== pageResult.page) {
    const qs = new URLSearchParams();
    if (pageResult.page > 1) qs.set("page", String(pageResult.page));
    if (qEffective) qs.set("q", qEffective);
    const qstr = qs.toString();
    redirect(qstr ? `${base}?${qstr}` : base);
  }

  const lessons = pageResult.items.filter(pathwayLessonHasRenderableHubSlug);
  const { crumbs, schemaItems } = alliedLessonsHubBreadcrumbs(prof.h1, professionHeroPath, base, pageResult.page);

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <Link href={professionHeroPath} className="text-sm font-medium text-primary hover:underline">
          ← {prof.h1}
        </Link>
        <header className="mt-4 rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-7">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
            {prof.h1} lessons · {pathwayCountryLabel(pathway)}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--theme-muted-text)]">
            The same premium system-based catalog used across NurseNest pathways, tuned for {prof.h1} exam prep.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex min-h-8 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 text-xs font-semibold text-[var(--semantic-text-secondary)]">
              {pageResult.total} total lessons
            </span>
            <span className="inline-flex min-h-8 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] px-3 text-xs font-semibold text-[var(--semantic-text-secondary)]">
              Page {pageResult.page} of {pageResult.pageCount}
            </span>
          </div>
          <form action={base} method="get" className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="allied-lessons-search" className="sr-only">
              Search lessons
            </label>
            <div className="relative max-w-xl flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-muted-text)]" />
              <input
                id="allied-lessons-search"
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
              <Link
                href={base}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[var(--semantic-panel-muted)]"
              >
                Clear
              </Link>
            ) : null}
          </form>
        </header>

        {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}

        <section className="mt-10" id="allied-lesson-library">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
            All {prof.h1} lessons · {pathway.shortName}
          </h2>
          <div className="mt-4">
            <PathwayLessonsCurriculumHub lessons={lessons} lessonsBasePath={base} />
          </div>
        </section>

        <PathwayLessonPagination
          basePath={base}
          page={pageResult.page}
          pageCount={pageResult.pageCount}
          total={pageResult.total}
          pageSize={pageResult.pageSize}
          hubSearch={qEffective}
        />

        <section className="mt-10 rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm text-muted">
          <p className="font-semibold text-foreground">Official pathway</p>
          <p className="mt-1">
            <Link className="text-primary hover:underline" href={`/us/allied/allied-health/lessons`}>
              Open the canonical US allied lessons hub
            </Link>{" "}
            for the same underlying catalog with full routing.
          </p>
        </section>
      </div>
    </div>
  );
}
