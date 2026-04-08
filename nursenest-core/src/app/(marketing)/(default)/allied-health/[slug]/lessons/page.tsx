import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { PathwayLessonContentLocaleBanner } from "@/components/lessons/pathway-lesson-content-locale-banner";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
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
import { getPathwayLessonsPage, PATHWAY_HUB_PAGE_SIZE_MAX } from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { alliedLessonsHubBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
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
  const basePath = `/allied-health/${prof.professionKey}/lessons`;
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
}

export default async function AlliedHealthSlugLessonsPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolved = resolveProfession(slug);
  if (!resolved) notFound();
  const { prof, mode } = resolved;

  if (mode === "hero") {
    redirect(`/allied-health/${prof.professionKey}/lessons`);
  }

  const pathway = getPathwayOrThrow(prof.pathwayId);
  if (!pathway) notFound();

  const professionHeroPath = `/allied-health/${prof.segment}`;
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const base = `/allied-health/${prof.professionKey}/lessons`;
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const rawSize = Number(sp.pageSize ?? String(ALLIED_LESSON_HUB_PAGE_SIZE)) || ALLIED_LESSON_HUB_PAGE_SIZE;
  const pageSizeRequested = Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(8, Math.floor(rawSize)));

  let pageResult;
  try {
    pageResult = await getPathwayLessonsPage(
      pathway.id,
      pageRequested,
      pageSizeRequested,
      lessonContentLocale,
      prof.topicSlugsIn ? { topicSlugsIn: prof.topicSlugsIn } : undefined,
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
    redirect(pageResult.page > 1 ? `${base}?page=${pageResult.page}` : base);
  }

  const lessons = pageResult.items.filter(pathwayLessonHasRenderableHubSlug);
  const { crumbs, schemaItems } = alliedLessonsHubBreadcrumbs(prof.h1, professionHeroPath, base, pageResult.page);

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <Link href={professionHeroPath} className="text-sm font-medium text-primary hover:underline">
          ← {prof.h1}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">
          {prof.h1} exam prep lessons · {pathwayCountryLabel(pathway)}
        </h1>
        <p className="mt-3 text-sm text-muted">
          Pathway <span className="font-medium text-foreground">{pathway.shortName}</span>. This page lists{" "}
          {lessons.length} lesson{lessons.length === 1 ? "" : "s"}; use pagination to scan the full catalog without loading
          everything at once.
        </p>

        {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
            All {prof.h1} lessons · {pathway.shortName}
          </h2>
          <ul className="mt-4 space-y-4">
            {lessons.map((l) => (
              <li key={l.slug} className="nn-card p-4">
                <p className="text-xs font-medium uppercase text-muted">{l.topic}</p>
                <Link
                  href={`${base}/${l.slug}`}
                  className="mt-1 block text-lg font-semibold text-primary hover:underline"
                >
                  {l.title}
                </Link>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{l.seoDescription}</p>
              </li>
            ))}
          </ul>
        </section>

        <PathwayLessonPagination
          basePath={base}
          page={pageResult.page}
          pageCount={pageResult.pageCount}
          total={pageResult.total}
          pageSize={pageResult.pageSize}
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
