import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PathwayLessonContentLocaleBanner } from "@/components/lessons/pathway-lesson-content-locale-banner";
import { FnpLessonsHub } from "@/components/pathway-lessons/fnp-lessons-hub";
import { NclexPnLessonsHub } from "@/components/pathway-lessons/nclex-pn-lessons-hub";
import { NclexRnLessonsHub } from "@/components/pathway-lessons/nclex-rn-lessons-hub";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { buildExamPathwayPath, resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import {
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  getPathwayLessonsPage,
  listTopicClusters,
  normalizePathwayHubSearchQuery,
} from "@/lib/lessons/pathway-lesson-loader";
import { PathwayLessonsHubSearch } from "@/components/pathway-lessons/pathway-lessons-hub-search";
import { PathwayTopicClusterNav } from "@/components/pathway-lessons/pathway-topic-cluster-nav";
import {
  pathwayLessonHubH1,
  pathwayLessonHubMetaDescription,
  pathwayLessonHubMetaTitle,
} from "@/lib/lessons/pathway-lesson-hub-seo";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
} from "@/lib/lessons/pathway-lesson-types";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayLessonsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
};

function PathwayLessonsEmptyHub({
  pathway,
  lessonsBasePath,
}: {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
}) {
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const overviewHref = buildExamPathwayPath(pathway);
  const upcoming = pathway.status === "upcoming" || pathway.acquisitionMode === "waitlist";

  return (
    <div className="nn-card mt-10 border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-6 sm:p-8">
      <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Lesson library for this pathway</h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
        {upcoming
          ? "This track is still ramping up in NurseNest. You can start with pathway-scoped questions and public practice exams now; structured lessons will appear here as they ship."
          : "No public lesson pages are available for this pathway yet. Use the question bank hub and practice exams to start studying; lessons will appear here when published for this track."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={questionsHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Open question bank hub
        </Link>
        <Link
          href={HUB.practiceExams}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
        >
          Practice exams
        </Link>
        <Link href="/signup" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5">
          Create account
        </Link>
        <Link href={overviewHref} className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card">
          Back to exam overview
        </Link>
      </div>
      <p className="mt-4 text-xs text-muted">
        Path: <span className="font-mono">{lessonsBasePath}</span>
      </p>
    </div>
  );
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const sp = await searchParams;
  const q = normalizePathwayHubSearchQuery(sp.q);
  const pathway = resolveExamPathwayFromMarketingHubSegment(countrySlug, roleTrack, examCode);
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
}

export default async function PathwayLessonsHubPage({ params, searchParams }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode } = await params;
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const pathway = resolveExamPathwayFromMarketingHubSegment(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();

  const hubBase = `/${countrySlug}/${roleTrack}/${examCode}`;
  const base = `${hubBase}/lessons`;
  const sp = await searchParams;
  const pageRequested = Math.max(1, Number(sp.page ?? "1") || 1);
  const pageSizeRequested = Number(sp.pageSize ?? String(PATHWAY_HUB_PAGE_SIZE_DEFAULT)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;
  const qEffective = normalizePathwayHubSearchQuery(sp.q);
  const listOpts = typeof sp.q === "string" && sp.q.trim().length > 0 ? { q: sp.q } : undefined;

  const pageResult = await getPathwayLessonsPage(
    pathway.id,
    pageRequested,
    pageSizeRequested,
    lessonContentLocale,
    listOpts,
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
  const topics = await listTopicClusters(pathway.id, lessonContentLocale);
  const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);
  const isNclexRnHub = pathway.id === "us-rn-nclex-rn" || pathway.id === "ca-rn-nclex-rn";
  const nclexRnRegion = pathway.id === "ca-rn-nclex-rn" ? "ca" : "us";
  const isUsNclexPnHub = pathway.id === "us-lpn-nclex-pn";
  const isUsFnpHub = pathway.id === "us-np-fnp";
  const isCaRexPnHub = pathway.id === "ca-rpn-rex-pn";

  if (pageResult.total === 0) {
    const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);
    if (qEffective) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-12">
          <BreadcrumbJsonLd items={schemaItems} />
          <div className="mb-6">
            <BreadcrumbTrail items={crumbs} />
          </div>
          <Link href={buildExamPathwayPath(pathway)} className="text-sm font-medium text-primary hover:underline">
            ← {pathway.shortName} hub
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">{pathwayLessonHubH1(pathway)}</h1>
          <p className="mt-3 text-[var(--theme-muted-text)]">
            No lessons matched &ldquo;{qEffective}&rdquo; for {pathway.shortName}. Try a shorter term, browse by topic, or clear
            the search.
          </p>
          <div className="mt-8 space-y-6">
            <PathwayLessonsHubSearch basePath={base} initialQuery={qEffective} />
            <Link href={base} className="text-sm font-semibold text-primary underline">
              View all lessons (clear search)
            </Link>
          </div>
          <MarketingStudyCrossLinks className="mt-14" />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <Link href={buildExamPathwayPath(pathway)} className="text-sm font-medium text-primary hover:underline">
          ← {pathway.shortName} hub
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">{pathwayLessonHubH1(pathway)}</h1>
        <p className="mt-3 text-[var(--theme-muted-text)]">
          Exam-scoped clinical lessons for {pathway.countrySlug === "canada" ? "Canada" : "the United States"} ({pathway.shortName}
          ). When lesson pages go live for this pathway, they will be listed here.
        </p>
        {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}
        <PathwayLessonsEmptyHub pathway={pathway} lessonsBasePath={base} />
        <MarketingStudyCrossLinks className="mt-14" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={buildExamPathwayPath(pathway)} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} hub
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">{pathwayLessonHubH1(pathway)}</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        {isUsNclexPnHub ? (
          <>
            Clinical lessons for US LVN/LPN candidates, organized by NCLEX-PN Client Needs, focused on scope-safe judgment and
            delegation, not textbook lists. Pair each lesson with pathway-scoped questions and CAT practice. Subscription gates
            full lesson depth; previews remain discoverable.
          </>
        ) : isUsFnpHub ? (
          <>
            Advanced-practice lessons for US Family NP candidates, structured for board-style assessment → diagnosis → plan →
            evaluation across the lifespan (prenatal through geriatrics), not RN-level task lists. Pair each lesson with
            case-based questions and exam simulations; subscription gates full lesson depth; previews remain discoverable.
          </>
        ) : isNclexRnHub ? (
          pathway.id === "ca-rn-nclex-rn" ? (
            <>
              Clinical lessons for Canadian RN candidates, written for decision-making and safety, not isolated facts. Content
              follows the NCLEX-RN Client Needs structure below; pair each lesson with pathway-scoped questions and CAT
              practice. Subscription gates full lesson depth; previews remain discoverable.
            </>
          ) : (
            <>
              Clinical lessons for US RN candidates, written for decision-making and safety, not isolated facts. Content follows
              the NCLEX-RN Client Needs structure below; pair each lesson with pathway-scoped questions, adaptive practice, and
              performance feedback. Lessons alone are not a full prep pathway. Subscription gates full lesson depth; previews
              remain discoverable.
            </>
          )
        ) : isCaRexPnHub ? (
          <>
            Clinical lessons for Canadian practical nursing (RPN) candidates preparing for the REx-PN exam: scope-safe judgment,
            delegation, and Canadian regulatory context—not generic PN content mixed with US NCLEX-PN. Pair each lesson with
            pathway-scoped questions and practice. Subscription gates full lesson depth; previews remain discoverable.
          </>
        ) : (
          <>
            Exam-scoped clinical lessons for this track only. Terminology and scope match{" "}
            {pathway.countrySlug === "canada" ? "Canada" : "United States"} ({pathway.shortName}). Deeper sections unlock with
            a matching subscription; previews stay indexable for discovery.
          </>
        )}
      </p>

      {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}

      <div className="mt-8">
        <PathwayLessonsHubSearch basePath={base} initialQuery={qEffective} />
      </div>

      {isUsNclexPnHub ? (
        <NclexPnLessonsHub pathway={pathway} lessons={lessons} lessonsBasePath={base} topicClusters={topics} />
      ) : isUsFnpHub ? (
        <FnpLessonsHub pathway={pathway} lessons={lessons} lessonsBasePath={base} topicClusters={topics} />
      ) : isNclexRnHub ? (
        <NclexRnLessonsHub
          pathway={pathway}
          lessons={lessons}
          lessonsBasePath={base}
          topicClusters={topics}
          region={nclexRnRegion}
        />
      ) : (
        <>
          <div className="mt-10">
            <PathwayTopicClusterNav lessonsBasePath={base} topicClusters={topics} pathwayShortName={pathway.shortName} />
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
              All {pathway.shortName} lessons
            </h2>
            <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
              Paginated list — use topic clusters above or search to narrow without loading everything at once.
            </p>
            <ul className="mt-4 space-y-4">
              {lessons.map((l) => {
                const href = pathwayLessonMarketingDetailHref(base, l.slug);
                if (!href) return null;
                return (
                <li key={l.slug} className="nn-card p-4">
                  <p className="text-xs font-medium uppercase text-muted">{l.topic}</p>
                  <Link
                    href={href}
                    className="mt-1 block text-lg font-semibold text-primary hover:underline"
                  >
                    {l.title}
                  </Link>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{l.seoDescription}</p>
                  <p className="mt-3 text-xs text-muted">
                    Full lesson page includes preview sections; subscription unlocks complete depth.
                  </p>
                </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-10 rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm text-muted">
            <p className="font-semibold text-foreground">Recommended study loop</p>
            <p className="mt-1">
              Read a lesson → practice pathway-matched questions → timed or CAT-style review → read rationales → return to the
              next topic in a weak area.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={buildExamPathwayPath(pathway, "questions")} className="font-semibold text-primary">
                {pathway.shortName} question bank hub
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/app/questions" className="font-semibold text-primary">
                App question bank (signed in)
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/app/exams" className="font-semibold text-primary">
                Practice exams
              </Link>
            </div>
          </section>
        </>
      )}

      <MarketingStudyCrossLinks className="mt-14" />

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
