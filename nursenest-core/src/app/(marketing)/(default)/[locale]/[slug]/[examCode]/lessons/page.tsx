import type { Metadata } from "next";
import { ExamFamily } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { PathwayLessonContentLocaleBanner } from "@/components/lessons/pathway-lesson-content-locale-banner";
import { FnpLessonsHub } from "@/components/pathway-lessons/fnp-lessons-hub";
import { NclexPnLessonsHub } from "@/components/pathway-lessons/nclex-pn-lessons-hub";
import { NclexRnLessonsHub } from "@/components/pathway-lessons/nclex-rn-lessons-hub";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { loadPathwayLessonsHubAggregates } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { defaultPathwayLessonContentLocaleForExamHubRoute } from "@/lib/lessons/pathway-lesson-locale";
import {
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  normalizePathwayHubSearchQuery,
} from "@/lib/lessons/pathway-lesson-loader";
import { PathwayLaunchEssentials } from "@/components/pathway-lessons/pathway-launch-essentials";
import { PathwayLessonsNextStepCtas } from "@/components/pathway-lessons/pathway-lessons-next-step-ctas";
import { PathwayLessonsStudyHero } from "@/components/pathway-lessons/pathway-lessons-study-hero";
import { PathwayLessonsResumeHub } from "@/components/pathway-lessons/pathway-lessons-resume-hub";
import { PathwayLessonsGroupedHub } from "@/components/pathway-lessons/pathway-lessons-grouped-hub";
import { pathwayLessonHubMetaDescription, pathwayLessonHubMetaTitle } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";
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

