import Link from "next/link";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { LessonHubClinicalModulesStrip } from "@/components/pathway-lessons/lesson-hub-clinical-modules-strip";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import { EMPTY_QUESTION_SNAPSHOT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { marketingCatCompletePoolUsable } from "@/lib/exam-pathways/pathway-marketing-practice-gates";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingExamHubBasePath, marketingPathwayLessonsCategoryPath } from "@/lib/lessons/lesson-routes";
import {
  filterPathwayMarketingHubLessonsByCategory,
  getMarketingLessonsHubCatalogLessons,
  MARKETING_HUB_CATEGORY_PAGE_SIZE,
  sortLessonsForMarketingCategoryPage,
  type MarketingHubCategoryDescriptor,
} from "@/lib/lessons/marketing-lessons-hub-category";
import { PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP } from "@/lib/lessons/pathway-lesson-loader";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { resolveMarketingHubCategoryLessonRowsWithDbResilience } from "@/lib/lessons/marketing-hub-category-rows-db-resilient";
import {
  pathwayLessonMarketingHubVerifiedCardHref,
  pathwayLessonHasRenderableHubSlug,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonsDisplayCategoryBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { sliceNormalizedHubLessons } from "@/lib/lessons/pathway-lesson-hub-page-slice";
import { CategoryProgressBar } from "@/components/pathway-lessons/category-progress-bar";
import { buildLessonCategoryProgress } from "@/lib/lessons/build-lesson-category-progress";
import { loadMarketingHubLessonProgressMapWithTimeout } from "@/lib/lessons/marketing-hub-progress-safe";
import {
  canShowPaidPathwayLessonProgress,
  loadMarketingPathwayLessonProgressSessionContext,
} from "@/lib/lessons/marketing-pathway-lesson-progress-server";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

type Props = {
  pathway: ExamPathwayDefinition;
  base: string;
  routePathLessonsCategory: string;
  lessonContentLocale: string;
  category: MarketingHubCategoryDescriptor;
  pageRequested: number;
};

export async function MarketingLessonsHubCategoryLessonsSurface({
  pathway,
  base,
  routePathLessonsCategory,
  lessonContentLocale,
  category,
  pageRequested,
}: Props) {
  const categoryBasePath = marketingPathwayLessonsCategoryPath(pathway, category.slug);

  const catalogAll = getMarketingLessonsHubCatalogLessons(pathway.id);
  const filtered = sortLessonsForMarketingCategoryPage(
    filterPathwayMarketingHubLessonsByCategory(catalogAll, pathway.id, category.id),
    pathway.id,
  );

  const pageSize = MARKETING_HUB_CATEGORY_PAGE_SIZE;
  const hubVerifiedPage = sliceNormalizedHubLessons(filtered, pageRequested, pageSize);
  const pageSlice = hubVerifiedPage.items;

  const prepared = prepareLessonsForHubCurriculumWithDiagnostics(
    pageSlice.filter(pathwayLessonHasRenderableHubSlug),
    { pathwayId: pathway.id, lessonsBasePath: base },
  );

  const progressCtx = await loadMarketingPathwayLessonProgressSessionContext({
    sessionPathname: routePathLessonsCategory,
    sessionSurface: "marketing.exam_hub.lessons_category",
  });
  const skipMarketingHubDbVerify = !progressCtx.userId.trim();

  const rows = await resolveMarketingHubCategoryLessonRowsWithDbResilience(
    {
      pathway,
      lessonContentLocale,
      skipDbVerify: skipMarketingHubDbVerify,
      preparedLessons: prepared.lessons,
      prepareStages: prepared.prepareStages,
      maxUniqueSlugsToVerify: Math.min(
        PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP,
        Math.max(60, pageSize * 2),
      ),
      surface: "category_lessons_surface",
    },
  );

  let questionSnapshot = EMPTY_QUESTION_SNAPSHOT;
  let questionSnapshotLoadRejected = false;
  try {
    questionSnapshot = await loadPathwayQuestionBankSnapshot(pathway.id);
  } catch {
    questionSnapshotLoadRejected = true;
  }

  const { crumbs, schemaItems } = pathwayLessonsDisplayCategoryBreadcrumbs(
    pathway,
    category.label,
    category.slug,
  );
  const examName = pathwayRegionAwareExamName(pathway);
  const pageTitle = formatTitleCase(`${examName} · ${category.label} lessons`);
  const overviewHref = marketingExamHubBasePath(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const canStartCat =
    !questionSnapshotLoadRejected && marketingCatCompletePoolUsable(questionSnapshot, pathway.id);

  const lessonHubSurfaceChips = [
    { label: "Practice questions", href: questionsHref },
    {
      label: questionSnapshotLoadRejected
        ? "Adaptive CAT — status unavailable"
        : canStartCat
          ? "Adaptive CAT"
          : "Adaptive CAT unavailable",
      href: catHref,
    },
    { label: "Flashcards", href: pathwayHubAppFlashcardsHref(pathway.id) },
    { label: "Practice exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
    { label: "Exam overview", href: overviewHref },
  ];

  const canadaHref =
    pathway.countrySlug === "canada" ? base : (equivalentExamHubUrlAfterRegionToggle(base, "CA") ?? base);
  const usHref =
    pathway.countrySlug === "us" ? base : (equivalentExamHubUrlAfterRegionToggle(base, "US") ?? base);
  const toolbar = (
    <LessonsToolbar
      searchBasePath={base}
      totalCount={filtered.length}
      countryOptions={[
        { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
        { label: "US", href: usHref, active: pathway.countrySlug === "us" },
      ]}
    />
  );

  const canShowResume = canShowPaidPathwayLessonProgress(progressCtx, pathway);
  let progressMap: Record<string, PathwayLessonProgressStatus> = {};
  let showPaidProgressChrome = false;
  if (canShowResume && rows.length > 0) {
    const pr = await loadMarketingHubLessonProgressMapWithTimeout({
      userId: progressCtx.userId,
      pathwayId: pathway.id,
      lessonSlugs: rows.map((l) => l.slug).filter(Boolean),
    });
    progressMap = pr.map;
    showPaidProgressChrome = !pr.timedOut;
  }
  const categoryProgressSnapshot =
    showPaidProgressChrome && rows.length > 0
      ? buildLessonCategoryProgress({ lessons: rows, progressMap })
      : null;

  const subtitle = formatSentenceCase(`${pathway.shortName} · ${pathwayCountryLabel(pathway)}`);

  return (
    <LessonsPageShell
      title={pageTitle}
      subtitle={subtitle}
      eyebrow={pathway.shortName.trim() || pathway.displayName}
      pathwayTrack={pathway.roleTrack}
      toolbar={toolbar}
      backLink={{ label: "All lesson areas", href: base }}
    >
      <MarketingHubSmokeDiagnosticsJson
        payload={{
          surface: "marketing_pathway_lessons_category",
          outcome: filtered.length === 0 ? "empty_category" : "rendered",
          pathwayId: pathway.id,
          routePathname: routePathLessonsCategory,
          categoryId: category.id,
          categoryLabel: category.label,
          catalogFiltered: filtered.length,
          verifiedRows: rows.length,
        }}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
      <LessonHubClinicalModulesStrip
        pathway={pathway}
        marketingLocale={lessonContentLocale}
        signedIn={Boolean(progressCtx.userId.trim())}
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
        data-nn-qa-pathway-lessons-category="true"
        aria-labelledby="lesson-category-heading"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
          <h2 id="lesson-category-heading" className="nn-marketing-h3 max-w-[min(100%,36rem)]">
            {category.label}
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {filtered.length.toLocaleString()} {filtered.length === 1 ? "lesson" : "lessons"}
          </span>
        </div>
        {categoryProgressSnapshot ? (
          <div className="-mt-2 mb-4 max-w-xl">
            <p className="text-xs text-[var(--theme-muted-text)]">
              <span className="hidden sm:inline">{categoryProgressSnapshot.percentComplete}% complete · </span>
              <span aria-hidden="true">
                {categoryProgressSnapshot.completedCount.toLocaleString()}/
                {categoryProgressSnapshot.totalCount.toLocaleString()} lessons in this area
              </span>
              <span className="sr-only">
                {`${categoryProgressSnapshot.completedCount.toLocaleString()} of ${categoryProgressSnapshot.totalCount.toLocaleString()} lessons completed in this category`}
              </span>
            </p>
            <CategoryProgressBar
              completedCount={categoryProgressSnapshot.completedCount}
              inProgressCount={categoryProgressSnapshot.inProgressCount}
              totalCount={Math.max(categoryProgressSnapshot.totalCount, 1)}
            />
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--theme-muted-text)]">
            <p className="font-medium text-[var(--theme-heading-text)]">No lessons in this area yet.</p>
            <p className="mt-2">
              There are no catalog lessons mapped to <strong className="text-[var(--theme-heading-text)]">{category.label}</strong>{" "}
              for this pathway. Try another clinical area or return to the lesson hub.
            </p>
            <p className="mt-3">
              <Link href={base} className="font-semibold text-primary hover:underline">
                Back to lesson areas
              </Link>
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--theme-muted-text)]">
            <p className="font-medium text-[var(--theme-heading-text)]">No linkable lessons on this page.</p>
            <p className="mt-2">
              Lessons in this area exist in the catalog, but none on this page passed public-link verification yet.
              Try another page or return to the hub.
            </p>
            <p className="mt-3">
              <Link href={base} className="font-semibold text-primary hover:underline">
                Back to lesson areas
              </Link>
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {rows.map((l) => {
              const href = pathwayLessonMarketingHubVerifiedCardHref(base, l);
              const label = cleanLessonTitleForDisplay((l.seoTitle ?? "").trim() || l.title);
              const prog = progressMap[l.slug];
              return (
                <li key={l.slug}>
                  {href ? (
                    <Link
                      href={href}
                      className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 text-sm font-medium text-primary shadow-[var(--semantic-shadow-soft)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))]"
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
        )}

        {filtered.length > 0 && hubVerifiedPage.pageCount > 1 ? (
          <div className="mt-6">
            <PathwayLessonPagination
              basePath={categoryBasePath}
              page={hubVerifiedPage.page}
              pageCount={hubVerifiedPage.pageCount}
              total={hubVerifiedPage.total}
              pageSize={hubVerifiedPage.pageSize}
              lessonsOnPage={rows.length}
            />
          </div>
        ) : null}
      </section>

      <StudyBottomNav
        compact
        relatedLinks={[
          { label: "Practice questions", href: questionsHref },
          { label: canStartCat ? "Adaptive CAT" : "Adaptive CAT unavailable", href: catHref },
          { label: "Practice exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
          { label: "Exam overview", href: overviewHref },
        ]}
      />
    </LessonsPageShell>
  );
}
