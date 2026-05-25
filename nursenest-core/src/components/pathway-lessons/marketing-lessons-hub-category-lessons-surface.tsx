import type { CSSProperties } from "react";
import Link from "next/link";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { LessonHubClinicalModulesStrip } from "@/components/pathway-lessons/lesson-hub-clinical-modules-strip";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { MarketingLessonsHubStickyStudyChrome } from "@/components/pathway-lessons/marketing-lessons-hub-sticky-study-chrome";
import { LessonsHubCategoryHeader } from "@/components/pathway-lessons/lessons-hub-category-header";
import { LessonsHubLessonRow } from "@/components/pathway-lessons/lessons-hub-lesson-row";
import { LessonsHubResumeCompact } from "@/components/pathway-lessons/lessons-hub-resume-compact";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
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
import { pathwayCountryLabel } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonsDisplayCategoryBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { sliceNormalizedHubLessons } from "@/lib/lessons/pathway-lesson-hub-page-slice";
import { buildLessonCategoryProgress } from "@/lib/lessons/build-lesson-category-progress";
import { loadPathwayHubSubscriberData } from "@/lib/learner/pathway-lesson-continuation";
import {
  canShowPaidPathwayLessonProgress,
  loadMarketingPathwayLessonProgressSessionContext,
} from "@/lib/lessons/marketing-pathway-lesson-progress-server";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { formatTitleCase } from "@/lib/format/text-case";

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
  const categoryTitle = formatTitleCase(category.label);
  const pageTitle = `${categoryTitle} Lessons`;
  const overviewHref = marketingExamHubBasePath(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const canStartCat =
    !questionSnapshotLoadRejected && marketingCatCompletePoolUsable(questionSnapshot, pathway.id);

  const lessonHubSurfaceChips = [
    { label: "Practice Questions", href: questionsHref },
    {
      label: questionSnapshotLoadRejected ? "CAT Status Unavailable" : canStartCat ? "CAT" : "CAT Unavailable",
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
  let hubResume: Awaited<ReturnType<typeof loadPathwayHubSubscriberData>>["resume"] | null = null;
  const catalogSlugs = catalogAll.map((l) => l.slug).filter(Boolean);
  if (canShowResume && catalogSlugs.length > 0) {
    const subscriber = await loadPathwayHubSubscriberData(
      progressCtx.userId,
      progressCtx.scope,
      progressCtx.learnerPath,
      pathway,
      base,
      catalogSlugs,
    );
    progressMap = subscriber.progressMap;
    hubResume = subscriber.resume;
    showPaidProgressChrome = true;
  }
  const categoryProgressSnapshot =
    showPaidProgressChrome && filtered.length > 0
      ? buildLessonCategoryProgress({ lessons: filtered, progressMap })
      : null;

  const visual = getLessonHubSystemVisual(category.id);
  const CategoryIcon = visual.icon;
  const accentStyle = { "--nn-hub-cat-accent": `var(${visual.accentVar})` } as CSSProperties;

  const subtitle = `${pathwayCountryLabel(pathway)} pathway · ${filtered.length.toLocaleString()} ${
    filtered.length === 1 ? "lesson" : "lessons"
  }`;

  return (
    <LessonsPageShell
      title={pageTitle}
      subtitle={subtitle}
      eyebrow="Lesson Library"
      pathwayTrack={pathway.roleTrack}
      toolbar={toolbar}
      backLink={{ label: "Lesson Areas", href: base }}
      heroAlign="center"
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
      <MarketingLessonsHubStickyStudyChrome>
        <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
        <LessonHubClinicalModulesStrip
          pathway={pathway}
          marketingLocale={lessonContentLocale}
          signedIn={Boolean(progressCtx.userId.trim())}
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
        data-nn-qa-pathway-lessons-category="true"
        data-nn-lessons-hub-layout="h11"
        aria-labelledby="lesson-category-heading"
      >
        <LessonsHubCategoryHeader
          title={categoryTitle}
          description={category.description}
          lessonCount={filtered.length}
          hubHref={base}
          accentStyle={accentStyle}
          icon={<CategoryIcon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" aria-hidden />}
          progress={categoryProgressSnapshot}
          hideTitle
          showBackLink={false}
        />

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--theme-muted-text)]">
            <p className="font-medium text-[var(--theme-heading-text)]">No lessons in this area yet.</p>
            <p className="mt-2">
              There are no catalog lessons mapped to <strong className="text-[var(--theme-heading-text)]">{categoryTitle}</strong>{" "}
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
          <ul className="flex flex-col gap-2.5 sm:gap-3">
            {rows.map((l) => {
              const href = pathwayLessonMarketingHubVerifiedCardHref(base, l);
              const label = cleanLessonTitleForDisplay((l.seoTitle ?? "").trim() || l.title);
              const prog = progressMap[l.slug];
              return (
                <li key={l.slug}>
                  {href ? (
                    <LessonsHubLessonRow
                      href={href}
                      label={label}
                      accentStyle={accentStyle}
                      showProgress={showPaidProgressChrome}
                      status={prog ?? "not_started"}
                    />
                  ) : (
                    <span
                      className="block min-h-[48px] rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm text-[var(--theme-muted-text)]"
                      style={accentStyle}
                    >
                      {label}
                    </span>
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
          { label: "Practice Questions", href: questionsHref },
          { label: canStartCat ? "CAT" : "CAT Unavailable", href: catHref },
          { label: "Practice Exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
          { label: "Exam Overview", href: overviewHref },
        ]}
      />
    </LessonsPageShell>
  );
}
