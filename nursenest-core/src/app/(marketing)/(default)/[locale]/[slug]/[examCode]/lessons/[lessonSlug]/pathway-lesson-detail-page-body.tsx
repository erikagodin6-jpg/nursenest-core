import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExamFamily, type TierCode } from "@prisma/client";
import { PathwayLessonSectionContent } from "@/components/lessons/pathway-lesson-body";
import { LessonSectionCard } from "@/components/lessons/lesson-section-card";
import { contentTierForPathwayLessonRender } from "@/lib/lessons/global-lesson-architecture";
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import { PremiumLessonPublishNotice } from "@/components/lessons/premium-lesson-publish-notice";
import { PathwayLessonLockedSectionsPreview } from "@/components/lessons/pathway-lesson-locked-sections-preview";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { computePathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-linked-learning-assets";
import { PathwayLessonProgressBadgeLive } from "@/components/lessons/pathway-lesson-progress-badge-live";
import { PathwayLessonProgressTracker } from "@/components/lessons/pathway-lesson-progress-tracker";
import { loadMarketingPathwayLessonViewerContext } from "@/lib/lessons/marketing-pathway-lesson-viewer-context.server";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { PathwayLessonPreviewBanner } from "@/components/lessons/pathway-lesson-preview-banner";
import {
  getPathwayLessonPreviewKind,
  sanitizePaywallPreviewSection,
  visibleSectionsForLesson,
} from "@/lib/lessons/pathway-lesson-access";
import { resolveMarketingPathwayLessonRouteResolution } from "@/lib/lessons/pathway-lesson-route-access";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import { loadPathwayLessonWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { EeatContentAttribution } from "@/components/seo/eeat-content-attribution";
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
import { LessonSectionNav } from "@/components/lessons/lesson-section-nav";
import { LessonStudyPhaseProgress } from "@/components/lessons/lesson-study-phase-progress";
import { PathwayLessonQuickClinicalSummary } from "@/components/lessons/pathway-lesson-quick-clinical-summary";
import { resolveLessonImage } from "@/lib/content/resolve-lesson-image";
import { hasRenderableLessonImageUrl } from "@/lib/lessons/has-renderable-lesson-image";
import { LessonClinicalImageCard } from "@/components/lessons/lesson-clinical-image-card";
import { LessonAudioCard } from "@/components/lessons/lesson-audio-card";
import { LessonSectionAudioButton } from "@/components/lessons/lesson-section-audio-button";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
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
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
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
import { buildAlliedAwareLessonPublicSeoSurface } from "@/lib/allied/allied-lesson-seo-differentiation";
import {
  pathwayLessonSectionPrefersWideColumn,
  shouldRenderPathwayLessonSection,
} from "@/lib/lessons/lesson-section-page-layout";
import { ExamTakeawaysBlock } from "@/components/lessons/exam-takeaways-block";
import { PathwayLessonMemoryAnchorStrip } from "@/components/lessons/pathway-lesson-study-strips";
import { lessonHasExamTakeaways } from "@/lib/lessons/exam-takeaways-items";
import { resolveQuizEmbedQuestionsForLessonSlug } from "@/lib/lessons/lesson-quiz-embeds";
import { PathwayLessonQuizEmbedSection } from "@/components/lessons/pathway-lesson-quiz-embed-section";
import { resolvePathwayLessonBankAssessments } from "@/lib/lessons/lesson-bank-assessment-selection";
import {
  loadPathwayLessonAdjacent,
  mapPathwayLessonAdjacentToHrefs,
} from "@/lib/lessons/pathway-lesson-adjacent";
import { PathwayLessonSequenceNavBar } from "@/components/lessons/pathway-lesson-sequence-nav";
import { PathwayLessonStickySequenceNav } from "@/components/lessons/pathway-lesson-sticky-sequence-nav";
import {
  pickPathwayLessonMarketingRecordChipsSource,
  toPathwayLessonDeferredServerSnapshot,
} from "@/lib/lessons/marketing-pathway-lesson-client-contract";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { loadMarketingMessageShardsSync } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { LEARNER_APP_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { StaffEditLivePageBanner } from "@/components/staff/staff-edit-live-page-banner";
import { buildAdminPathwayLessonStableEditHref } from "@/lib/admin/pathway-lesson-stable-edit-href";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLessonDetailMarketingI18nLayer } from "@/components/lessons/pathway-lesson-detail-marketing-i18n-layer";

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
  lessonContentLocale: string;
};

export async function PathwayLessonDetailPageBody({
  pathway,
  pathname,
  lessonSlug,
  lessonContentLocale,
}: PathwayLessonDetailPageBodyProps) {

  const [lessonResult] = await Promise.allSettled([
    loadPathwayLessonWithLegacySlugRedirect(pathway, lessonSlug, lessonContentLocale),
  ]);
  const loadedLesson =
    lessonResult.status === "fulfilled" ? lessonResult.value : undefined;
  const lessonLoadFailed = lessonResult.status === "rejected";

  const { userId, entitlement, staffFullLessonAccess, learnerPathResolved } =
    await loadMarketingPathwayLessonViewerContext("(marketing).pathway-lesson-detail-page-body");

  const [studySettingsRes] = await Promise.allSettled([loadStudySettings(userId)]);
  const studySettings = studySettingsRes.status === "fulfilled" ? studySettingsRes.value : DEFAULT_STUDY_SETTINGS;
  const bankEntitlement: AccessScope | null = entitlement === "error" ? null : entitlement;
  /** Staff QA: treat like subscriber for bank-linked surfaces where entitlement resolves; lesson body uses `fullAccess`. */
  const fullQuizAccess = bankEntitlement?.hasAccess === true || staffFullLessonAccess;

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
  const linkedLearningSignals =
    lesson.linkedLearningSignals ?? computePathwayLessonLinkedLearningSignals(pathway.id, lesson);
  const examName = pathwayRegionAwareExamName(pathway);
  const [bankAssessmentsRes, adjacentSlugsRes, contentDatesRes] = await Promise.allSettled([
    resolvePathwayLessonBankAssessments(pathway, lesson),
    loadPathwayLessonAdjacent(pathway.id, lesson.slug, lessonContentLocale),
    getPathwayLessonContentDates(pathway.id, lesson.slug, lessonContentLocale),
  ]);
  const emptyBankAssessments: { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] } = {
    preTest: [],
    postTest: [],
  };
  const bankAssessments =
    bankAssessmentsRes.status === "fulfilled" ? bankAssessmentsRes.value : emptyBankAssessments;
  const adjacentSlugs = adjacentSlugsRes.status === "fulfilled" ? adjacentSlugsRes.value : { prev: null, next: null };
  const lessonAdjacentHrefs = mapPathwayLessonAdjacentToHrefs(adjacentSlugs, (slug) =>
    pathwayLessonPublicDetailPath(pathway, slug),
  );
  const hasLessonSequence = Boolean(lessonAdjacentHrefs.prev || lessonAdjacentHrefs.next);
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
  const lessonQuizEmbed = resolveQuizEmbedQuestionsForLessonSlug(lesson.slug);

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
  const seoSurface = buildAlliedAwareLessonPublicSeoSurface(pathway, {
    title: lesson.title,
    topic: lesson.topic,
    bodySystem: lesson.bodySystem,
    seoTitle: lesson.seoTitle,
    seoDescription: lesson.seoDescription,
    alliedProfessionKey: lesson.alliedProfessionKey,
  });
  const displayLessonTitle = cleanLessonTitleForDisplay(seoSurface.displayTitle);
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

  const tocNavSections = displaySections.map((s) => ({
    id: s.id,
    heading: s.heading,
    kind: s.kind,
  }));
  let editorialRhythmCounter = 0;

  if (process.env.PATHWAY_LESSON_PUBLIC_RENDER_LOG === "1") {
    const first = displaySections[0];
    const preview = (typeof first?.body === "string" ? first.body : "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);
    safeServerLog("pathway_lesson", "[PUBLIC_LESSON_RENDER]", {
      pathwayId: pathway.id,
      lessonSlug: lesson.slug,
      sectionsCount: displaySections.length,
      firstSectionKind: first?.kind ?? null,
      firstSectionBodyPreview: preview,
      structuralPublicComplete: Boolean(lesson.structuralQuality?.publicComplete),
    });
  }

  return (
    <PathwayLessonDetailMarketingI18nLayer messages={marketingMessages}>
    <div className="mx-auto w-full max-w-[100rem] px-4 pt-1 pb-4 sm:px-6 sm:pt-2 sm:pb-5 lg:px-8">
      <div
        className={`nn-lesson-page-shell px-0 py-2 sm:px-6 sm:py-4${hasLessonSequence ? " pb-20 sm:pb-5" : ""}${pathway.examFamily === ExamFamily.NP ? " nn-lesson-page-shell--np" : ""}`}
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
          headline={seoSurface.jsonLdHeadline}
          description={
            fullAccess
              ? seoSurface.jsonLdDescription.slice(0, 320)
              : `${seoSurface.jsonLdDescription.slice(0, 200)}${seoSurface.jsonLdDescription.length > 200 ? "…" : ""}`
          }
          datePublished={contentDates?.datePublished ?? null}
          dateModified={contentDates?.dateModified ?? null}
          aboutOccupation={seoSurface.structuredAboutOccupation}
        />
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
        <PathwayLessonSequenceNavBar adjacent={lessonAdjacentHrefs} className="mb-4 hidden md:grid" />
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
        <div className="mt-4">
          <LessonStudyPhaseProgress
            progress={lessonProgress}
            persisted={Boolean(userId) && fullAccess}
          />
        </div>
        {fullAccess && lessonHasExamTakeaways(lesson.studyTakeaways) ? (
          <div className="mt-4 max-w-5xl">
            <ExamTakeawaysBlock pathway={pathway} items={lesson.studyTakeaways} position="top" />
          </div>
        ) : null}
        <div className="mt-4 space-y-2">
          {fullAccess ? <PremiumLessonPublishNotice validation={lesson.premiumValidation} /> : null}
          {fullAccess ? <LessonQualityNotice tier={lessonQuality.tier} wordCount={lessonQuality.wordCount} /> : null}
        </div>
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
              <aside
                className="nn-card mt-6 border p-4 text-sm text-[var(--theme-body-text)]"
                style={{
                  borderColor: "color-mix(in srgb, var(--semantic-warning) 35%, var(--semantic-border-soft))",
                  background: "color-mix(in srgb, var(--semantic-panel-warm) 55%, var(--semantic-surface))",
                }}
              >
                <p className="font-semibold text-[var(--theme-heading-text)]">Access check didn’t complete</p>
                <p className="mt-1 text-[var(--semantic-text-secondary)]">
                  We couldn’t confirm your plan (temporary server or data issue). This is not the same as being denied access.
                  Refresh in a moment; you can still read the preview sections below. Sign in again or contact support if it
                  persists.
                </p>
              </aside>
              <PathwayLessonPreviewBanner
                kind="default_preview"
                pathwayShortName={pathway.shortName}
                pathwayCountryLabel={pathwayCountryLabel(pathway)}
              />
            </>
          ) : (
            <PathwayLessonPreviewBanner
              kind={getPathwayLessonPreviewKind(scope, pathway, learnerPathResolved, userId)}
              pathwayShortName={pathway.shortName}
              pathwayCountryLabel={pathwayCountryLabel(pathway)}
            />
          )
        ) : null}

        <div className="nn-lesson-layout nn-lesson-layout--triple mt-5">
          <LessonSectionNav
            sections={tocNavSections}
            progress={lessonProgress}
            progressVisible={Boolean(userId) && fullAccess}
          />
          <div
            className="nn-lesson-main min-w-0"
            data-testid="pathway-lesson-main-column"
          >
        {matchedLessonImage.url && hasRenderableLessonImageUrl(matchedLessonImage.url) ? (
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
          sectionAnchors={displaySections.map((s) => ({ id: s.id, label: s.heading }))}
        >
          <LessonRecallProvider>
            <div className="mt-5 sm:mt-6">
              <div className="mb-2 flex w-full justify-end px-0">
                <LessonRecallToggle />
              </div>
              <article className="nn-lesson-article-flow nn-lesson-article-grid grid w-full max-w-none grid-cols-1 gap-5 md:mx-auto md:max-w-5xl md:grid-cols-2 md:gap-x-6 md:gap-y-5">
                {displaySections.map((section) => {
                  const wide = pathwayLessonSectionPrefersWideColumn(section.kind, {
                    hasCheckpointQuestions: Boolean(section.checkpointQuestions?.length),
                  });
                  return (
                    <LessonSectionCard
                      key={section.id}
                      id={section.id}
                      heading={section.heading}
                      kind={section.kind}
                      className={wide ? "md:col-span-2" : undefined}
                    >
                      {section.audioUrl ? (
                        <LessonSectionAudioButton
                          audioUrl={section.audioUrl}
                          sectionId={section.id}
                          sectionHeading={section.heading}
                        />
                      ) : null}
                      <PathwayLessonSectionContent
                        text={typeof section.body === "string" ? section.body : ""}
                        figures={section.figures}
                        examFocus={section.examFocus}
                        lessonWikiBasePath={base}
                        viewerTier={lessonContentTier}
                        measurementSystem={lessonMeasurementSystem}
                        emptyBodyMessage={t("learner.lessons.detail.sectionEmptyBody")}
                        figuresVisualLeadMessage={t("learner.lessons.detail.sectionFiguresVisualLead")}
                      />
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
              {lessonQuizEmbed?.length ? (
                <div className="mx-auto mt-8 max-w-5xl">
                  <PathwayLessonQuizEmbedSection
                    lessonSlug={lesson.slug}
                    links={{
                      practiceExamsHref: buildExamPathwayPath(pathway, "exams"),
                      flashcardsHref: buildExamPathwayPath(pathway, "flashcards"),
                      practiceQuestionsHref: buildExamPathwayPath(pathway, "questions"),
                      relatedLessonsHref: base,
                    }}
                  />
                </div>
              ) : null}
            </div>
            {fullAccess && lessonHasExamTakeaways(lesson.studyTakeaways) ? (
              <div className="mx-auto mt-6 max-w-5xl">
                <ExamTakeawaysBlock pathway={pathway} items={lesson.studyTakeaways} position="bottom" />
              </div>
            ) : null}
          </LessonRecallProvider>

          {lockedSections.length > 0 ? (
            <div className="mx-auto mt-5 max-w-5xl">
              <PathwayLessonLockedSectionsPreview sections={lockedSections} />
            </div>
          ) : null}

          <PathwayLessonQuickClinicalSummary
            quickReviewLines={quickReviewBullets}
            examFocusLines={examFocusRailLines}
            commonMistakes={fullAccess ? lesson.studyCommonTraps : undefined}
            fullAccess={fullAccess}
          />

          <PathwayLessonActions
            pathwayId={pathway.id}
            lessonSlug={lesson.slug}
            topicCode={lesson.topicSlug}
            topicLabel={lesson.topic}
            userId={userId}
            canMarkComplete={fullAccess}
            initialProgress={lessonProgress}
            catAdaptiveAvailable={pathwayAllowsCatAdaptiveStart(pathway)}
            linkedLearningSignals={linkedLearningSignals}
            linkMode="marketing"
          />
        </PathwayLessonAssessmentExperience>
          </div>

          <aside
            className="nn-lesson-study-rail-aside shrink-0 border-t border-[var(--semantic-border-soft)] pt-6 xl:sticky xl:top-24 xl:w-full xl:border-t-0 xl:pt-0 xl:self-start xl:max-h-[calc(100vh-5.5rem)] xl:overflow-y-auto xl:overscroll-contain xl:pr-1"
            aria-label="Lesson utilities"
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
                    fullQuizAccess={fullQuizAccess}
                    userId={userId}
                  />
                </Suspense>
              }
            />
          </aside>
        </div>

        <Suspense fallback={<PathwayLessonDetailDeferredSkeleton />}>
          <PathwayLessonDetailDeferred
            pathway={pathway}
            lesson={toPathwayLessonDeferredServerSnapshot(lesson)}
            lessonsBasePath={base}
            contentLocale={lessonContentLocale}
            bankEntitlement={bankEntitlement}
            fullQuizAccess={fullQuizAccess}
            userId={userId}
          />
        </Suspense>

        <div className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] px-4 py-3 text-center shadow-[var(--semantic-shadow-soft)] sm:px-5">
          <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
          <Link href={blogHubPath} className="font-medium text-primary hover:underline">
            {examName} blog posts
          </Link>
          {" · "}
          <Link href={`/blog/tag/${encodeURIComponent(lesson.topicSlug)}`} className="font-medium text-primary hover:underline">
            {lesson.topic} articles
          </Link>
          {" · "}
          <Link href={HUB.flashcards} className="font-medium text-primary hover:underline">
            Flashcards hub
          </Link>
          {" · "}
          <Link href={HUB.questionBank} className="font-medium text-primary hover:underline">
            Practice questions
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
        </div>

        <MarketingStudyCrossLinks className="mt-12" />
        <EeatContentAttribution variant="lesson" />
        <StaffEditLivePageBanner
          adminHref={buildAdminPathwayLessonStableEditHref({
            pathwayId: pathway.id,
            slug: lesson.slug,
            locale: lessonContentLocale,
          })}
          label="Edit this pathway lesson"
        />
        {hasLessonSequence ? <PathwayLessonStickySequenceNav adjacent={lessonAdjacentHrefs} /> : null}
      </div>
    </div>
    </PathwayLessonDetailMarketingI18nLayer>
  );
}
