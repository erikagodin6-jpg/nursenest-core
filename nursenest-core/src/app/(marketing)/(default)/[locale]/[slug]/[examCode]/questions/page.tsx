import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { buildAlliedGlobalHubPath, isAlliedHealthPathway } from "@/lib/allied/allied-global-pathway";
import { BookOpen, ClipboardList, Layers } from "lucide-react";
import { NpQuestionsHubBoardLinks } from "@/components/exam-pathways/np-questions-hub-board-links";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { loadMarketingExamHubOptionalBlocks } from "@/lib/exam-pathways/marketing-hub-optional-data";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { HUB, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { getNpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PathwayQuestionHubRelatedLessons } from "@/components/pathway-lessons/pathway-question-hub-related-lessons";
import {
  humanizeTopicSlug,
  pathwayAppQuestionBankTopicHref,
} from "@/components/lessons/pathway-lesson-link-practice";
import {
  marketingExamHubBasePath,
  marketingPathwayLessonsIndexPath,
  mergeMarketingPathQuery,
  withAlliedProfessionMarketingQuery,
} from "@/lib/lessons/lesson-routes";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import { isAlliedMarketingCorePathwayId, ALLIED_PROFESSION_QUERY_PARAM } from "@/lib/lessons/canonical-lessons-hubs";
import { resolveTopicSlugForPathwayTopicLabel } from "@/lib/lessons/lesson-question-cross-links";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import {
  getRelatedPathwayLessons,
  RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL,
  RELATED_LESSONS_FOR_TOPIC_CAP,
  RELATED_PATHWAY_LESSONS_LIMIT,
  listTopicClusters,
} from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayQuestionsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { PathwayHero } from "@/components/study/pathway-hero";
import { PathwayStatsCards } from "@/components/study/pathway-stats-cards";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import { MarketingPracticeQuestionsHubClient } from "@/components/marketing/marketing-practice-questions-hub-client";
import { loadPathwayPracticeBodySystemHubAggregates } from "@/lib/questions/pathway-practice-body-system-aggregates";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams?: Promise<{ topic?: string; topicSlug?: string; alliedProfession?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const questionsPath = `${pathname}/questions`;
  const sp = searchParams ? await searchParams : {};
  const topicFilter = sp.topic?.trim() ?? "";
  const topicSlugParam = sp.topicSlug?.trim().toLowerCase() ?? "";
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname: questionsPath });
      if (!pathway) return {};
      const canonicalPath = buildExamPathwayPath(pathway, "questions");
      const canonical = absoluteUrl(canonicalPath);
      const narrowedLabel = topicFilter || (topicSlugParam ? humanizeTopicSlug(topicSlugParam) : "");
      const title = narrowedLabel
        ? `${narrowedLabel} · Practice questions · ${pathway.displayName} | NurseNest`
        : `Practice questions · ${pathway.displayName} | NurseNest`;
      const description = narrowedLabel
        ? `Board-style items for ${pathway.shortName} focused on ${narrowedLabel}. Sign in to run sets that stay inside this exam's scope.`
        : `Clinical vignettes and rationales scoped to ${pathway.shortName} (${pathway.countrySlug === "canada" ? "Canada" : "US"}). Sign in to practice with your plan.`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "website" },
        ...(narrowedLabel ? { robots: { index: false, follow: true } } : {}),
      };
    },
    { pathname: questionsPath, locale, routeGroup: "marketing.exam_hub.questions" },
  );
}

