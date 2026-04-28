import Link from "next/link";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { LessonsToolbar } from "@/components/pathway-lessons/lessons-toolbar";
import { PathwayLessonPagination } from "@/components/pathway-lessons/pathway-lesson-pagination";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { LessonHubSurfaceChips } from "@/components/pathway-lessons/lesson-hub-surface-chips";
import { StudyModeCards, defaultLessonModeCards } from "@/components/study/study-mode-cards";
import { StudyBottomNav } from "@/components/study/study-bottom-nav";
import { EMPTY_QUESTION_SNAPSHOT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { CAT_MIN_COMPLETE_POOL } from "@/lib/practice-tests/cat-pool";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingExamHubBasePath, marketingPathwayLessonsCategoryPath } from "@/lib/lessons/lesson-routes";
import type { LessonCategory } from "@/lib/lessons/lesson-taxonomy";
import { lessonCategoryToSlug } from "@/lib/lessons/lesson-taxonomy";
import {
  filterMarketingHubLessonsByDisplayCategory,
  getMarketingLessonsHubCatalogLessons,
  marketingHubCategorySlugForCategory,
  MARKETING_HUB_CATEGORY_PAGE_SIZE,
  sortLessonsForMarketingCategoryPage,
} from "@/lib/lessons/marketing-lessons-hub-category";
import {
  getPathwayLessonListWarehouseLocaleForHub,
  PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP,
} from "@/lib/lessons/pathway-lesson-loader";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { verifyMarketingHubLessonRowsResolve } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import {
  pathwayLessonMarketingDetailHref,
  pathwayLessonHasRenderableHubSlug,
} from "@/lib/lessons/pathway-lesson-types";
import { pathwayCountryLabel } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonsDisplayCategoryBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { sliceNormalizedHubLessons } from "@/lib/lessons/pathway-lesson-hub-page-slice";
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
  routePathLessonsCategory: string;
  lessonContentLocale: string;
  category: LessonCategory;
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
  const categorySlug = marketingHubCategorySlugForCategory(category);
  const categoryBasePath = marketingPathwayLessonsCategoryPath(pathway, categorySlug);

  const catalogAll = getMarketingLessonsHubCatalogLessons(pathway.id);
  const filtered = sortLessonsForMarketingCategoryPage(
    filterMarketingHubLessonsByDisplayCategory(catalogAll, category),
  );

  const pageSize = MARKETING_HUB_CATEGORY_PAGE_SIZE;
  const hubVerifiedPage = sliceNormalizedHubLessons(filtered, pageRequested, pageSize);
  const pageSlice = hubVerifiedPage.items;

  const prepared = prepareLessonsForHubCurriculumWithDiagnostics(
    pageSlice.filter(pathwayLessonHasRenderableHubSlug),
    { pathwayId: pathway.id, lessonsBasePath: base },
  );
  const listWarehouseLocale = await getPathwayLessonListWarehouseLocaleForHub(pathway.id, lessonContentLocale);
  const vr = await verifyMarketingHubLessonRowsResolve(pathway, prepared.lessons, lessonContentLocale, {
    listWarehouseLocale,
    prepareStages: prepared.prepareStages,
    maxUniqueSlugsToVerify: Math.min(
      PATHWAY_HUB_MARKETING_VERIFY_UNIQUE_SLUG_CAP,
      Math.max(60, pageSize * 2),
    ),
  });
  const rows = vr.kept;

  let questionSnapshot = EMPTY_QUESTION_SNAPSHOT;
  let questionSnapshotLoadRejected = false;
  try {
    questionSnapshot = await loadPathwayQuestionBankSnapshot(pathway.id);
  } catch {
    questionSnapshotLoadRejected = true;
  }

  const { crumbs, schemaItems } = pathwayLessonsDisplayCategoryBreadcrumbs(
    pathway,
    category,
    lessonCategoryToSlug(category),
  );
  const examName = pathwayRegionAwareExamName(pathway);
  const pageTitle = `${category} lessons`;
  const headerDescription = pathwayLessonHubMetaDescription(pathway);
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
      totalCount={filtered.length}
      countryOptions={[
        { label: "Canada", href: canadaHref, active: pathway.countrySlug === "canada" },
        { label: "US", href: usHref, active: pathway.countrySlug === "us" },
      ]}
    />
  );

  const session = await getOptionalPublicSession({
    pathname: routePathLessonsCategory,
    surface: "marketing.exam_hub.lessons_category",
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
  if (canShowResume && rows.length > 0) {
    const hubSlugs = rows.map((l) => l.slug).filter(Boolean);
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

  return (
    <LessonsPageShell
      title={pageTitle}
      subtitle={`${pathway.shortName} · ${pathwayCountryLabel(pathway)}`}
      toolbar={toolbar}
      backLink={{ label: "All lesson areas", href: base }}
    >
      <MarketingHubSmokeDiagnosticsJson
        payload={{
          surface: "marketing_pathway_lessons_category",
          outcome: filtered.length === 0 ? "empty_category" : "rendered",
          pathwayId: pathway.id,
          routePathname: routePathLessonsCategory,
          category,
          catalogFiltered: filtered.length,
          verifiedRows: rows.length,
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
        data-nn-qa-pathway-lessons-category="true"
        aria-labelledby="lesson-category-heading"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
          <h2 id="lesson-category-heading" className="text-base font-semibold text-[var(--theme-heading-text)]">
            {category}
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
            {filtered.length.toLocaleString()} {filtered.length === 1 ? "lesson" : "lessons"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--theme-muted-text)]">
            <p className="font-medium text-[var(--theme-heading-text)]">No lessons in this area yet.</p>
            <p className="mt-2">
              There are no catalog lessons mapped to <strong className="text-[var(--theme-heading-text)]">{category}</strong>{" "}
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
              const href = pathwayLessonMarketingDetailHref(base, l.slug);
              const label = cleanLessonTitleForDisplay(l.title, l.seoTitle, l.slug);
              const prog = progressMap[l.slug];
              return (
                <li key={l.slug}>
                  {href ? (
                    <Link
                      href={href}
                      className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 text-sm font-medium text-primary hover:bg-[var(--semantic-panel-muted)]"
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
