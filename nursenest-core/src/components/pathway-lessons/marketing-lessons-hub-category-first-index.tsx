import Link from "next/link";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { StudyModeCards, defaultLessonModeCards } from "@/components/study/study-mode-cards";
import { MarketingLessonsHubStickyStudyChrome } from "@/components/pathway-lessons/marketing-lessons-hub-sticky-study-chrome";
import { MarketingPublicLessonsHubAnonymousUpgradeStrip } from "@/components/pathway-lessons/marketing-public-lessons-hub-anonymous-upgrade-strip";
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
import {
  getPathwayLessonListWarehouseLocaleForHub,
  PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP,
} from "@/lib/lessons/pathway-lesson-loader";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { verifyMarketingHubLessonRowsResolve } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingHubVerifiedCardHref,
} from "@/lib/lessons/pathway-lesson-types";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import {
  canShowPaidPathwayLessonProgress,
  loadMarketingPathwayLessonProgressSessionContext,
} from "@/lib/lessons/marketing-pathway-lesson-progress-server";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { loadPathwayHubSubscriberData } from "@/lib/learner/pathway-lesson-continuation";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { buildSubscriberPublicLessonsHubHeroCta } from "@/lib/marketing/public-lessons-hub-hero-cta";
import { publicHubCategoryBrowseCardStyle } from "@/lib/marketing/public-hub-browse-accent";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { lessonsPerfMark } from "@/lib/lessons/lessons-perf";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

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