/** When the catalog has no rows yet: still a complete "study hub" with bank, CAT, and account entry points. */
function PathwayLessonsZeroCatalogPanel({ pathway }: { pathway: ExamPathwayDefinition }) {
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const upcoming = pathway.status === "upcoming" || pathway.acquisitionMode === "waitlist";

  return (
    <ContentEmptyState
      variant="lessons"
      body={
        upcoming
          ? `Structured lessons will appear here as this track ships. You can already study with pathway-scoped questions, adaptive CAT practice, and timed practice exams — the same scope you will see in lessons.`
          : `Lessons for ${pathway.shortName} are being finalized. Start with the question bank and CAT sessions — your rationales and weak-area signals are exam-scoped and will align with lessons when they go live.`
      }
      primaryCta={{ label: "Start available topics", href: questionsHref }}
      secondaryCtas={[
        { label: "Try CAT exam", href: catHref },
        { label: "Practice exams", href: HUB.practiceExams, variant: "ghost" },
        { label: "Create account", href: "/signup", variant: "ghost" },
      ]}
    />
  );
}

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

  const { pageResult, questionSnapshot, pathwayLessonTotal, launchBundle, topics } = await loadPathwayLessonsHubAggregates(
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
  const isNclexRnHub = pathway.id === "us-rn-nclex-rn" || pathway.id === "ca-rn-nclex-rn";
  const nclexRnRegion = pathway.id === "ca-rn-nclex-rn" ? "ca" : "us";
  const isUsNclexPnHub = pathway.id === "us-lpn-nclex-pn";
  /** Rich primary-care NP hub (FNP-style explorer). PMHNP keeps topic-grouped hub — lifespan lanes fit psychiatry less well. */
  const isNpPrimaryCareLessonsHub =
    pathway.examFamily === ExamFamily.NP && pathway.id !== "us-np-pmhnp";
  const isCaRexPnHub = pathway.id === "ca-rpn-rex-pn";
  /** Shared practical-nursing hub (US NCLEX-PN + Canada REx-PN). */
  const isPnLessonsHub = isUsNclexPnHub || isCaRexPnHub;

  if (pageResult.total === 0) {
    const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);
    if (qEffective) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <BreadcrumbJsonLd items={schemaItems} />
          <div className="mb-6">
            <BreadcrumbTrail items={crumbs} />
          </div>
          <PathwayLessonsStudyHero
            pathway={pathway}
            lessonsBasePath={base}
            initialQuery={qEffective}
            heroAccent={pathway.examFamily === ExamFamily.NP ? "np" : "default"}
          />
          <PremiumEmptyState
            data-nn-empty="pathway-lessons-search"
            className="mt-6"
            visualLayout="split"
            Icon={Search}
            headline={emptyStateCopy.noSearchResults.headline}
            body={`Nothing matched “${qEffective}” for ${pathway.shortName}. ${emptyStateCopy.noSearchResults.body}`}
            primaryCta={{ label: "View all lessons", href: base, variant: "primary" }}
            secondaryCtas={[
              { label: "Pathway questions", href: buildExamPathwayPath(pathway, "questions"), variant: "secondary" },
            ]}
          />
          <PathwayLiveInventoryStrip
            pathway={pathway}
            questionSnapshot={questionSnapshot}
            lessonCount={pathwayLessonTotal}
            variant="lessons"
          />
          <PathwayLessonsNextStepCtas pathway={pathway} />
          <MarketingStudyCrossLinks className="mt-14" />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <PathwayLessonsStudyHero
          pathway={pathway}
          lessonsBasePath={base}
          showSearch={false}
          heroAccent={pathway.examFamily === ExamFamily.NP ? "np" : "default"}
        />
        <PathwayLessonsNextStepCtas pathway={pathway} emphasizeStudyLoop />
        <PathwayLiveInventoryStrip
          pathway={pathway}
          questionSnapshot={questionSnapshot}
          lessonCount={pathwayLessonTotal}
          variant="lessons"
        />
        {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}
        <PathwayLessonsZeroCatalogPanel pathway={pathway} />
        <MarketingStudyCrossLinks className="mt-14" />
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
  let resumePayload: PathwayHubResumePayload = {
    lastTouched: null,
    nextRecommended: null,
    lessonsCompleted: 0,
    lessonsInProgress: 0,
  };

  const canShowResume =
    Boolean(userId) && scope.hasAccess && canViewFullPathwayLesson(scope, pathway, learnerPath);
  const canShowProgressMap = canShowResume && lessons.length > 0;

  if (canShowResume) {
    const hubSlugs = canShowProgressMap ? lessons.map((l) => l.slug).filter(Boolean) : [];
    const { resume, progressMap: map } = await loadPathwayHubSubscriberData(
      userId,
      scope,
      learnerPath,
      pathway,
      base,
      hubSlugs,
    );
    resumePayload = resume;
    progressMap = map;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>

      <PathwayLessonsStudyHero
        pathway={pathway}
        lessonsBasePath={base}
        initialQuery={qEffective}
        heroAccent={pathway.examFamily === ExamFamily.NP ? "np" : "default"}
      />

      <PathwayLiveInventoryStrip
        pathway={pathway}
        questionSnapshot={questionSnapshot}
        lessonCount={pathwayLessonTotal}
        variant="lessons"
        topicCount={topics.length > 0 ? topics.length : undefined}
      />

      {pageResult.locale ? <PathwayLessonContentLocaleBanner listLocale={pageResult.locale} /> : null}

      <PathwayLessonsNextStepCtas pathway={pathway} />

      {launchBundle && launchBundle.resolved.length > 0 ? (
        <div className="mt-8">
          <PathwayLaunchEssentials bundle={launchBundle} lessonsBasePath={base} />
        </div>
      ) : null}

      {canShowResume && pathwayHubResumeHasContent(resumePayload) ? (
        <div className="mt-6">
          <PathwayLessonsResumeHub pathwayShortName={pathway.shortName} resume={resumePayload} />
        </div>
      ) : null}

      <div id="pathway-lesson-library" className="scroll-mt-24">
        {isPnLessonsHub ? (
          <NclexPnLessonsHub
            pathway={pathway}
            lessons={lessons}
            lessonsBasePath={base}
            topicClusters={topics}
            progressMap={progressMap}
            framing={isCaRexPnHub ? "rex-pn-ca" : "nclex-pn-us"}
          />
        ) : isNpPrimaryCareLessonsHub ? (
          <FnpLessonsHub pathway={pathway} lessons={lessons} lessonsBasePath={base} topicClusters={topics} progressMap={progressMap} />
        ) : isNclexRnHub ? (
          <NclexRnLessonsHub
            pathway={pathway}
            lessons={lessons}
            lessonsBasePath={base}
            topicClusters={topics}
            region={nclexRnRegion}
            progressMap={progressMap}
          />
        ) : (
          <div className="mt-10">
            <PathwayLessonsGroupedHub
              pathway={pathway}
              lessons={lessons}
              lessonsBasePath={base}
              topicClusters={topics}
              progressMap={progressMap}
              canShowProgressMap={canShowProgressMap}
              visualTone={pathway.examFamily === ExamFamily.NP ? "np" : "default"}
            />
          </div>
        )}
      </div>

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
