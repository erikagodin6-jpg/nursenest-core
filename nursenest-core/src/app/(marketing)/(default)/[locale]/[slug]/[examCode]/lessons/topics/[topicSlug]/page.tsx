import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PathwayLessonContentLocaleBanner } from "@/components/lessons/pathway-lesson-content-locale-banner";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath, resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
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
import { absoluteUrl } from "@/lib/seo/site-origin";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string; topicSlug: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode, topicSlug } = await params;
  const pathway = resolveExamPathwayFromMarketingHubSegment(countrySlug, roleTrack, examCode);
  if (!pathway) return {};
  const canonicalPath = buildExamPathwayPath(pathway, `lessons/topics/${topicSlug}`);
  const canonical = absoluteUrl(canonicalPath);
  const loc = defaultPathwayLessonContentLocaleForExamHubRoute();
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
}

export default async function PathwayLessonTopicClusterPage({ params, searchParams }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, topicSlug } = await params;
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const pathway = resolveExamPathwayFromMarketingHubSegment(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();

  const hubBase = `/${countrySlug}/${roleTrack}/${examCode}`;
  const base = `${hubBase}/lessons`;
  const topicBase = `${base}/topics/${topicSlug}`;
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSizeRequested = Number(sp.pageSize ?? String(PATHWAY_HUB_PAGE_SIZE_DEFAULT)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;

  const pageResult = await getLessonsForTopicPage(
    pathway.id,
    topicSlug,
    pageRequested,
    pageSizeRequested,
    lessonContentLocale,
  );
  if (pageResult.total === 0) notFound();
  if (pageRequested !== pageResult.page) {
    redirect(pageResult.page > 1 ? `${topicBase}?page=${pageResult.page}` : topicBase);
  }

  const lessons = pageResult.items.filter(pathwayLessonHasRenderableHubSlug);
  const topicClusters = await listTopicClusters(pathway.id, lessonContentLocale);
  const label = topicClusters.find((t) => t.topicSlug === topicSlug)?.label ?? topicSlug;
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

      {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}

      <ul className="mt-8 space-y-4">
        {lessons.map((l) => {
          const href = pathwayLessonMarketingDetailHref(base, l.slug);
          if (!href) return null;
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