export default async function ExamPathwayQuestionsHubPage({ params, searchParams }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const sp = searchParams ? await searchParams : {};
  const topicFilter = sp.topic?.trim() ?? "";
  const topicSlugFromUrl = sp.topicSlug?.trim().toLowerCase() ?? "";
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname: `${pathname}/questions` });
  if (!pathway) notFound();
  if (isAlliedHealthPathway(pathway)) {
    const spEntries = searchParams ? await searchParams : {};
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(spEntries)) {
      if (typeof value === "string" && value.trim()) qs.set(key, value);
    }
    const dest = buildAlliedGlobalHubPath("questions");
    permanentRedirect(qs.size > 0 ? `${dest}?${qs.toString()}` : dest);
  }

  const rawAlliedProf = typeof sp.alliedProfession === "string" ? sp.alliedProfession.trim().toLowerCase() : "";
  const alliedProfessionResolved =
    isAlliedMarketingCorePathwayId(pathway.id) && rawAlliedProf
      ? getAlliedProfessionByProfessionKey(rawAlliedProf)
      : null;
  const alliedProfessionKey = alliedProfessionResolved?.professionKey ?? "";

  const { questionSnapshot, pathwayLessonCount } = await loadMarketingExamHubOptionalBlocks(pathway, {
    pathname: `${pathname}/questions`,
    locale,
    country: locale,
    examCode,
    pathwayId: pathway.id,
    roleTrack: slug,
  });

  const topicFilterTrim = topicFilter.trim();
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();
  let relatedLessonsForTopic: Awaited<ReturnType<typeof getRelatedPathwayLessons>> = [];

  let clusterSlugForLessons: string | null = topicSlugFromUrl || null;
  if (!clusterSlugForLessons && topicFilterTrim) {
    try {
      clusterSlugForLessons = await resolveTopicSlugForPathwayTopicLabel(pathway.id, topicFilterTrim);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
        event: "hub_data_load_failed",
        pathname: `${pathname}/questions`,
        locale,
        country: locale,
        examCode,
        dependency: "resolveTopicSlugForPathwayTopicLabel",
        error_message: message.slice(0, 500),
      });
      recordRouteRenderFallback({
        fallbackType: "hub_data_load_failed",
        pathname: `${pathname}/questions`,
        pathwayId: pathway.id,
        examCode,
        country: locale,
        dependencyName: "resolveTopicSlugForPathwayTopicLabel",
      });
      clusterSlugForLessons = null;
    }
  }

  if (clusterSlugForLessons) {
    try {
      relatedLessonsForTopic = (
        await getRelatedPathwayLessons(
          pathway.id,
          clusterSlugForLessons,
          RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL,
          Math.min(RELATED_PATHWAY_LESSONS_LIMIT, RELATED_LESSONS_FOR_TOPIC_CAP),
          lessonContentLocale,
        )
      ).filter(pathwayLessonHasRenderableHubSlug);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
        event: "hub_data_load_failed",
        pathname: `${pathname}/questions`,
        locale,
        country: locale,
        examCode,
        dependency: "getRelatedPathwayLessons",
        error_message: message.slice(0, 500),
      });
      recordRouteRenderFallback({
        fallbackType: "hub_data_load_failed",
        pathname: `${pathname}/questions`,
        pathwayId: pathway.id,
        examCode,
        country: locale,
        dependencyName: "getRelatedPathwayLessons",
      });
      relatedLessonsForTopic = [];
    }
  }

  const displayTopicLabel = topicFilterTrim || (topicSlugFromUrl ? humanizeTopicSlug(topicSlugFromUrl) : "");
  const isTopicNarrowed = Boolean(topicFilterTrim || topicSlugFromUrl);

  const hubBase = marketingExamHubBasePath(pathway);
  const { crumbs, schemaItems } = pathwayQuestionsHubBreadcrumbs(pathway);
  const overviewHref = hubBase;
  const npAliasSegment = getNpPracticeTestLandingCopy(locale, slug, examCode) ? examCode : undefined;
  const boardLinkContext = pathwayMarketingHubLinkContext(pathway, npAliasSegment);
  const examName = pathwayRegionAwareExamName(pathway);
  const lessonsHref = marketingPathwayLessonsIndexPath(pathway);
  const lessonsHrefWithProfession = alliedProfessionKey
    ? mergeMarketingPathQuery(lessonsHref, { [ALLIED_PROFESSION_QUERY_PARAM]: alliedProfessionKey })
    : lessonsHref;
  const catHref = buildExamPathwayPath(pathway, "cat");
  const catHrefWithProfession = alliedProfessionKey
    ? withAlliedProfessionMarketingQuery(catHref, alliedProfessionKey)
    : catHref;
  const catShortLabel = catPathwayShortCatLabel(pathway);
  const questionsHubPath = buildExamPathwayPath(pathway, "questions");
  const questionsHubPathWithProfession = alliedProfessionKey
    ? withAlliedProfessionMarketingQuery(questionsHubPath, alliedProfessionKey)
    : questionsHubPath;

  const appQuestionsScoped = isTopicNarrowed
    ? pathwayAppQuestionBankTopicHref(pathway, topicFilterTrim, topicSlugFromUrl || clusterSlugForLessons || undefined, {
        alliedProfession: alliedProfessionKey || undefined,
      })
    : loginWithCallback(
        `/app/questions?${new URLSearchParams({
          pathwayId: pathway.id,
          preset: "pathway_mixed",
          ...(alliedProfessionKey ? { alliedProfession: alliedProfessionKey } : {}),
        }).toString()}`,
      );

  // Stat card values — use snapshot counts when available
  const questionCount = questionSnapshot?.status === "ok" ? questionSnapshot.pathwayScopedCount : null;
  const adaptiveCount = questionSnapshot?.status === "ok" ? questionSnapshot.adaptiveEligibleCount : null;

  const heroSubtitle = isTopicNarrowed
    ? `Showing questions for ${displayTopicLabel} — same scope and language as ${examName}.`
    : "Choose a practice mode, select body systems, and review rationales after each question.";

  const topicClustersForDrawer = isTopicNarrowed ? [] : await listTopicClusters(pathway.id, lessonContentLocale);
  const hubAggregates = isTopicNarrowed ? [] : await loadPathwayPracticeBodySystemHubAggregates(pathway.id);
  if (process.env.NODE_ENV === "development" && !isTopicNarrowed) {
    const totalQ = hubAggregates.reduce((s, a) => s + a.questionCount, 0);
    const unc = hubAggregates.find((a) => a.id === "uncategorized")?.questionCount ?? 0;
    safeServerLog("practice_questions_hub", "hub_inventory_dev", {
      pathwayId: pathway.id,
      categoryRowCount: hubAggregates.length,
      totalQuestionCount: totalQ,
      uncategorizedCount: unc,
      normalizedCategoryUsageIds: hubAggregates
        .filter((a) => a.questionCount > 0)
        .map((a) => a.id)
        .join(","),
      fetchNote: "aggregates_hydrated",
    });
  }
  const mixedAllTopicsHref = loginWithCallback(
    `/app/questions?${new URLSearchParams({
      pathwayId: pathway.id,
      preset: "pathway_mixed",
      ...(alliedProfessionKey ? { alliedProfession: alliedProfessionKey } : {}),
    }).toString()}`,
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />

      {/* 1. Hero */}
      <PathwayHero
        title={`${examName} Practice Questions`}
        subtitle={heroSubtitle}
        backLink={{ label: `${pathway.shortName} overview`, href: overviewHref }}
        ctas={[
          {
            label: isTopicNarrowed ? "Open question bank" : "Start mixed practice",
            href: isTopicNarrowed ? appQuestionsScoped : mixedAllTopicsHref,
            variant: "primary",
          },
          { label: "Browse lessons", href: lessonsHrefWithProfession, variant: "outline" },
          { label: "Create account", href: "/signup", variant: "ghost" },
        ]}
      />

      {/* 2. Stat cards */}
      {(questionCount !== null || adaptiveCount !== null || pathwayLessonCount !== undefined) ? (
        <div className="mt-5">
          <PathwayStatsCards
            stats={[
              ...(questionCount !== null
                ? [{ value: questionCount, label: "Practice questions", icon: ClipboardList, accent: "brand" as const }]
                : []),
              ...(adaptiveCount !== null
                ? [{ value: adaptiveCount, label: "CAT-eligible items", icon: Layers, accent: "info" as const }]
                : []),
              ...(typeof pathwayLessonCount === "number"
                ? [{ value: pathwayLessonCount, label: "Lessons available", icon: BookOpen, accent: "success" as const }]
                : []),
            ]}
          />
        </div>
      ) : null}

      {/* Empty state when no questions exist */}
      {questionSnapshot?.status === "ok" && questionSnapshot.pathwayScopedCount === 0 ? (
        <div className="mt-6">
          <ContentEmptyState
            variant="questions"
            primaryCta={{ label: "Start available topics", href: lessonsHrefWithProfession }}
            secondaryCtas={[
              { label: `Open ${catShortLabel}`, href: catHrefWithProfession },
              { label: "Create account", href: "/signup", variant: "ghost" },
            ]}
          />
        </div>
      ) : null}

      {!isTopicNarrowed && !(questionSnapshot?.status === "ok" && questionSnapshot.pathwayScopedCount === 0) ? (
        <div className="mt-8">
            <MarketingPracticeQuestionsHubClient
            pathway={pathway}
            examDisplayName={examName}
            aggregates={hubAggregates}
            topicClusters={topicClustersForDrawer.map((c) => ({
              topicSlug: c.topicSlug,
              label: c.label,
              count: c.count,
            }))}
            lessonsHref={lessonsHrefWithProfession}
            marketingCatHref={catHrefWithProfession}
            alliedProfessionKey={alliedProfessionKey || undefined}
          />
        </div>
      ) : null}

      {/* 4. Content area — topic-narrowed view or NP board links */}
      {isTopicNarrowed ? (
        <div className="mt-8 space-y-4">
          <aside className="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-5">
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Filtered to one clinical topic</p>
            <p className="mt-1 text-sm leading-6 text-[var(--theme-muted-text)]">
              You landed here from a lesson or topic link. Open the full hub to see every topic for this pathway.
            </p>
            <a
              href={questionsHubPathWithProfession}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2 hover:no-underline"
            >
              ← Clear topic filter
            </a>
          </aside>
          <PathwayQuestionHubRelatedLessons
            topicLabel={displayTopicLabel}
            lessonsBasePath={lessonsHrefWithProfession}
            lessons={relatedLessonsForTopic}
          />
        </div>
      ) : null}

      {pathway.roleTrack === "np" ? (
        <div className="mt-8 rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-5 shadow-[var(--semantic-shadow-soft)]">
          <NpQuestionsHubBoardLinks pathwayId={pathway.id} linkContext={boardLinkContext} />
        </div>
      ) : null}

      {/* Bottom nav */}
      <StudyBottomNav
        relatedLinks={[
          { label: "Clinical lessons", href: lessonsHrefWithProfession },
          { label: "Adaptive CAT", href: catHrefWithProfession },
          { label: "Practice exams", href: HUB.practiceExams },
          { label: "Exam overview", href: overviewHref },
        ]}
      />
    </main>
  );
}
