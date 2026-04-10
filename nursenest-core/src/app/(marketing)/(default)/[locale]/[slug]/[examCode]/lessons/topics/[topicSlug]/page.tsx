import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PathwayLessonContentLocaleBanner } from "@/components/lessons/pathway-lesson-content-locale-banner";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonTopicClusterPath, marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import {
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  getLessonsForTopicPage,
  listTopicClusters,
} from "@/lib/lessons/pathway-lesson-loader";
import {
  pathwayLessonTopicClusterMetaDescription,
  pathwayLessonTopicClusterMetaTitle,
} from "@/lib/lessons/pathway-lesson-hub-seo";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
} from "@/lib/lessons/pathway-lesson-types";
import { pathwayTopicClusterBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { PathwayTopicClusterSiblingNav } from "@/components/pathway-lessons/pathway-topic-cluster-sibling-nav";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamicParams = true;
export const maxDuration = 60;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string; topicSlug: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

function TopicClusterLoadFailed({ pathway, base }: { pathway: ExamPathwayDefinition; base: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href={base} className="text-sm font-medium text-primary hover:underline">
        ← All lessons ({pathway.shortName})
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-[var(--theme-heading-text)]">Topic lessons temporarily unavailable</h1>
      <p className="mt-3 text-sm text-[var(--theme-muted-text)]">
        We couldn&apos;t load the lesson list for this topic. You can still open the full lesson index or exam hub for{" "}
        {pathway.shortName}.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={base}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Browse all lessons
        </Link>
        <Link
          href={buildExamPathwayPath(pathway)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
        >
          {pathway.shortName} exam hub
        </Link>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode, topicSlug } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/topics/${topicSlug}`;
  return safeGenerateMetadata(
    async () => {
      const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
      if (!pathway) return {};
      const canonicalPath = marketingPathwayLessonTopicClusterPath(pathway, topicSlug);
      const canonical = absoluteUrl(canonicalPath);
      const loc = defaultPathwayLessonContentLocaleForExamHubRoute();
      try {
        const topicClusters = await listTopicClusters(pathway.id, loc);
        const label =
          topicClusters.find((t) => t.topicSlug === topicSlug)?.label ?? topicSlug.replace(/-/g, " ");
        const title = pathwayLessonTopicClusterMetaTitle(pathway, label);
        const description = pathwayLessonTopicClusterMetaDescription(pathway, label);
        return {
          title,
          description,
          alternates: { canonical },
          openGraph: { title, description, url: canonical, type: "website" },
          twitter: { card: "summary_large_image", title, description },
        };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
          event: "hub_data_load_failed",
          pathname,
          locale: countrySlug,
          country: countrySlug,
          examCode,
          dependency: "listTopicClusters_metadata",
          error_message: message.slice(0, 500),
        });
        recordRouteRenderFallback({
          fallbackType: "hub_data_load_failed",
          pathname,
          pathwayId: pathway.id,
          examCode,
          country: countrySlug,
          dependencyName: "listTopicClusters_metadata",
        });
        const fallbackLabel = topicSlug.replace(/-/g, " ");
        return {
          title: `${fallbackLabel} · ${pathway.shortName} | NurseNest`,
          robots: { index: false, follow: true },
          alternates: { canonical },
          openGraph: { url: canonical, type: "website" },
        };
      }
    },
    { pathname, locale: countrySlug, routeGroup: "marketing.exam_hub.lessons_topic" },
  );
}

export default async function PathwayLessonTopicClusterPage({ params, searchParams }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, topicSlug } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/topics/${topicSlug}`;
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();

  const base = marketingPathwayLessonsIndexPath(pathway);
  const basePrefix = (base.split("?")[0] ?? base).replace(/\/$/, "");
  const topicBase = marketingPathwayLessonTopicClusterPath(pathway, topicSlug);
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSizeRequested = Number(sp.pageSize ?? String(PATHWAY_HUB_PAGE_SIZE_DEFAULT)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;

  let pageResult: Awaited<ReturnType<typeof getLessonsForTopicPage>>;
  try {
    pageResult = await getLessonsForTopicPage(
      pathway.id,
      topicSlug,
      pageRequested,
      pageSizeRequested,
      lessonContentLocale,
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
      event: "hub_data_load_failed",
      pathname,
      locale: countrySlug,
      country: countrySlug,
      examCode,
      dependency: "getLessonsForTopicPage",
      error_message: message.slice(0, 500),
    });
    recordRouteRenderFallback({
      fallbackType: "hub_data_load_failed",
      pathname,
      pathwayId: pathway.id,
      examCode,
      country: countrySlug,
      dependencyName: "getLessonsForTopicPage",
    });
    return <TopicClusterLoadFailed pathway={pathway} base={base} />;
  }

  if (pageResult.total === 0) notFound();
  if (pageRequested !== pageResult.page) {
    redirect(pageResult.page > 1 ? `${topicBase}?page=${pageResult.page}` : topicBase);
  }

  let topicClusters: Awaited<ReturnType<typeof listTopicClusters>> = [];
  try {
    topicClusters = await listTopicClusters(pathway.id, lessonContentLocale);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
      event: "hub_data_load_failed",
      pathname,
      locale: countrySlug,
      country: countrySlug,
      examCode,
      dependency: "listTopicClusters",
      error_message: message.slice(0, 500),
    });
    recordRouteRenderFallback({
      fallbackType: "hub_data_load_failed",
      pathname,
      pathwayId: pathway.id,
      examCode,
      country: countrySlug,
      dependencyName: "listTopicClusters",
    });
  }

  const lessons = pageResult.items.filter(pathwayLessonHasRenderableHubSlug);
  const label = topicClusters.find((t) => t.topicSlug === topicSlug)?.label ?? topicSlug.replace(/-/g, " ");
  const { crumbs, schemaItems } = pathwayTopicClusterBreadcrumbs(pathway, topicSlug, label);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={base} className="text-sm font-medium text-primary hover:underline">
        ← All lessons ({pathway.shortName})
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase text-primary">{pathway.displayName}</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[var(--theme-heading-text)]">
        {label} · {pathway.shortName}
      </h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        {label} lessons for {pathway.displayName}: same {pathway.countrySlug === "canada" ? "Canadian" : "US"} exam scope as
        the parent hub—topics here are not mixed with other countries or license levels.
      </p>

      <div className="mt-6">
        <PathwayTopicClusterSiblingNav
          lessonsBasePath={base}
          topicClusters={topicClusters}
          currentTopicSlug={topicSlug}
        />
      </div>

      {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}

      <ul className="mt-8 space-y-4">
        {lessons.map((l) => {
          const href = pathwayLessonMarketingDetailHref(base, l.slug);
          if (!href) return null;
          const pathOnly = href.split("?")[0] ?? href;
          if (!pathOnly.startsWith(basePrefix)) {
            safeServerLog("exam_pathway_hub", "lesson_link_mismatch_suppressed", {
              event: "lesson_link_mismatch_suppressed",
              lessons_base: base.slice(0, 160),
              slug: l.slug.slice(0, 120),
            });
            return null;
          }
          return (
            <li key={l.slug} className="nn-card p-4">
              <Link href={href} className="text-lg font-semibold text-primary hover:underline">
                {l.title}
              </Link>
              <p className="mt-2 text-sm text-muted">{l.seoDescription}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link
                  href={`/app/questions?pathwayId=${encodeURIComponent(pathway.id)}&topic=${encodeURIComponent(l.topic)}`}
                  className="font-semibold text-primary hover:underline"
                >
                  Practice questions for “{l.topic}” (app) →
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 nn-card p-4 text-sm text-muted">
        <p>
          <Link href={buildExamPathwayPath(pathway)} className="font-semibold text-primary hover:underline">
            {pathway.shortName} exam hub
          </Link>{" "}
          ·{" "}
          <Link href={buildExamPathwayPath(pathway, "questions")} className="font-semibold text-primary hover:underline">
            {pathway.shortName} question bank
          </Link>
        </p>
      </div>

      <PathwayLessonPagination
        basePath={topicBase}
        page={pageResult.page}
        pageCount={pageResult.pageCount}
        total={pageResult.total}
        pageSize={pageResult.pageSize}
      />
    </div>
  );
}
