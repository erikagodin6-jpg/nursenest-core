import Link from "next/link";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { StudyModeCards, defaultLessonModeCards } from "@/components/study/study-mode-cards";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import { EMPTY_QUESTION_SNAPSHOT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { CAT_MIN_COMPLETE_POOL } from "@/lib/practice-tests/cat-pool";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingExamHubBasePath, marketingPathwayLessonsCategoryPath } from "@/lib/lessons/lesson-routes";
import {
  LESSON_CATEGORIES,
  lessonCategoryToSlug,
} from "@/lib/lessons/lesson-taxonomy";
import {
  countMarketingHubLessonsByDisplayCategory,
  getMarketingLessonsHubCatalogLessons,
  MARKETING_HUB_REVIEW_REQUIRED_PREVIEW_MAX,
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
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { canViewFullPathwayLesson } from "@/lib/lessons/pathway-lesson-access";
import { loadPathwayHubSubscriberData } from "@/lib/learner/pathway-lesson-continuation";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";

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
  pathname,
  routePathLessons,
  countrySlug,
  roleTrack,
  examCode,
  lessonContentLocale,
}: Props) {
  const catalog = getMarketingLessonsHubCatalogLessons(pathway.id);
  const counts = countMarketingHubLessonsByDisplayCategory(catalog);
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

  let questionSnapshot = EMPTY_QUESTION_SNAPSHOT;
  let questionSnapshotLoadRejected = false;
  try {
    questionSnapshot = await loadPathwayQuestionBankSnapshot(pathway.id);
  } catch {
    questionSnapshotLoadRejected = true;
  }

  const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const pageTitle = "Lessons";
  const headerDescription = `Browse lessons by clinical area for ${pathway.shortName} in ${pathwayCountryLabel(pathway)}.`;
  const overviewHref = marketingExamHubBasePath(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const canStartCat =
    !questionSnapshotLoadRejected &&
    questionSnapshot.status === "ok" &&
    questionSnapshot.adaptiveEligibleCount >= CAT_MIN_COMPLETE_POOL;

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
    { label: "Flashcards", href: HUB.flashcards },
    { label: "Practice exams", href: HUB.practiceExams },
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

  const session = await getOptionalPublicSession({
    pathname: routePathLessons,
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
      ? { hasAccess: false, reason: "no_access" as const, tier: null, country: null, alliedCareer: null }
      : entitlement;
  const canShowResume =
    Boolean(userId) && scope.hasAccess && canViewFullPathwayLesson(scope, pathway, learnerPath);
  let progressMap: Record<string, PathwayLessonProgressStatus> = {};
  if (canShowResume && reviewRows.length > 0) {
    const hubSlugs = reviewRows.map((l) => l.slug).filter(Boolean);
    const { progressMap: map } = await loadPathwayHubSubscriberData(
      userId,
      scope,
      learnerPath,
      pathway,
      base,
      hubSlugs,
    );
    progressMap = map;
  }

  const studyCards = defaultLessonModeCards({
    lessonsHref: base,
    questionsHref,
    catHref,
    pathwayShortName: pathway.shortName,
  });

  if (catalog.length === 0) {
    return (
      <LessonsPageShell
        title={pageTitle}
        subtitle={headerDescription}
        toolbar={toolbar}
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
        <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
        <div className="mt-6 rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">
            No lessons are indexed in the bundled catalog for this pathway yet.
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            Explore practice questions and adaptive study below while the library expands.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={questionsHref}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Explore available questions
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
      toolbar={toolbar}
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
      <LessonHubSurfaceChips links={lessonHubSurfaceChips} />
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
        className="nn-qa-pathway-lessons-hub mt-4 scroll-mt-24"
        data-nn-qa-pathway-lessons-hub="true"
        aria-labelledby="lesson-library-heading"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
          <h2 id="lesson-library-heading" className="text-base font-semibold text-[var(--theme-heading-text)]">
            Lesson library
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {catalog.length.toLocaleString()} {catalog.length === 1 ? "lesson" : "lessons"} · browse by area
          </span>
        </div>

        {reviewRows.length > 0 ? (
          <div
            className="mb-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] p-4 sm:p-5"
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
                        {canShowResume && prog && prog !== "not_started" ? (
                          <span className="shrink-0 text-xs font-normal text-[var(--theme-muted-text)]">
                            {prog === "completed" ? "Completed" : "In progress"}
                          </span>
                        ) : null}
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
          {LESSON_CATEGORIES.map((cat) => {
            const n = counts.get(cat) ?? 0;
            const slug = lessonCategoryToSlug(cat);
            const href = marketingPathwayLessonsCategoryPath(pathway, slug);
            return (
              <Link
                key={cat}
                href={href}
                className="group flex min-h-[72px] flex-col justify-center rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))] px-4 py-3 transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-positive)_40%,var(--semantic-surface))]"
              >
                <span className="text-sm font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">
                  {cat}
                </span>
                <span className="mt-1 text-xs text-[var(--theme-muted-text)]">
                  {n.toLocaleString()} {n === 1 ? "lesson" : "lessons"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <StudyModeCards heading="Other ways to study" cards={studyCards} />
      </section>

      <StudyBottomNav
        relatedLinks={[
          { label: "Practice questions", href: questionsHref },
          { label: canStartCat ? "Adaptive CAT" : "Adaptive CAT unavailable", href: catHref },
          { label: "Practice exams", href: HUB.practiceExams },
          { label: "Exam overview", href: overviewHref },
        ]}
      />
    </LessonsPageShell>
  );
}
