import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { PathwayLessonsCurriculumHub } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ALLIED_LESSON_HUB_PAGE_SIZE } from "@/lib/allied/allied-marketing-constants";
import { countPublishedPathwayLessonsForAlliedMarketing } from "@/lib/allied/count-allied-pathway-lessons";
import {
  getAlliedProfessionByHeroSegment,
  getAlliedProfessionByProfessionKey,
  getPathwayOrThrow,
  isAlliedHeroExamPrepSlug,
} from "@/lib/allied/allied-professions-registry";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { pathwayCountryLabel } from "@/lib/lessons/pathway-lesson-hub-seo";
import {
  getPathwayLessonsPage,
  normalizePathwayHubSearchQuery,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-loader";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import {
  pathwayLessonHasRenderableHubSlug,
} from "@/lib/lessons/pathway-lesson-types";
import { alliedHealthLessonsIndexPath, alliedHealthSegmentPath } from "@/lib/lessons/lesson-routes";
import { alliedLessonsHubBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { CAT_MIN_COMPLETE_POOL } from "@/lib/practice-tests/cat-pool";

export const dynamic = "force-dynamic";
export const revalidate = 86400;
export const dynamicParams = true;

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
      const loc = await getMarketingLocaleForDefaultRoute();
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
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
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
  const questionSnapshot = await loadPathwayQuestionBankSnapshot(pathway.id);
  const canStartCat = questionSnapshot.status === "ok" && questionSnapshot.adaptiveEligibleCount >= CAT_MIN_COMPLETE_POOL;

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
    const { schemaItems } = alliedLessonsHubBreadcrumbs(prof.h1, professionHeroPath, base, 1);
    return (
      <div className="nn-marketing-surface mx-auto max-w-3xl px-4 py-12">
        <BreadcrumbJsonLd items={schemaItems} />
        <Link href={professionHeroPath} className="text-sm font-medium text-primary hover:underline">
          ← {prof.h1}
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-[var(--theme-heading-text)]">Lessons · {prof.h1}</h1>
        <p className="mt-3 text-muted">
          No lessons available yet for this topic. Explore available study surfaces while this set is finalized.
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
  const { schemaItems } = alliedLessonsHubBreadcrumbs(prof.h1, professionHeroPath, base, pageResult.page);
  const pageTitle = `${prof.h1} lessons`;
  const headerDescription = `Browse ${prof.h1} lessons by clinical area.`;

  return (
    <div className="nn-marketing-surface">
      <LessonsPageShell
        title={pageTitle}
        subtitle={headerDescription}
        toolbar={
          <LessonsToolbar
            searchBasePath={base}
            initialQuery={qEffective ?? undefined}
            countryOptions={[
              {
                label: "Canada",
                href: qEffective
                  ? `/canada/allied/allied-health/lessons?q=${encodeURIComponent(qEffective)}`
                  : "/canada/allied/allied-health/lessons",
                active: pathway.countrySlug === "canada",
              },
              {
                label: "US",
                href: qEffective
                  ? `/us/allied/allied-health/lessons?q=${encodeURIComponent(qEffective)}`
                  : "/us/allied/allied-health/lessons",
                active: pathway.countrySlug === "us",
              },
            ]}
          />
        }
      >
        <BreadcrumbJsonLd items={schemaItems} />
        <section className="mt-4" id="allied-lesson-library">
          <PathwayLessonsCurriculumHub lessons={lessons} lessonsBasePath={base} />
        </section>

        <PathwayLessonPagination
          basePath={base}
          page={pageResult.page}
          pageCount={pageResult.pageCount}
          total={pageResult.total}
          pageSize={pageResult.pageSize}
          hubSearch={qEffective}
        />
      </LessonsPageShell>
    </div>
  );
}
