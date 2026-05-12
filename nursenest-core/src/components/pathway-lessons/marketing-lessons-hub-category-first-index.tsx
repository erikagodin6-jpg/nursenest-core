import React, { type CSSProperties } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { LessonHubClinicalModulesStrip } from "@/components/pathway-lessons/lesson-hub-clinical-modules-strip";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import { CategoryProgressBar } from "@/components/pathway-lessons/category-progress-bar";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { buildLessonCategoryProgress } from "@/lib/lessons/build-lesson-category-progress";
import { EMPTY_QUESTION_SNAPSHOT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { marketingCatCompletePoolUsable } from "@/lib/exam-pathways/pathway-marketing-practice-gates";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingExamHubBasePath, marketingPathwayLessonsCategoryPath } from "@/lib/lessons/lesson-routes";
import {
  countPathwayMarketingHubLessonsByCategoryForPathway,
  displayCategoryForPathwayMarketingHubLesson,
  getMarketingLessonsHubCatalogLessons,
  MARKETING_HUB_REVIEW_REQUIRED_PREVIEW_MAX,
  pathwayMarketingHubCategories,
  pickReviewRequiredCatalogLessons,
} from "@/lib/lessons/marketing-lessons-hub-category";
import { PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP } from "@/lib/lessons/pathway-lesson-loader";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { resolveMarketingHubCategoryLessonRowsWithDbResilience } from "@/lib/lessons/marketing-hub-category-rows-db-resilient";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingHubVerifiedCardHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import {
  canShowPaidPathwayLessonProgress,
  loadMarketingPathwayLessonProgressSessionContext,
} from "@/lib/lessons/marketing-pathway-lesson-progress-server";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { lessonsPerfMark } from "@/lib/lessons/lessons-perf";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { loadMarketingHubLessonProgressMapWithTimeout } from "@/lib/lessons/marketing-hub-progress-safe";

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

  const progressCtx = await loadMarketingPathwayLessonProgressSessionContext({
    sessionPathname: routePathLessons,
    sessionSurface: "marketing.exam_hub.lessons",
  });
  /** Anonymous public hubs: index/catalog only — no warehouse locale query or per-slug DB verify. */
  const skipMarketingHubDbVerify = !progressCtx.userId.trim();

  const reviewPick = pickReviewRequiredCatalogLessons(
    catalog,
    pathway.id,
    MARKETING_HUB_REVIEW_REQUIRED_PREVIEW_MAX,
  );
  const reviewPrepared = prepareLessonsForHubCurriculumWithDiagnostics(
    reviewPick.filter(pathwayLessonHasRenderableHubSlug),
    { pathwayId: pathway.id, lessonsBasePath: base },
  );
  lessonsPerfMark("catalog_size", {
    surface: "category_index_pre_verify",
    pathwayId: pathway.id,
    review_pick: reviewPick.length,
    elapsed_ms: Math.round(performance.now() - categoryIndexT0),
  });

  const reviewRows = await resolveMarketingHubCategoryLessonRowsWithDbResilience(
    {
      pathway,
      lessonContentLocale,
      skipDbVerify: skipMarketingHubDbVerify,
      preparedLessons: reviewPrepared.lessons,
      prepareStages: reviewPrepared.prepareStages,
      maxUniqueSlugsToVerify: Math.min(
        PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP,
        MARKETING_HUB_REVIEW_REQUIRED_PREVIEW_MAX * 2,
      ),
      surface: "category_first_index",
    },
  );
  lessonsPerfMark("route_end", {
    surface: "marketing_lessons_category_index",
    pathwayId: pathway.id,
    kept: reviewRows.length,
    verify_skipped: skipMarketingHubDbVerify ? "anonymous_index_only" : "db_verify_or_resilient_fallback",
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
  const pageTitle = formatTitleCase(`${pathway.shortName.trim() || pathway.displayName} Lesson Library`);
  const headerDescription = formatSentenceCase(
    `High-yield lessons, clinical insights, and exam-focused content to help you pass the ${examName} with confidence.`,
  );
  const hubTrustBadges = ["Evidence-based content", "Exam-focused", "Created by nurses", "Updated regularly"];
  const overviewHref = marketingExamHubBasePath(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const canStartCat =
    !questionSnapshotLoadRejected && marketingCatCompletePoolUsable(questionSnapshot, pathway.id);

  const lessonHubSurfaceChips = [
    { label: "Practice Questions", href: questionsHref },
    {
      label: questionSnapshotLoadRejected
        ? "Adaptive CAT — Status Unavailable"
        : canStartCat
          ? "Adaptive CAT"
          : "Adaptive CAT Unavailable",
      href: catHref,
    },
    { label: "Flashcards", href: pathwayHubAppFlashcardsHref(pathway.id) },
    { label: "Practice Exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
    { label: "Exam Overview", href: overviewHref },
  ];

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
  if (canShowResume && catalog.length > 0) {
    const pr = await loadMarketingHubLessonProgressMapWithTimeout({
      userId: progressCtx.userId,
      pathwayId: pathway.id,
      lessonSlugs: catalog.map((l) => l.slug),
    });
    progressMap = pr.map;
    showPaidProgressChrome = !pr.timedOut;
  }

  if (catalog.length === 0) {
    return (
      <LessonsPageShell
        title={pageTitle}
        subtitle={headerDescription}
        eyebrow={pathway.shortName.trim() || pathway.displayName}
        pathwayTrack={pathway.roleTrack}
        toolbar={toolbar}
        backLink={{ label: `${examName} overview`, href: overviewHref }}
        trustBadges={hubTrustBadges}
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
        <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
        <LessonHubClinicalModulesStrip
          pathway={pathway}
          marketingLocale={lessonContentLocale}
          signedIn={viewerSignedIn}
        />
        <div className="mt-6 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">
            No Lessons Are Indexed In The Bundled Catalog For This Pathway Yet.
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            Explore practice questions and adaptive study below while the library expands.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={questionsHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Explore Available Questions
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
      eyebrow={pathway.shortName.trim() || pathway.displayName}
      pathwayTrack={pathway.roleTrack}
      toolbar={toolbar}
      backLink={{ label: `${examName} overview`, href: overviewHref }}
      statCard={{ value: `${catalog.length.toLocaleString()}+`, label: "High-yield lessons" }}
      trustBadges={hubTrustBadges}
    >
      <MarketingHubSmokeDiagnosticsJson
        payload={{
          surface: "marketing_pathway_lessons",
          outcome: "category_index",
          pathwayId: pathway.id,
          routePathname: routePathLessons,
          contentLocale: lessonContentLocale,
          catalogLen: catalog.length,
          reviewRequiredPrepared: reviewPrepared.lessons.length,
          reviewRequiredVerified: reviewRows.length,
        }}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
      <LessonHubClinicalModulesStrip
        pathway={pathway}
        marketingLocale={lessonContentLocale}
        signedIn={viewerSignedIn}
      />
      {questionSnapshotLoadRejected ? (
        <div
          className="mt-3 rounded-xl border border-[var(--semantic-warning)]/40 bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] px-4 py-3 text-sm text-[var(--theme-heading-text)]"
          role="status"
        >
          We could not load practice-question stats for this hub right now, so adaptive CAT availability may be
          wrong until you retry.
        </div>
      ) : null}

      <section
        id="pathway-lesson-library"
        className="nn-qa-pathway-lessons-hub mt-2 scroll-mt-24"
        data-nn-qa-pathway-lessons-hub="true"
        aria-labelledby="lesson-library-heading"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
          <h2 id="lesson-library-heading" className="nn-marketing-h3 max-w-[min(100%,36rem)]">
            Browse Clinical Areas
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {catalog.length.toLocaleString()} {catalog.length === 1 ? "Lesson" : "Lessons"}
          </span>
        </div>

        {reviewRows.length > 0 ? (
          <div
            className="mb-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] p-4 sm:p-5"
            data-nn-qa-lessons-review-required="true"
          >
            <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Review Required</h3>
            <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
              These lessons still need clinical-area tagging before they appear in a category below.
            </p>
            <ul className="mt-3 space-y-2">
              {reviewRows.map((l) => {
                const href = pathwayLessonMarketingHubVerifiedCardHref(base, l);
                const label = cleanLessonTitleForDisplay((l.seoTitle ?? "").trim() || l.title);
                const prog = progressMap[l.slug];
                return (
                  <li key={l.slug}>
                    {href ? (
                      <Link
                        href={href}
                        className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm font-medium text-primary hover:underline"
                      >
                        <span className="min-w-0 flex-1">{label}</span>
                        {showPaidProgressChrome ? <PathwayLessonProgressBadge status={prog ?? "not_started"} /> : null}
                      </Link>
                    ) : (
                      <span className="text-sm text-[var(--theme-muted-text)]">{label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hubCategories
            .filter((cat) => {
              // review_required has its own section above; exclude from the category grid
              if (cat.id === "review_required") return false;
              // hide zero-lesson categories for anonymous visitors (keeps grid clean)
              const n = counts.get(cat.id) ?? 0;
              return showPaidProgressChrome || n > 0;
            })
            .map((cat) => {
              const n = counts.get(cat.id) ?? 0;
              const href = marketingPathwayLessonsCategoryPath(pathway, cat.slug);
              const visual = getLessonHubSystemVisual(cat.id);
              const Icon = visual.icon;
              const accentStyle = { "--nn-hub-cat-accent": `var(${visual.accentVar})` } as CSSProperties;
              const isExamCritical = EXAM_CRITICAL_CATEGORY_IDS.has(cat.id);
              const isEmpty = n === 0 && !showPaidProgressChrome;
              const categoryProgress = showPaidProgressChrome
                ? buildLessonCategoryProgress({
                    lessons: catalog.filter((lesson) => displayCategoryForPathwayMarketingHubLesson(lesson, pathway.id).id === cat.id),
                    progressMap,
                  })
                : null;
              const cardClass = [
                "nn-hub-category-card group relative flex items-start gap-3.5 rounded-2xl border",
                "border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_16%,var(--semantic-border-soft))]",
                "bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_4%,var(--semantic-surface))]",
                "px-4 py-4 transition-all",
                "hover:border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_32%,var(--semantic-border-soft))]",
                "hover:bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_7%,var(--semantic-surface))]",
                "hover:shadow-[0_4px_16px_color-mix(in_srgb,var(--nn-hub-cat-accent)_10%,transparent)]",
                isExamCritical ? "nn-hub-category-card--exam-critical" : "",
                isEmpty ? "nn-hub-category-card--empty" : "",
              ].filter(Boolean).join(" ");
              return (
                <Link
                  key={cat.id}
                  href={href}
                  style={accentStyle}
                  className={cardClass}
                  aria-disabled={isEmpty || undefined}
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-hub-cat-accent)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-hub-cat-accent)_10%,var(--semantic-panel-muted))] text-[var(--nn-hub-cat-accent)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[var(--theme-heading-text)] transition-colors group-hover:text-[var(--nn-hub-cat-accent)]">
                      {cat.label}
                    </span>
                    {cat.description ? (
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-[var(--theme-muted-text)]">
                        {cat.description}
                      </span>
                    ) : null}
                    <span className="mt-1.5 block text-xs font-medium text-[var(--theme-muted-text)]">
                      {showPaidProgressChrome && categoryProgress ? (
                        <>
                          <span className="hidden sm:inline">
                            {categoryProgress.percentComplete}% complete ·{" "}
                          </span>
                          <span aria-hidden="true">
                            {categoryProgress.completedCount.toLocaleString()}/
                            {categoryProgress.totalCount.toLocaleString()} lessons
                          </span>
                          <span className="sr-only">
                            {`${categoryProgress.completedCount.toLocaleString()} of ${categoryProgress.totalCount.toLocaleString()} lessons completed`}
                          </span>
                        </>
                      ) : (
                        `${n.toLocaleString()} ${n === 1 ? "lesson" : "lessons"}`
                      )}
                    </span>
                    {showPaidProgressChrome && categoryProgress ? (
                      <CategoryProgressBar
                        completedCount={categoryProgress.completedCount}
                        inProgressCount={categoryProgress.inProgressCount}
                        totalCount={Math.max(categoryProgress.totalCount, 1)}
                      />
                    ) : null}
                  </div>
                  <ChevronRight
                    className="mt-1 h-4 w-4 shrink-0 text-[var(--theme-muted-text)] transition group-hover:translate-x-0.5 group-hover:text-[var(--nn-hub-cat-accent)]"
                    aria-hidden
                  />
                </Link>
              );
            })}
        </div>
      </section>

      <StudyBottomNav
        compact
        relatedLinks={[
          { label: "Practice Questions", href: questionsHref },
          { label: canStartCat ? "Adaptive CAT" : "Adaptive CAT Unavailable", href: catHref },
          { label: "Practice Exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
          { label: "Exam Overview", href: overviewHref },
        ]}
      />
    </LessonsPageShell>
  );
}
