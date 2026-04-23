import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExamFamily, type TierCode } from "@prisma/client";
import { PathwayLessonSectionContent } from "@/components/lessons/pathway-lesson-body";
import { PathwayLessonNextStepsCards } from "@/components/lessons/pathway-lesson-next-steps-cards";
import {
  pathwayMarketingQuestionBankTopicHref,
  lessonStudyLoopRelatedLessonsHubHref,
} from "@/components/lessons/pathway-lesson-link-practice";
import { LessonSectionCard } from "@/components/lessons/lesson-section-card";
import { contentTierForPathwayLessonRender } from "@/lib/lessons/global-lesson-architecture";
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import { PremiumLessonPublishNotice } from "@/components/lessons/premium-lesson-publish-notice";
import { PathwayLessonLockedSectionsPreview } from "@/components/lessons/pathway-lesson-locked-sections-preview";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { PathwayLessonProgressBadgeLive } from "@/components/lessons/pathway-lesson-progress-badge-live";
import { PathwayLessonProgressTracker } from "@/components/lessons/pathway-lesson-progress-tracker";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { pathwayLessonPremiumSectionBodyText, pathwayLessonSectionSurfaceHeading } from "@/lib/lessons/pathway-lesson-section-surface";
import { pathwayHubAppFlashcardsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLessonPreviewBanner } from "@/components/lessons/pathway-lesson-preview-banner";
import {
  getPathwayLessonPreviewKind,
  sanitizePaywallPreviewSection,
  visibleSectionsForLesson,
} from "@/lib/lessons/pathway-lesson-access";
import { resolveMarketingPathwayLessonRouteResolution } from "@/lib/lessons/pathway-lesson-route-access";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import { loadPathwayLessonWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getStaffSession } from "@/lib/auth/staff-session";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { PathwayLessonMedicalEducationJsonLd } from "@/components/seo/seo-json-ld";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { pathwayLessonDetailBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { getPathwayLessonContentDates } from "@/lib/seo/pathway-lesson-content-dates";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { LessonQualityNotice } from "@/components/lessons/lesson-quality-notice";
import { classifyPathwayLesson } from "@/lib/content-quality/classify-lesson";
import { buildQuickReviewBullets } from "@/lib/lessons/pathway-lesson-quick-review";
import { extractExamFocusHighYieldLines, extractSecondaryExamContextLines } from "@/lib/lessons/pathway-lesson-study-extract";
import { PathwayLessonStudyRail } from "@/components/lessons/pathway-lesson-study-rail";
import { resolveLessonImage } from "@/lib/content/resolve-lesson-image";
import { LessonClinicalImageCard } from "@/components/lessons/lesson-clinical-image-card";
import { LessonAudioCard } from "@/components/lessons/lesson-audio-card";
import { LessonSectionAudioButton } from "@/components/lessons/lesson-section-audio-button";
import { pathwayLessonPublicDetailPath, type PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { LessonCheckpointCard } from "@/components/lessons/lesson-checkpoint-card";
import { LessonRecallProvider } from "@/components/lessons/lesson-recall-context";
import { LessonRecallToggle } from "@/components/lessons/lesson-recall-toggle";
import { LessonRecallBlock } from "@/components/lessons/lesson-recall-block";
import { LessonKeyRecallChip } from "@/components/lessons/lesson-key-recall-chip";
import {
  loadPathwayLessonProgressForSlug,
  type PathwayLessonProgressStatus,
} from "@/lib/lessons/pathway-lesson-progress";
import { PathwayLessonAssessmentExperience } from "@/components/lessons/pathway-lesson-assessment-experience";
import { PathwayLessonDetailHeader } from "@/components/lessons/pathway-lesson-detail-header";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import {
  PathwayLessonDeferredRelatedRail,
  PathwayLessonDetailDeferred,
  PathwayLessonDetailDeferredSkeleton,
  PathwayLessonRelatedRailSkeleton,
} from "@/components/lessons/pathway-lesson-detail-deferred";
import { PathwayLessonRecordChips } from "@/components/pathway-lessons/pathway-lesson-record-chips";
import { MarketingPathwayLessonDetailViewBeacon } from "@/components/observability/marketing-study-surface-view-beacons";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { DEFAULT_STUDY_SETTINGS } from "@/lib/learner/study-settings";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { shouldRenderPathwayLessonSection } from "@/lib/lessons/lesson-section-page-layout";
import { ExamTakeawaysBlock } from "@/components/lessons/exam-takeaways-block";
import { PathwayLessonMemoryAnchorStrip } from "@/components/lessons/pathway-lesson-study-strips";
import { lessonHasExamTakeaways } from "@/lib/lessons/exam-takeaways-items";
import { resolvePathwayLessonBankAssessments } from "@/lib/lessons/lesson-bank-assessment-selection";
import {
  loadPathwayLessonAdjacent,
  mapPathwayLessonAdjacentToHrefs,
} from "@/lib/lessons/pathway-lesson-adjacent";
import { PathwayLessonSequenceNavBar } from "@/components/lessons/pathway-lesson-sequence-nav";
import { PathwayLessonStickySequenceNav } from "@/components/lessons/pathway-lesson-sticky-sequence-nav";
import { PathwayLessonInteractiveModules } from "@/components/lessons/pathway-lesson-interactive-modules";
import { getLessonInteractiveModules } from "@/lib/lessons/lesson-interactive-modules";
import {
  pickPathwayLessonMarketingRecordChipsSource,
  toPathwayLessonDeferredServerSnapshot,
} from "@/lib/lessons/marketing-pathway-lesson-client-contract";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { loadMarketingMessageShardsSync } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { LEARNER_APP_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

/**
 * Paywall: full `PathwayLessonRecord` / `sections[]` stay in this server component. Gate with
 * `canViewFullPathwayLesson` / `visibleSectionsForLesson` before rendering; pass only thin props into
 * `"use client"` surfaces (see `marketing-pathway-lesson-client-contract.ts`). Subscriber-only supplements
 * (takeaways, memory anchor, traps) render only when `fullAccess` is true.
 */

export type PathwayLessonDetailPageBodyProps = {
  pathway: ExamPathwayDefinition;
  pathname: string;
  lessonSlug: string;
};

export async function PathwayLessonDetailPageBody({ pathway, pathname, lessonSlug }: PathwayLessonDetailPageBodyProps) {
  const lessonContentLocale = DEFAULT_MARKETING_LOCALE;

  const [lessonResult, sessionRes, staffRes] = await Promise.allSettled([
    loadPathwayLessonWithLegacySlugRedirect(pathway, lessonSlug, lessonContentLocale),
    getProtectedRouteSession("marketing.pathway_lesson_detail"),
    getStaffSession(),
  ]);
  const loadedLesson =
    lessonResult.status === "fulfilled" ? lessonResult.value : undefined;
  const lessonLoadFailed = lessonResult.status === "rejected";

  const session = sessionRes.status === "fulfilled" ? sessionRes.value : null;
  const userIdRaw = (session?.user as { id?: string } | undefined)?.id;
  const userId = typeof userIdRaw === "string" ? userIdRaw.trim() : "";
  const staffFullLessonAccess = staffRes.status === "fulfilled" && Boolean(staffRes.value);

  const [studySettingsRes, entRes, lpRes] = await Promise.allSettled([
    loadStudySettings(userId),
    resolveEntitlementForPage(userId),
    (async (): Promise<string | null> => {
      if (!userId || !isDatabaseUrlConfigured()) return null;
      try {
        const u = await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } });
        return u?.learnerPath ?? null;
      } catch {
        return null;
      }
    })(),
  ]);
  const studySettings = studySettingsRes.status === "fulfilled" ? studySettingsRes.value : DEFAULT_STUDY_SETTINGS;
  const entitlement = entRes.status === "fulfilled" ? entRes.value : "error";
  const learnerPathResolved = lpRes.status === "fulfilled" ? lpRes.value : null;

  const routeResolution = resolveMarketingPathwayLessonRouteResolution({
    pathway,
    lesson: loadedLesson,
    lessonLoadFailed,
    userId,
    entitlement,
    learnerPathResolved,
    staffFullLessonAccess,
  });
  if (routeResolution.kind === "not_found") notFound();

  const { lesson, fullAccess, scope, entitlementError } = routeResolution;
  const examName = pathwayRegionAwareExamName(pathway);
  const bankEntitlement: AccessScope | null =
    entitlement !== "error"
      ? entitlement
      : staffFullLessonAccess
        ? {
            hasAccess: true,
            reason: "admin_override",
            tier: null,
            country: pathway.countryCode,
            alliedCareer: null,
          }
        : null;
  const [bankAssessmentsRes, adjacentSlugsRes, contentDatesRes] = await Promise.allSettled([
    resolvePathwayLessonBankAssessments(pathway, lesson, bankEntitlement),
    loadPathwayLessonAdjacent(pathway.id, lesson.slug, lessonContentLocale),
    getPathwayLessonContentDates(pathway.id, lesson.slug, lessonContentLocale),
  ]);
  const bankAssessments: { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] } =
    bankAssessmentsRes.status === "fulfilled"
      ? bankAssessmentsRes.value
      : { preTest: [], postTest: [] };
  const adjacentSlugs = adjacentSlugsRes.status === "fulfilled" ? adjacentSlugsRes.value : { prev: null, next: null };
  const lessonAdjacentHrefs = mapPathwayLessonAdjacentToHrefs(adjacentSlugs, (slug) =>
    pathwayLessonPublicDetailPath(pathway, slug),
  );
  const hasLessonSequence = Boolean(adjacentSlugs.prev || adjacentSlugs.next);
  const visible = visibleSectionsForLesson(lesson, fullAccess);
  const visibleForRender = fullAccess ? visible : visible.map(sanitizePaywallPreviewSection);
  const previewLesson =
    fullAccess
      ? lesson
      : { ...lesson, sections: visibleForRender, preTest: undefined, postTest: undefined };

  const tierForLessonContent: TierCode | null =
    entitlement === "error" ? null : (entitlement.tier as TierCode | null);
  const lessonContentTier = contentTierForPathwayLessonRender(pathway, tierForLessonContent);
  const lessonMeasurementSystem = getMeasurementSystemForCountry(pathway.countryCode);

  const base = marketingPathwayLessonsIndexPath(pathway);
  const blogHubPath = buildExamPathwayPath(pathway, "blog");

  const lessonProgress =
    userId && fullAccess
      ? await loadPathwayLessonProgressForSlug(userId, pathway.id, lesson.slug)
      : ("not_started" satisfies PathwayLessonProgressStatus);

  // Strip body before passing locked sections to any downstream component — only headings are needed for the
  // teaser. This prevents accidental body serialization if the preview component ever becomes a Client Component.
  const lockedSections =
    !fullAccess && lesson.sections.length > visible.length
      ? lesson.sections
          .slice(visible.length)
          .filter((s) => shouldRenderPathwayLessonSection(s.kind))
          .map(({ id, heading }) => ({ id, heading }))
      : [];
  const displayLessonTitle = cleanLessonTitleForDisplay(lesson.title);
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(pathway, lesson.slug, displayLessonTitle);
  const lessonQuality = classifyPathwayLesson(lesson);
  const contentDates = contentDatesRes.status === "fulfilled" ? contentDatesRes.value : null;
  const jsonLdLessonPath = pathwayLessonPublicDetailPath(pathway, lesson.slug) ?? pathname;
  const quickReviewBullets = buildQuickReviewBullets(previewLesson);
  const examFocusPrimary = extractExamFocusHighYieldLines(previewLesson);
  const examFocusFallback = extractSecondaryExamContextLines(previewLesson.sections);
  const examFocusRailLines = examFocusPrimary.length > 0 ? examFocusPrimary : examFocusFallback;
  const matchedLessonImage = resolveLessonImage({
    slug: lesson.slug,
    title: lesson.title,
    topicSlug: lesson.topicSlug,
  });
  const requestedNorm = normalizePathwayLessonLocale(lessonContentLocale);
  const marketingUiLocale = DEFAULT_MARKETING_LOCALE;
  const marketingMessages = loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, LEARNER_APP_MESSAGE_SHARDS);
  const t = (key: string, params?: Record<string, string | number | undefined>) =>
    formatMarketingMessage(marketingMessages, key, params, marketingMessages, {
      locale: DEFAULT_MARKETING_LOCALE,
    });
  const showLocaleFallbackNotice = Boolean(
    lesson.localeMeta &&
      (lesson.localeMeta.usedLocaleFallback ||
        (lesson.localeMeta.isCatalogEnglishSource && requestedNorm !== "en")),
  );

  const omitHighYieldIds = new Set(lesson.omitHighYieldSectionIds ?? []);
  const displaySections = visibleForRender
    .filter((s) => shouldRenderPathwayLessonSection(s.kind))
    .filter((s) => !omitHighYieldIds.has(s.id));

  const pathwayInteractiveModules = getLessonInteractiveModules(lesson);

  const hasLessonAssessments =
    bankAssessments.preTest.length > 0 || bankAssessments.postTest.length > 0;
  const topicCodeQ = lesson.topicSlug?.trim() ? `&topicCode=${encodeURIComponent(lesson.topicSlug.trim())}` : "";
  const topicLabelQ = lesson.topic?.trim() ? `&topic=${encodeURIComponent(lesson.topic.trim())}` : "";
  const headerPracticeHref = `/app/questions?pathwayId=${encodeURIComponent(pathway.id)}${topicCodeQ}${topicLabelQ}&preset=topic_drill`;
  const headerFlashHref = lesson.topicSlug?.trim()
    ? `/app/flashcards?pathwayId=${encodeURIComponent(pathway.id)}&topicCode=${encodeURIComponent(lesson.topicSlug.trim())}`
    : `/app/flashcards?pathwayId=${encodeURIComponent(pathway.id)}`;
  const lessonStudyQuickLinks = fullAccess
    ? {
        practiceHref: headerPracticeHref,
        flashcardsHref: headerFlashHref,
        practiceLabel: t("learner.studyLoop.practiceThisTopicCta"),
        flashcardsLabel: t("learner.studyLoop.sameTopicFlashcards"),
      }
    : null;
  const lessonAssessmentFlowHint =
    fullAccess && studySettings.enablePrePostQuizzes && hasLessonAssessments
      ? "Readiness check → core lesson → reinforcement quiz after you mark this lesson studied."
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-4 pt-0 sm:px-6 sm:pb-5 lg:px-8">
      <div
        className={`nn-lesson-page-shell px-3 py-2 sm:px-5 sm:py-4${hasLessonSequence ? " pb-20 sm:pb-4" : ""}${pathway.examFamily === ExamFamily.NP ? " nn-lesson-page-shell--np" : ""}`}
      >
        <MarketingPathwayLessonDetailViewBeacon
          pathway={pathway}
          lessonSlug={lesson.slug}
          topicSlug={lesson.topicSlug}
          topicLabel={lesson.topic}
          marketingLocale={marketingUiLocale}
        />
        <PathwayLessonMedicalEducationJsonLd
          path={jsonLdLessonPath}
          headline={lesson.seoTitle}
          description={
            fullAccess
              ? lesson.seoDescription.slice(0, 320)
              : `${lesson.seoDescription.slice(0, 200)}${lesson.seoDescription.length > 200 ? "…" : ""}`
          }
          datePublished={contentDates?.datePublished ?? null}
          dateModified={contentDates?.dateModified ?? null}
        />
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
        <PathwayLessonSequenceNavBar adjacent={lessonAdjacentHrefs} className="mb-2 mt-1" />
        <PathwayLessonProgressTracker
          pathwayId={pathway.id}
          lessonSlug={lesson.slug}
          enabled={Boolean(userId) && fullAccess}
          initialProgress={lessonProgress}
        />
        <PathwayLessonDetailHeader
          pathway={pathway}
          lessonsBasePath={base}
          lessonTitle={displayLessonTitle}
          lessonTopic={lesson.topic}
          bodySystem={lesson.bodySystem}
          studyQuickLinks={lessonStudyQuickLinks}
          assessmentFlowHint={lessonAssessmentFlowHint}
          metaChips={
            <PathwayLessonRecordChips lesson={pickPathwayLessonMarketingRecordChipsSource(lesson)} omitTopic />
          }
          trailing={
            userId && fullAccess ? (
              <PathwayLessonProgressBadgeLive
                pathwayId={pathway.id}
                lessonSlug={lesson.slug}
                initial={lessonProgress}
                className="shrink-0"
              />
            ) : null
          }
        />
        {fullAccess && lessonHasExamTakeaways(lesson.studyTakeaways) ? (
          <div className="mt-4 max-w-5xl">
            <ExamTakeawaysBlock pathway={pathway} items={lesson.studyTakeaways} position="top" />
          </div>
        ) : null}
        {fullAccess ? (
          <div className="mt-4 space-y-2">
            <PremiumLessonPublishNotice validation={lesson.premiumValidation} />
            <LessonQualityNotice tier={lessonQuality.tier} wordCount={lessonQuality.wordCount} />
          </div>
        ) : null}
        {fullAccess && lesson.memoryAnchor ? (
          <div className="mt-4 max-w-5xl">
            <PathwayLessonMemoryAnchorStrip text={lesson.memoryAnchor} />
          </div>
        ) : null}
        {showLocaleFallbackNotice ? (
          <aside
            className="nn-card mt-4 border-border bg-[var(--theme-muted-surface)] p-3 text-sm text-[var(--theme-body-text)]"
            data-testid="aside-pathway-lesson-locale-en"
          >
            {lesson.localeMeta?.isCatalogEnglishSource ? (
              <>
                This lesson body is <span className="font-medium text-foreground">English</span> (bundled catalog or seed
                data). A <span className="font-medium text-foreground">{lesson.localeMeta.requestedContentLocale}</span>{" "}
                version will appear here once a matching row is published in{" "}
                <span className="font-medium text-foreground">pathway_lessons</span>.
              </>
            ) : lesson.localeMeta?.usedLocaleFallback ? (
              <>
                No published lesson was found for{" "}
                <span className="font-medium text-foreground">{lesson.localeMeta.requestedContentLocale}</span>; showing the{" "}
                <span className="font-medium text-foreground">{lesson.localeMeta.contentLocale}</span> version instead.
              </>
            ) : null}
          </aside>
        ) : null}

        {!fullAccess ? (
          entitlementError ? (
            <>
              <aside className="nn-card mt-6 border-amber-200 bg-amber-50 p-4 text-sm text-[var(--theme-body-text)] dark:border-amber-900/40 dark:bg-amber-950/30">
                <p className="font-semibold">Access check didn’t complete</p>
                <p className="mt-1 text-[var(--theme-body-text)]">
                  We couldn’t confirm your plan (temporary server or data issue). This is not the same as being denied access.
                  Refresh in a moment; you can still read the preview sections below. Sign in again or contact support if it
                  persists.
                </p>
              </aside>
              <PathwayLessonPreviewBanner
                kind="default_preview"
                pathwayShortName={pathway.shortName}
                pathwayCountryLabel={pathway.countryCode === "CA" ? "Canada" : "United States"}
                postAuthReturnPath={pathname}
              />
            </>
          ) : (
            <PathwayLessonPreviewBanner
              kind={getPathwayLessonPreviewKind(scope, pathway, learnerPathResolved, userId)}
              pathwayShortName={pathway.shortName}
              pathwayCountryLabel={pathway.countryCode === "CA" ? "Canada" : "United States"}
              postAuthReturnPath={pathname}
            />
          )
        ) : null}

        <div className="mt-3 flex flex-col gap-5 xl:grid xl:grid-cols-[minmax(0,1fr)_16.25rem] xl:items-start xl:gap-x-8 xl:gap-y-0 2xl:gap-x-10">
          <aside
            className="shrink-0 space-y-3 xl:sticky xl:top-24 xl:order-2 xl:col-start-2 xl:w-full xl:self-start xl:max-h-[calc(100vh-5.5rem)] xl:overflow-y-auto xl:overscroll-contain xl:pl-1"
            aria-label="Lesson quick review"
          >
            <PathwayLessonStudyRail
              quickReviewLines={quickReviewBullets}
              examFocusLines={examFocusRailLines}
              commonMistakes={fullAccess ? lesson.studyCommonTraps : undefined}
              fullAccess={fullAccess}
              relatedQuestionsSlot={
                <Suspense fallback={<PathwayLessonRelatedRailSkeleton />}>
                  <PathwayLessonDeferredRelatedRail
                    pathway={pathway}
                    lesson={toPathwayLessonDeferredServerSnapshot(lesson)}
                    contentLocale={lessonContentLocale}
                    bankEntitlement={bankEntitlement}
                    fullQuizAccess={fullAccess}
                    userId={userId}
                  />
                </Suspense>
              }
            />
          </aside>

          <div className="min-w-0 xl:order-1 xl:col-start-1 xl:row-start-1">
        <div className="nn-lesson-page-reading">
        {matchedLessonImage.url ? (
          <LessonClinicalImageCard
            url={matchedLessonImage.url}
            alt={matchedLessonImage.alt}
            source={matchedLessonImage.source}
          lessonTitle={displayLessonTitle}
          />
        ) : null}

        {fullAccess && lesson.audioUrl ? (
          <LessonAudioCard audioUrl={lesson.audioUrl} lessonTitle={displayLessonTitle} />
        ) : null}

        <PathwayLessonAssessmentExperience
          userId={userId}
          pathwayId={pathway.id}
          lessonSlug={lesson.slug}
          initialProgress={lessonProgress}
          preTest={fullAccess ? bankAssessments.preTest : undefined}
          postTest={fullAccess ? bankAssessments.postTest : undefined}
          fullAccess={fullAccess}
          assessmentsEnabled={studySettings.enablePrePostQuizzes}
          sectionAnchors={displaySections.map((s) => ({
            id: s.id,
            label: pathwayLessonSectionSurfaceHeading(s, pathway.countryCode, t),
          }))}
        >
          <LessonRecallProvider>
            <div className="mt-4 sm:mt-5">
              <div className="mb-2 flex justify-end">
                <LessonRecallToggle />
              </div>
              <article className="space-y-6 sm:space-y-8">
                {displaySections.map((section) => {
                  const surfaceHeading = pathwayLessonSectionSurfaceHeading(section, pathway.countryCode, t);
                  const sectionBody = pathwayLessonPremiumSectionBodyText(section, pathway.id, pathway.countryCode);
                  return (
                    <LessonSectionCard
                      key={section.id}
                      id={section.id}
                      heading={surfaceHeading}
                      kind={section.kind}
                    >
                      {section.audioUrl ? (
                        <LessonSectionAudioButton
                          audioUrl={section.audioUrl}
                          sectionId={section.id}
                          sectionHeading={surfaceHeading}
                        />
                      ) : null}
                      {section.kind === "related_next_steps" ? (
                        <PathwayLessonNextStepsCards
                          practiceHref={pathwayMarketingQuestionBankTopicHref(
                            pathway,
                            lesson.topic,
                            lesson.topicSlug?.trim() || undefined,
                          )}
                          lessonsHref={lessonStudyLoopRelatedLessonsHubHref(base, lesson.topicSlug)}
                          flashcardsHref={loginWithCallback(
                            pathwayHubAppFlashcardsHref(pathway.id, lesson.topicSlug),
                          )}
                          practiceLabel={t("learner.studyLoop.practiceThisTopicCta")}
                          lessonsLabel={t("learner.lessons.detail.nextStepsReviewLessons")}
                          flashcardsLabel={t("learner.studyLoop.sameTopicFlashcards")}
                        />
                      ) : (
                        <PathwayLessonSectionContent
                          text={sectionBody}
                          figures={section.figures}
                          examFocus={section.examFocus}
                          lessonWikiBasePath={base}
                          viewerTier={lessonContentTier}
                          measurementSystem={lessonMeasurementSystem}
                          sectionKind={section.kind ?? null}
                          emptyBodyMessage={t("learner.lessons.detail.sectionEmptyBody")}
                          figuresVisualLeadMessage={t("learner.lessons.detail.sectionFiguresVisualLead")}
                        />
                      )}
                      {section.keyRecallFacts?.length ? (
                        <LessonKeyRecallChip facts={section.keyRecallFacts} />
                      ) : null}
                      {section.recallPrompts?.length ? (
                        <LessonRecallBlock prompts={section.recallPrompts} />
                      ) : null}
                      {section.checkpointQuestions?.length ? (
                        <LessonCheckpointCard questions={section.checkpointQuestions} />
                      ) : null}
                    </LessonSectionCard>
                  );
                })}
              </article>
            </div>
            {pathwayInteractiveModules.length > 0 ? (
              <div className="mt-6">
                <PathwayLessonInteractiveModules
                  modules={pathwayInteractiveModules}
                  viewerTier={lessonContentTier}
                  countryCode={pathway.countryCode}
                />
              </div>
            ) : null}
            {fullAccess && lessonHasExamTakeaways(lesson.studyTakeaways) ? (
              <div className="mt-6">
                <ExamTakeawaysBlock pathway={pathway} items={lesson.studyTakeaways} position="bottom" />
              </div>
            ) : null}
          </LessonRecallProvider>

          {lockedSections.length > 0 ? (
            <div className="mt-5">
              <PathwayLessonLockedSectionsPreview sections={lockedSections} postAuthReturnPath={pathname} />
            </div>
          ) : null}
        </PathwayLessonAssessmentExperience>

        <PathwayLessonActions
          pathwayId={pathway.id}
          lessonSlug={lesson.slug}
          topicCode={lesson.topicSlug}
          topicLabel={lesson.topic}
          userId={userId}
          canMarkComplete={fullAccess}
          initialProgress={lessonProgress}
          catAdaptiveAvailable={pathwayAllowsCatAdaptiveStart(pathway)}
        />
        </div>
          </div>
        </div>

        <Suspense fallback={<PathwayLessonDetailDeferredSkeleton />}>
          <PathwayLessonDetailDeferred
            pathway={pathway}
            lesson={toPathwayLessonDeferredServerSnapshot(lesson)}
            lessonsBasePath={base}
            contentLocale={lessonContentLocale}
            bankEntitlement={bankEntitlement}
            fullQuizAccess={fullAccess}
            userId={userId}
          />
        </Suspense>

        <p className="mt-8 text-center text-xs text-[var(--theme-muted-text)]">
          <Link href={blogHubPath} className="font-medium text-primary hover:underline">
            {examName} blog posts
          </Link>
          {" · "}
          <Link href={`/blog/tag/${encodeURIComponent(lesson.topicSlug)}`} className="font-medium text-primary hover:underline">
            {lesson.topic} articles
          </Link>
          {" · "}
          <Link href="/tools" className="font-medium text-primary hover:underline">
            Tools
          </Link>
          {" · "}
          <Link href="/lessons" className="font-medium text-primary hover:underline">
            All lesson hubs
          </Link>
          {" · "}
          <Link href={buildExamPathwayPath(pathway)} className="font-medium text-primary hover:underline">
            {examName} exam hub
          </Link>
        </p>

        <MarketingStudyCrossLinks className="mt-12" />
        {hasLessonSequence ? <PathwayLessonStickySequenceNav adjacent={lessonAdjacentHrefs} /> : null}
      </div>
    </div>
  );
}
