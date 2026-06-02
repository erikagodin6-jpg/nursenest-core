import React, { type CSSProperties } from "react";
import Link from "next/link";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { LessonHubClinicalModulesStrip } from "@/components/pathway-lessons/lesson-hub-clinical-modules-strip";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import { LessonsHubCategoryTile } from "@/components/pathway-lessons/lessons-hub-category-tile";
import { LessonsHubResumeCompact } from "@/components/pathway-lessons/lessons-hub-resume-compact";
import { PathwayLessonsCurriculumHub } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { loadPathwayHubSubscriberData } from "@/lib/learner/pathway-lesson-continuation";
import { buildLessonCategoryProgress } from "@/lib/lessons/build-lesson-category-progress";
import { EMPTY_QUESTION_SNAPSHOT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { marketingCatCompletePoolUsable } from "@/lib/exam-pathways/pathway-marketing-practice-gates";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingExamHubBasePath, marketingPathwayLessonsCategoryPath } from "@/lib/lessons/lesson-routes";
import { buildMarketingLessonHubSurfaceChips } from "@/lib/marketing/marketing-lesson-hub-surface-chips";
import {
  countPathwayMarketingHubLessonsByCategoryForPathway,
  displayCategoryForPathwayMarketingHubLesson,
  getMarketingLessonsHubCatalogLessons,
  pathwayMarketingHubCategories,
} from "@/lib/lessons/marketing-lessons-hub-category";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import {
  canShowPaidPathwayLessonProgress,
  loadMarketingPathwayLessonProgressSessionContext,
} from "@/lib/lessons/marketing-pathway-lesson-progress-server";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import { lessonsPerfMark } from "@/lib/lessons/lessons-perf";
import { MarketingLessonsHubStickyStudyChrome } from "@/components/pathway-lessons/marketing-lessons-hub-sticky-study-chrome";

type Props = {
  pathway: ExamPathwayDefinition;
  base: string;
  pathname: string;
  routePathLessons: string;
  countrySlug: string;
  roleTrack: string;
  examCode: string;
  lessonContentLocale: string;
};

/** Categories that are consistently exam-critical across all pathways — get a subtle elevated visual treatment. */
const EXAM_CRITICAL_CATEGORY_IDS = new Set([
  "cardiovascular", "respiratory", "pharmacology", "pharmacology_prescribing",
  "neurological", "renal_urinary", "fundamentals_safety", "mental_health",
  "primary_care", "health_assessment", "Cardiovascular", "Respiratory",
  "Pharmacology", "Neurological", "Renal & Urinary", "Mental Health",
  "Safety & Prioritization",
]);