export async function MarketingLessonsHubCategoryFirstIndex({
  pathway,
  base,
  pathname: _pathname,
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
  const reviewPick = pickReviewRequiredCatalogLessons(
    catalog,
    pathway.id,
    MARKETING_HUB_REVIEW_REQUIRED_PREVIEW_MAX,
  );
  const reviewPrepared = prepareLessonsForHubCurriculumWithDiagnostics(
    reviewPick.filter(pathwayLessonHasRenderableHubSlug),
    { pathwayId: pathway.id, lessonsBasePath: base },
  );
  const listWarehouseLocale = await getPathwayLessonListWarehouseLocaleForHub(pathway.id, lessonContentLocale);
  lessonsPerfMark("catalog_size", {
    surface: "category_index_pre_verify",
    pathwayId: pathway.id,
    review_pick: reviewPick.length,
    elapsed_ms: Math.round(performance.now() - categoryIndexT0),
  });
  const vrReview = await verifyMarketingHubLessonRowsResolve(
    pathway,
    reviewPrepared.lessons,
    lessonContentLocale,
    {
      listWarehouseLocale,
      prepareStages: reviewPrepared.prepareStages,
      maxUniqueSlugsToVerify: Math.min(
        PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP,
        MARKETING_HUB_REVIEW_REQUIRED_PREVIEW_MAX * 2,
      ),
    },
  );
  const reviewRows = vrReview.kept;
  lessonsPerfMark("route_end", {
    surface: "marketing_lessons_category_index",
    pathwayId: pathway.id,
    kept: reviewRows.length,
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
  const pageTitle = formatTitleCase("Lessons");
  const headerDescription = formatSentenceCase(
    `Browse lessons by clinical area for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`,
  );
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
      totalCount={catalog.length}
      countryOptions={[
        { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
        { label: "US", href: usHref, active: pathway.countrySlug === "us" },
      ]}
    />
  );

  const progressCtx = await loadMarketingPathwayLessonProgressSessionContext({
    sessionPathname: routePathLessons,
    sessionSurface: "marketing.exam_hub.lessons",
  });
  const canShowResume = canShowPaidPathwayLessonProgress(progressCtx, pathway);
  const marketingUiLocale = await getMarketingLocaleForDefaultRoute();
  const anonymousHeroCta = {
    label: "Create a free account",
    href: `${withMarketingLocale(marketingUiLocale, HUB.signup)}?callbackUrl=${encodeURIComponent(base)}`,
  } as const;

  let progressMap: Record<string, PathwayLessonProgressStatus> = {};
  let subscriberHeroCta: { label: string; href: string } | undefined;

  if (canShowResume && catalog.length > 0) {
    const slugList = catalog.map((l) => l.slug).filter(Boolean) as string[];
    const { progressMap: hubMap, resume } = await loadPathwayHubSubscriberData(
      progressCtx.userId,
      progressCtx.scope,
      progressCtx.learnerPath,
      pathway,
      base,
      slugList,
    );
    progressMap = hubMap;
    subscriberHeroCta = buildSubscriberPublicLessonsHubHeroCta(resume, base);
  }

  const studyCards = defaultLessonModeCards({
    lessonsHref: base,
    questionsHref,
    catHref,
    pathwayShortName: pathway.shortName,
  });

  if (catalog.length === 0) {
    const emptyHeroCta = canShowResume
      ? buildSubscriberPublicLessonsHubHeroCta(
          (
            await loadPathwayHubSubscriberData(
              progressCtx.userId,
              progressCtx.scope,
              progressCtx.learnerPath,
              pathway,
              base,
              [],
            )
          ).resume,
          base,
        )
      : anonymousHeroCta;

    return (
      <LessonsPageShell
        title={pageTitle}
        subtitle={headerDescription}
        eyebrow={pathway.shortName.trim() || pathway.displayName}
        pathwayTrack={pathway.roleTrack}
        toolbar={toolbar}
        heroPrimaryCta={emptyHeroCta}
        backLink={{ label: `${examName} overview`, href: overviewHref }}
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
        </MarketingLessonsHubStickyStudyChrome>
        <div className="mt-5 rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-chart-3)_14%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
            No lessons are indexed in the bundled catalog for this pathway yet.
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            Explore practice questions and adaptive study while the library expands.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={questionsHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-success)] px-5 py-2.5 text-sm font-semibold text-[var(--text-on-dark)] hover:opacity-90"
            >
              Explore available questions
            </Link>
          </div>
        </div>
        {!canShowResume ? (
          <MarketingPublicLessonsHubAnonymousUpgradeStrip
            marketingUiLocale={marketingUiLocale}
            signupCallbackPath={base}
          />
        ) : null}
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
      heroPrimaryCta={subscriberHeroCta ?? anonymousHeroCta}
      backLink={{ label: `${examName} overview`, href: overviewHref }}
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

      <section
        id="pathway-lesson-library"
        className="nn-qa-pathway-lessons-hub mt-2 scroll-mt-24 sm:mt-3"
        data-nn-qa-pathway-lessons-hub="true"
        aria-labelledby="lesson-library-heading"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--semantic-chart-5)_12%,var(--semantic-border-soft))] pb-3 sm:pb-4">
          <h2 id="lesson-library-heading" className="nn-marketing-h3 max-w-[min(100%,36rem)]">
            Clinical areas
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_40%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {catalog.length.toLocaleString()} {catalog.length === 1 ? "lesson" : "lessons"}
          </span>
        </div>

        {canShowResume && reviewRows.length > 0 ? (
          <div
            className="mb-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] p-4 sm:p-5"
            data-nn-qa-lessons-review-required="true"
          >
            <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Review required</h3>
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
                        <PathwayLessonProgressBadge status={prog ?? "not_started"} />
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
          {hubCategories.map((cat, cardIdx) => {
            const n = counts.get(cat.id) ?? 0;
            const href = marketingPathwayLessonsCategoryPath(pathway, cat.slug);
            const categoryProgress = canShowResume
              ? buildLessonCategoryProgress({
                  lessons: catalog.filter(
                    (lesson) => displayCategoryForPathwayMarketingHubLesson(lesson, pathway.id).id === cat.id,
                  ),
                  progressMap,
                })
              : null;
            return (
              <Link
                key={cat.id}
                href={href}
                style={publicHubCategoryBrowseCardStyle(cardIdx)}
                className="group flex min-h-[76px] flex-col justify-center rounded-2xl border border-[color-mix(in_srgb,var(--hub-browse-accent)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--hub-browse-accent)_11%,var(--semantic-surface))] px-4 py-3.5 shadow-[var(--semantic-shadow-soft)] transition hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--hub-browse-accent)_16%,transparent)]"
              >
                <span className="text-sm font-semibold leading-snug text-[var(--theme-heading-text)] group-hover:text-[var(--semantic-brand)]">
                  {cat.label}
                </span>
                <span className="mt-1 text-xs text-[var(--theme-muted-text)]">
                  {canShowResume && categoryProgress ? (
                    <>
                      <span className="hidden sm:inline">{categoryProgress.percentComplete}% complete · </span>
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
                {canShowResume && categoryProgress ? (
                  <CategoryProgressBar
                    completedCount={categoryProgress.completedCount}
                    inProgressCount={categoryProgress.inProgressCount}
                    totalCount={Math.max(categoryProgress.totalCount, 1)}
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>

      <MarketingLessonsHubStickyStudyChrome>
        <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
      </MarketingLessonsHubStickyStudyChrome>

      {questionSnapshotLoadRejected ? (
        <div
          className="mt-3 rounded-xl border border-[var(--semantic-warning)]/40 bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] px-4 py-3 text-sm text-[var(--theme-heading-text)]"
          role="status"
        >
          We could not load practice-question stats for this hub right now, so adaptive CAT availability may be wrong
          until you retry.
        </div>
      ) : null}

      {!canShowResume ? (
        <MarketingPublicLessonsHubAnonymousUpgradeStrip marketingUiLocale={marketingUiLocale} signupCallbackPath={base} />
      ) : null}

      <section className="mt-10">
        <StudyModeCards heading="Other ways to study" cards={studyCards} />
      </section>
    </LessonsPageShell>
  );
}
