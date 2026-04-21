import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, ClipboardList, Layers, LineChart, Timer } from "lucide-react";
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
import { marketingExamHubBasePath, marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
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
import { StudyModeCards } from "@/components/study/study-mode-cards";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import {
  classifyQuestionTopicIntoLessonCategory,
  questionCategoryStructureForPathway,
} from "@/lib/questions/pathway-question-category-structure";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string }>;
  searchParams?: Promise<{ topic?: string; topicSlug?: string }>;
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
  const countryLabel = pathway.countrySlug === "canada" ? "Canada" : "US";
  const examName = pathwayRegionAwareExamName(pathway);
  const lessonsHref = marketingPathwayLessonsIndexPath(pathway);
  const catHref = buildExamPathwayPath(pathway, "cat");
  const questionsHubPath = buildExamPathwayPath(pathway, "questions");

  const appQuestionsScoped = isTopicNarrowed
    ? pathwayAppQuestionBankTopicHref(pathway, topicFilterTrim, topicSlugFromUrl || clusterSlugForLessons || undefined)
    : loginWithCallback(`/app/questions?${new URLSearchParams({ pathwayId: pathway.id }).toString()}`);

  // Stat card values — use snapshot counts when available
  const questionCount = questionSnapshot?.status === "ok" ? questionSnapshot.pathwayScopedCount : null;
  const adaptiveCount = questionSnapshot?.status === "ok" ? questionSnapshot.adaptiveEligibleCount : null;

  const heroSubtitle = isTopicNarrowed
    ? `Showing questions for ${displayTopicLabel} — same scope and language as ${examName}.`
    : `Board-style vignettes and rationales written for ${examName} (${countryLabel}). Sign in to practice with your plan.`;

  const topicClusters = isTopicNarrowed ? [] : await listTopicClusters(pathway.id, lessonContentLocale);
  const groupedTopicSets = groupQuestionSetsByLessonCategory(topicClusters, pathway, lessonsHref);
  const mixedAllTopicsHref = loginWithCallback(
    `/app/questions?${new URLSearchParams({ pathwayId: pathway.id }).toString()}`,
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
          { label: "Start practising", href: appQuestionsScoped, variant: "primary" },
          { label: "Browse lessons", href: lessonsHref, variant: "outline" },
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
            primaryCta={{ label: "Start available topics", href: lessonsHref }}
            secondaryCtas={[
              { label: "Try CAT exam", href: catHref },
              { label: "Create account", href: "/signup", variant: "ghost" },
            ]}
          />
        </div>
      ) : null}

      {/* 3. Study mode cards */}
      <div className="mt-8">
        <StudyModeCards
          heading="Start here"
          cards={[
            {
              icon: Timer,
              title: "New to studying? Practice by topic",
              description: "Choose one clinical category and build confidence with focused sets.",
              cta: "Practice by topic",
              href: appQuestionsScoped,
              accent: "success",
            },
            {
              icon: ClipboardList,
              title: "Want exam-style practice? Take a mixed quiz",
              description: "Run a mixed question session across categories for broader readiness.",
              cta: "Take mixed quiz",
              href: mixedAllTopicsHref,
              accent: "brand",
            },
            {
              icon: LineChart,
              title: "Ready for the real test? Take CAT Readiness Exam",
              description: "Adaptive exam flow that adjusts to your performance like real testing.",
              cta: "Open CAT readiness",
              href: catHref,
              accent: "purple",
            },
          ]}
        />
      </div>

      {!isTopicNarrowed && groupedTopicSets.length > 0 ? (
        <section id="question-set-library" className="mt-8" aria-labelledby="question-set-library-heading">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
            <h2 id="question-set-library-heading" className="text-base font-semibold text-[var(--theme-heading-text)]">
              Practice by lesson category
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
              {topicClusters.length} {topicClusters.length === 1 ? "question set" : "question sets"}
            </span>
          </div>

          <div className="space-y-6">
            {groupedTopicSets.map((section) => (
              <section key={section.id} className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
                <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{section.title}</h3>
                {section.description ? (
                  <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{section.description}</p>
                ) : null}

                {section.topicSets.length > 0 ? (
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {section.topicSets.map((topicSet) => (
                      <li key={topicSet.topicSlug} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
                        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{topicSet.label}</p>
                        <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
                          {topicSet.count} {topicSet.count === 1 ? "question" : "questions"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                          <a href={topicSet.practiceHref} className="text-[var(--semantic-brand)] hover:underline">
                            Practice questions
                          </a>
                          <a href={topicSet.lessonReviewHref} className="text-[var(--theme-heading-text)] hover:underline">
                            Review lesson
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {(section.subsections ?? []).length > 0 ? (
                  <div className="mt-5 space-y-4">
                    {section.subsections?.map((sub) => (
                      <div key={sub.id}>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                          {sub.title}
                        </h4>
                        {sub.topicSets.length > 0 ? (
                          <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {sub.topicSets.map((topicSet) => (
                              <li key={topicSet.topicSlug} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
                                <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{topicSet.label}</p>
                                <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
                                  {topicSet.count} {topicSet.count === 1 ? "question" : "questions"}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                                  <a href={topicSet.practiceHref} className="text-[var(--semantic-brand)] hover:underline">
                                    Practice questions
                                  </a>
                                  <a href={topicSet.lessonReviewHref} className="text-[var(--theme-heading-text)] hover:underline">
                                    Review lesson
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {!isTopicNarrowed ? (
        <section className="mt-8 rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">All Topics Practice</h2>
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
            Random mixed questions across all categories to build broad exam readiness.
          </p>
          <a
            href={mixedAllTopicsHref}
            className="mt-3 inline-flex min-h-[40px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Start mixed practice
          </a>
        </section>
      ) : null}

      {!isTopicNarrowed ? (
        <section className="mt-6 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)] p-5">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">CAT Readiness Exam</h2>
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
            Adaptive exam mode that changes difficulty based on your performance, similar to real exam behavior.
          </p>
          <a
            href={catHref}
            className="mt-3 inline-flex min-h-[40px] items-center justify-center rounded-full bg-[var(--semantic-success)] px-5 py-2 text-sm font-semibold text-[var(--semantic-success-contrast)] hover:opacity-90"
          >
            Open CAT readiness
          </a>
        </section>
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
              href={questionsHubPath}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2 hover:no-underline"
            >
              ← Clear topic filter
            </a>
          </aside>
          <PathwayQuestionHubRelatedLessons
            topicLabel={displayTopicLabel}
            lessonsBasePath={marketingPathwayLessonsIndexPath(pathway)}
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
          { label: "Clinical lessons", href: lessonsHref },
          { label: "Adaptive CAT", href: catHref },
          { label: "Practice exams", href: HUB.practiceExams },
          { label: "Exam overview", href: overviewHref },
        ]}
      />
    </main>
  );
}

type GroupedTopicSet = {
  topicSlug: string;
  label: string;
  count: number;
  practiceHref: string;
  lessonReviewHref: string;
};

type QuestionCategorySection = {
  id: string;
  title: string;
  description?: string;
  topicSets: GroupedTopicSet[];
  subsections?: Array<{ id: string; title: string; topicSets: GroupedTopicSet[] }>;
};

function groupQuestionSetsByLessonCategory(
  clusters: Array<{ topicSlug: string; label: string; count: number }>,
  pathway: ExamPathwayDefinition,
  lessonsHref: string,
): QuestionCategorySection[] {
  const withLinks = clusters.map((cluster) => ({
    ...cluster,
    practiceHref: pathwayAppQuestionBankTopicHref(pathway, cluster.label, cluster.topicSlug),
    lessonReviewHref: `${lessonsHref}?q=${encodeURIComponent(cluster.label)}`,
  }));

  const structure = questionCategoryStructureForPathway(pathway.id);
  return structure.map((category) => {
    const categorySets = withLinks.filter((set) => classifyQuestionTopicIntoLessonCategory(set.label, pathway.id).categoryId === category.id);
    const subsections = category.subcategories
      ?.map((sub) => ({
        id: sub.id,
        title: sub.title,
        topicSets: categorySets.filter((set) => classifyQuestionTopicIntoLessonCategory(set.label, pathway.id).subcategoryId === sub.id),
      }))
      .filter((sub) => sub.topicSets.length > 0);
    const topLevelSets = subsections?.length
      ? categorySets.filter((set) => !classifyQuestionTopicIntoLessonCategory(set.label, pathway.id).subcategoryId)
      : categorySets;
    return {
      id: category.id,
      title: category.title,
      description: category.description,
      topicSets: topLevelSets,
      ...(subsections?.length ? { subsections } : {}),
    };
  }).filter((section) => section.topicSets.length > 0 || (section.subsections?.length ?? 0) > 0);
}