export async function MarketingLessonsHubCategoryFirstIndex({
  pathway,
  base,
  pathname,
  routePathLessons,
  countrySlug,
  roleTrack,
  examCode,
  lessonContentLocale,
}: Props) {
  const categoryIndexT0 = performance.now();
  lessonsPerfMark("route_start", { surface: "marketing_lessons_category_index", pathwayId: pathway.id });

  const catalog = getMarketingLessonsHubCatalogLessons(pathway.id);
  const hubCategories = pathwayMarketingHubCategories(pathway.id);
  const counts = countPathwayMarketingHubLessonsByCategoryForPathway(pathway.id);
  const visibleCategories = hubCategories.filter((cat) => {
    const categoryId = cat.id.trim().toLowerCase();
    if (categoryId === "review_required" || cat.slug === "review-required") return false;
    return (counts.get(cat.id) ?? 0) > 0;
  });
  const shouldFallbackToLessonCards = catalog.length > 0 && visibleCategories.length === 0;

  const progressCtx = await loadMarketingPathwayLessonProgressSessionContext({
    sessionPathname: routePathLessons,
    sessionSurface: "marketing.exam_hub.lessons",
  });
  lessonsPerfMark("catalog_size", {
    surface: "category_index_pre_verify",
    pathwayId: pathway.id,
    elapsed_ms: Math.round(performance.now() - categoryIndexT0),
  });
  lessonsPerfMark("route_end", {
    surface: "marketing_lessons_category_index",
    pathwayId: pathway.id,
    elapsed_ms: Math.round(performance.now() - categoryIndexT0),
  });

  let questionSnapshot = EMPTY_QUESTION_SNAPSHOT;
  let questionSnapshotLoadRejected = false;
  try {
    questionSnapshot = await loadPathwayQuestionBankSnapshot(pathway.id);
  } catch {
    questionSnapshotLoadRejected = true;
  }

  const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const pathwayLabel = pathway.shortName.trim() || pathway.displayName;
  const pageTitle = "Lesson Library";
  const headerDescription = `${pathwayCountryLabel(pathway)} pathway · ${catalog.length.toLocaleString()}+ lessons`;
  const hubTrustBadges = ["Evidence-based content", "Exam-focused", "Created by nurses", "Updated regularly"];
  const overviewHref = marketingExamHubBasePath(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const canStartCat =
    !questionSnapshotLoadRejected && marketingCatCompletePoolUsable(questionSnapshot, pathway.id);

  const lessonHubSurfaceChips = buildMarketingLessonHubSurfaceChips(pathway, {
    canStartCat,
    questionSnapshotLoadRejected,
  });

  const canadaHref =
    pathway.countrySlug === "canada" ? base : (equivalentExamHubUrlAfterRegionToggle(base, "CA") ?? base);
  const usHref =
    pathway.countrySlug === "us" ? base : (equivalentExamHubUrlAfterRegionToggle(base, "US") ?? base);
  const toolbar = (
    <LessonsToolbar
      searchBasePath={base}
      totalCount={catalog.length}
      countryOptions={[
        { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
        { label: "US", href: usHref, active: pathway.countrySlug === "us" },
      ]}
    />
  );

  const canShowResume = canShowPaidPathwayLessonProgress(progressCtx, pathway);
  const viewerSignedIn = Boolean(progressCtx.userId.trim());
  let progressMap: Record<string, PathwayLessonProgressStatus> = {};
  let showPaidProgressChrome = false;
  let hubResume: Awaited<ReturnType<typeof loadPathwayHubSubscriberData>>["resume"] | null = null;
  if (canShowResume && catalog.length > 0) {
    const hubSlugs = catalog.map((l) => l.slug).filter(Boolean);
    const subscriber = await loadPathwayHubSubscriberData(
      progressCtx.userId,
      progressCtx.scope,
      progressCtx.learnerPath,
      pathway,
      base,
      hubSlugs,
    );
    progressMap = subscriber.progressMap;
    hubResume = subscriber.resume;
    showPaidProgressChrome = true;
  }
  const categoryRows = showPaidProgressChrome
    ? hubCategories.filter((cat) => {
        const categoryId = cat.id.trim().toLowerCase();
        return categoryId !== "review_required" && cat.slug !== "review-required";
      })
    : visibleCategories;

  if (process.env.NODE_ENV === "development" || process.env.NN_MARKETING_HUB_PIPELINE_DIAGNOSTICS === "1") {
    console.info("[nn-lessons-category-index]", {
      pathwayId: pathway.id,
      routePathname: routePathLessons,
      catalogCount: catalog.length,
      categoryCount: hubCategories.length,
      visibleCategoryCount: visibleCategories.length,
      countsCount: counts.size,
      fallbackToLessonCards: shouldFallbackToLessonCards,
    });
  }

  if (catalog.length === 0) {
    return (
      <LessonsPageShell
        title={pageTitle}
        subtitle={headerDescription}
        eyebrow={pathwayLabel}
        pathwayTrack={pathway.roleTrack}
        toolbar={toolbar}
        backLink={{ label: `${examName} Overview`, href: overviewHref }}
        trustBadges={hubTrustBadges}
        heroAlign="center"
      >
        <MarketingHubSmokeDiagnosticsJson
          payload={{
            surface: "marketing_pathway_lessons",
            outcome: "category_index_zero_catalog",
            pathwayId: pathway.id,
            routePathname: routePathLessons,
            contentLocale: lessonContentLocale,
            catalogLen: 0,
          }}
        />
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
        <MarketingLessonsHubStickyStudyChrome>
          <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
          <LessonHubClinicalModulesStrip
            pathway={pathway}
            marketingLocale={lessonContentLocale}
            signedIn={viewerSignedIn}
            compact
          />
        </MarketingLessonsHubStickyStudyChrome>
        <div className="mt-6 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">
            No lessons are indexed for this pathway yet.
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            Explore practice questions and adaptive study below while the library expands.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={questionsHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Practice Questions
            </Link>
          </div>
        </div>
      </LessonsPageShell>
    );
  }

  return (
    <LessonsPageShell
      title={pageTitle}
      subtitle={headerDescription}
      eyebrow={pathwayLabel}
      pathwayTrack={pathway.roleTrack}
      toolbar={toolbar}
      backLink={{ label: `${examName} Overview`, href: overviewHref }}
      statCard={{ value: `${catalog.length.toLocaleString()}+`, label: "High-yield lessons" }}
      trustBadges={hubTrustBadges}
      heroAlign="center"
    >
      <MarketingHubSmokeDiagnosticsJson
        payload={{
          surface: "marketing_pathway_lessons",
          outcome: "category_index",
          pathwayId: pathway.id,
          routePathname: routePathLessons,
          contentLocale: lessonContentLocale,
          catalogLen: catalog.length,
          visibleCategoryCount: categoryRows.length,
          fallbackToLessonCards: shouldFallbackToLessonCards,
        }}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <MarketingLessonsHubStickyStudyChrome>
        <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
        <LessonHubClinicalModulesStrip
          pathway={pathway}
          marketingLocale={lessonContentLocale}
          signedIn={viewerSignedIn}
          compact
        />
      </MarketingLessonsHubStickyStudyChrome>
      {questionSnapshotLoadRejected ? (
        <div
          className="mt-3 rounded-xl border border-[var(--semantic-warning)]/40 bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] px-4 py-3 text-sm text-[var(--theme-heading-text)]"
          role="status"
        >
          We could not load practice-question stats for this hub right now, so adaptive CAT availability may be
          wrong until you retry.
        </div>
      ) : null}

      {hubResume && (hubResume.lastTouched || hubResume.nextRecommended) ? (
        <div className="mt-5">
          <LessonsHubResumeCompact resume={hubResume} />
        </div>
      ) : null}

      <section
        id="pathway-lesson-library"
        className="nn-qa-pathway-lessons-hub nn-lessons-hub-layout-h11 mt-8 scroll-mt-8"
        data-nn-qa-pathway-lessons-hub="true"
        data-nn-lessons-hub-layout="h11"
        aria-labelledby="lesson-library-heading"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--semantic-border-soft)] pb-6">
          <div>
            <h2
              id="lesson-library-heading"
              className="nn-marketing-h3 max-w-[min(100%,36rem)] text-[var(--theme-heading-text)]"
              data-testid="browse-clinical-areas-heading"
            >
              Browse by category
            </h2>
            <p className="mt-1.5 text-sm text-[var(--theme-muted-text)]">
              Select a clinical area to view all lessons
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {hubCategories.length} {hubCategories.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {shouldFallbackToLessonCards ? (
          <div className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5">
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
              Lessons are available, but the category index is still syncing.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--theme-muted-text)]">
              Showing the full lesson library so this hub never renders as an empty shell.
            </p>
            <div className="mt-5">
              <PathwayLessonsCurriculumHub lessons={catalog} lessonsBasePath={base} pathwayId={pathway.id} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {categoryRows.map((cat) => {
              const n = counts.get(cat.id) ?? 0;
              const href = marketingPathwayLessonsCategoryPath(pathway, cat.slug);
              const visual = getLessonHubSystemVisual(cat.id);
              const Icon = visual.icon;
              const accentStyle = { "--nn-hub-cat-accent": `var(${visual.accentVar})` } as CSSProperties;
              const isExamCritical = EXAM_CRITICAL_CATEGORY_IDS.has(cat.id);
              const isEmpty = n === 0 && !showPaidProgressChrome;
              const categoryProgress = showPaidProgressChrome
                ? buildLessonCategoryProgress({
                    lessons: catalog.filter(
                      (lesson) =>
                        displayCategoryForPathwayMarketingHubLesson(lesson, pathway.id).id === cat.id,
                    ),
                    progressMap,
                  })
                : null;
              return (
                <LessonsHubCategoryTile
                  key={cat.id}
                  href={href}
                  title={cat.label}
                  description={cat.description}
                  lessonCount={n}
                  accentStyle={accentStyle}
                  icon={<Icon className="h-4 w-4" aria-hidden />}
                  isEmpty={isEmpty}
                  isExamCritical={isExamCritical}
                  showProgress={Boolean(showPaidProgressChrome && categoryProgress)}
                  percentComplete={categoryProgress?.percentComplete ?? 0}
                  completedCount={categoryProgress?.completedCount ?? 0}
                  inProgressCount={categoryProgress?.inProgressCount ?? 0}
                  totalCount={categoryProgress?.totalCount ?? 0}
                />
              );
            })}
          </div>
        )}
      </section>

      <StudyBottomNav compact relatedLinks={lessonHubSurfaceChips} />
    </LessonsPageShell>
  );
}
