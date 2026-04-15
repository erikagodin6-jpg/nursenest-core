import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExamFamily, type TierCode } from "@prisma/client";
import { auth } from "@/lib/auth";
import { PathwayLessonSectionContent } from "@/components/lessons/pathway-lesson-body";
import { LessonSectionCard } from "@/components/lessons/lesson-section-card";
import { contentTierForPathwayLessonRender } from "@/lib/lessons/global-lesson-architecture";
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import { PremiumLessonPublishNotice } from "@/components/lessons/premium-lesson-publish-notice";
import { PathwayLessonLockedSectionsPreview } from "@/components/lessons/pathway-lesson-locked-sections-preview";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { PathwayLessonProgressBadgeLive } from "@/components/lessons/pathway-lesson-progress-badge-live";
import { PathwayLessonProgressTracker } from "@/components/lessons/pathway-lesson-progress-tracker";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { PathwayLessonPreviewBanner } from "@/components/lessons/pathway-lesson-preview-banner";
import {
  getPathwayLessonPreviewKind,
  sanitizePaywallPreviewSection,
  visibleSectionsForLesson,
} from "@/lib/lessons/pathway-lesson-access";
import {
  pathwayLessonEligibleForPublicMarketingSurface,
  resolveMarketingPathwayLessonRouteResolution,
} from "@/lib/lessons/pathway-lesson-route-access";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import { loadPathwayLessonWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { EeatContentAttribution } from "@/components/seo/eeat-content-attribution";
import { PathwayLessonMedicalEducationJsonLd } from "@/components/seo/seo-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { pathwayLessonDetailBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { getPathwayLessonContentDates } from "@/lib/seo/pathway-lesson-content-dates";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { LessonQualityNotice } from "@/components/lessons/lesson-quality-notice";
import { PathwayLessonQuickReview } from "@/components/lessons/pathway-lesson-quick-review";
import { classifyPathwayLesson } from "@/lib/content-quality/classify-lesson";
import { buildQuickReviewBullets } from "@/lib/lessons/pathway-lesson-quick-review";
import { resolveLessonImage } from "@/lib/content/resolve-lesson-image";
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
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import {
  PathwayLessonDetailDeferred,
  PathwayLessonDetailDeferredSkeleton,
} from "@/components/lessons/pathway-lesson-detail-deferred";
import { PathwayLessonRecordChips } from "@/components/pathway-lessons/pathway-lesson-record-chips";
import { MarketingPathwayLessonDetailViewBeacon } from "@/components/observability/marketing-study-surface-view-beacons";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import {
  pathwayLessonSectionPrefersWideColumn,
  shouldRenderPathwayLessonSection,
} from "@/lib/lessons/lesson-section-page-layout";
import { ExamTakeawaysBlock } from "@/components/lessons/exam-takeaways-block";
import { PathwayLessonCommonTrapsStrip, PathwayLessonMemoryAnchorStrip } from "@/components/lessons/pathway-lesson-study-strips";
import { lessonHasExamTakeaways } from "@/lib/lessons/exam-takeaways-items";
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

/**
 * Paywall: full `PathwayLessonRecord` / `sections[]` stay in this server component. Gate with
 * `canViewFullPathwayLesson` / `visibleSectionsForLesson` before rendering; pass only thin props into
 * `"use client"` surfaces (see `marketing-pathway-lesson-client-contract.ts`). Subscriber-only supplements
 * (takeaways, memory anchor, traps) render only when `fullAccess` is true.
 */

/** Avoid enumerating every lesson at build (large `.next` output + ENOSPC on small disks). */
export const dynamic = "force-dynamic";
export const dynamicParams = true;
/**
 * Per-request render (no shared ISR snapshot). `maxDuration` allows cold DB + related queries under load.
 */
export const maxDuration = 60;

type Props = {
  /** `locale` is pathway countrySlug (`us` / `canada`), not BCP-47 lesson content. */
  params: Promise<{ locale: string; slug: string; examCode: string; lessonSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/${lessonSlug}`;
  return safeGenerateMetadata(
    async () => {
      const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, {
        pathname,
      });
      const viewerLessonLocale = await getMarketingLocaleForDefaultRoute();
      const lesson = pathway
        ? await loadPathwayLessonWithLegacySlugRedirect(pathway, lessonSlug, viewerLessonLocale)
        : undefined;
      if (!pathway || !lesson) return {};
      if (!pathwayLessonEligibleForPublicMarketingSurface(lesson)) {
        return { title: "Lesson", robots: { index: false, follow: false } };
      }
      const path = pathwayLessonPublicDetailPath(pathway, lesson.slug);
      if (!path) return {};
      const canonical = absoluteUrl(path);
      const keywords = [
        pathway.shortName,
        pathway.displayName,
        lesson.topic,
        lesson.bodySystem,
        "nurse practitioner",
        pathway.countrySlug === "canada" ? "Canada NP" : "NP exam",
        "clinical reasoning",
      ]
        .filter(Boolean)
        .join(", ");
      const strictPublic = process.env.PATHWAY_LESSON_STRICT_PUBLIC_QUALITY === "1";
      const gate = lesson.structuralQuality;
      const incomplete = !pathwayLessonEligibleForPublicMarketingSurface(lesson);
      const robots =
        incomplete && (strictPublic || gate?.structureMode === "premium")
          ? ({ index: false, follow: true } as const)
          : ({ index: true, follow: true } as const);
      return {
        title: lesson.seoTitle,
        description: lesson.seoDescription,
        keywords: keywords.split(", ").slice(0, 24),
        alternates: { canonical },
        openGraph: {
          title: lesson.seoTitle,
          description: lesson.seoDescription,
          url: canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: lesson.seoTitle,
          description:
            lesson.seoDescription.length > 160 ? `${lesson.seoDescription.slice(0, 157)}…` : lesson.seoDescription,
        },
        robots,
      };
    },
    { pathname, locale: countrySlug, routeGroup: "marketing.exam_hub.lesson_detail" },
  );
}

export default async function PathwayLessonDetailPage({ params }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/${lessonSlug}`;
  const pathway = resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();
  const lessonContentLocale = await getMarketingLocaleForDefaultRoute();

  const [lessonResult, sessionResult] = await Promise.allSettled([
    loadPathwayLessonWithLegacySlugRedirect(pathway, lessonSlug, lessonContentLocale),
    auth(),
  ]);
  const loadedLesson =
    lessonResult.status === "fulfilled" ? lessonResult.value : undefined;
  const lessonLoadFailed = lessonResult.status === "rejected";

  const session = sessionResult.status === "fulfilled" ? sessionResult.value : null;

  const userId = (session?.user as { id?: string })?.id ?? "";
  const studySettings = await loadStudySettings(userId);

  const [entRes, lpRes] = await Promise.allSettled([
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
  const entitlement = entRes.status === "fulfilled" ? entRes.value : "error";
  const learnerPathResolved = lpRes.status === "fulfilled" ? lpRes.value : null;

  const routeResolution = resolveMarketingPathwayLessonRouteResolution({
    pathway,
    lesson: loadedLesson,
    lessonLoadFailed,
    userId,
    entitlement,
    learnerPathResolved,
  });
  if (routeResolution.kind === "not_found") notFound();

  const { lesson, fullAccess, scope, entitlementError } = routeResolution;
  const examName = pathwayRegionAwareExamName(pathway);
  const bankAssessments = await resolvePathwayLessonBankAssessments(pathway, lesson);
  const adjacentSlugs = await loadPathwayLessonAdjacent(pathway.id, lesson.slug, lessonContentLocale);
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
  const contentDates = await getPathwayLessonContentDates(pathway.id, lesson.slug, lessonContentLocale);
  const jsonLdLessonPath = pathwayLessonPublicDetailPath(pathway, lesson.slug) ?? pathname;
  const quickReviewBullets = buildQuickReviewBullets(previewLesson);
  const matchedLessonImage = resolveLessonImage({
    slug: lesson.slug,
    title: lesson.title,
    topicSlug: lesson.topicSlug,
  });
  const requestedNorm = normalizePathwayLessonLocale(lessonContentLocale);
  const marketingUiLocale = await getMarketingLocaleForDefaultRoute();
  const { t } = await getLearnerMarketingBundle();
  const showLocaleFallbackNotice = Boolean(
    lesson.localeMeta &&
      (lesson.localeMeta.usedLocaleFallback ||
        (lesson.localeMeta.isCatalogEnglishSource && requestedNorm !== "en")),
  );

  const omitHighYieldIds = new Set(lesson.omitHighYieldSectionIds ?? []);
  const displaySections = visibleForRender
    .filter((s) => shouldRenderPathwayLessonSection(s.kind))
    .filter((s) => !omitHighYieldIds.has(s.id));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-1 pb-4 sm:px-6 sm:pt-2 sm:pb-5 lg:px-8">
      <div
        className={`nn-lesson-page-shell px-3 py-3 sm:px-6 sm:py-5${hasLessonSequence ? " pb-20 sm:pb-5" : ""}${pathway.examFamily === ExamFamily.NP ? " nn-lesson-page-shell--np" : ""}`}
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
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-4">
          <BreadcrumbTrail items={crumbs} />
        </div>
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
        {fullAccess && lessonHasExamTakeaways(lesson.studyTakeaways) ? (
          <div className="mt-4 max-w-5xl">
            <ExamTakeawaysBlock pathway={pathway} items={lesson.studyTakeaways} position="top" />
          </div>
        ) : null}
        <div className="mt-4 space-y-2">
          {fullAccess ? <PremiumLessonPublishNotice validation={lesson.premiumValidation} /> : null}
          {fullAccess ? <LessonQualityNotice tier={lessonQuality.tier} wordCount={lessonQuality.wordCount} /> : null}
          <PathwayLessonQuickReview quickReviewLines={quickReviewBullets} />
          <EeatContentAttribution variant="lesson" />
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
              />
            </>
          ) : (
            <PathwayLessonPreviewBanner
              kind={getPathwayLessonPreviewKind(scope, pathway, learnerPathResolved, userId)}
              pathwayShortName={pathway.shortName}
              pathwayCountryLabel={pathway.countryCode === "CA" ? "Canada" : "United States"}
            />
          )
        ) : null}

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
        >
          <LessonRecallProvider>
            <main className="mt-5 sm:mt-6">
              <div className="mx-auto mb-2 flex max-w-5xl justify-end px-0">
                <LessonRecallToggle />
              </div>
              <article className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
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
              {fullAccess && lesson.studyCommonTraps && lesson.studyCommonTraps.length > 0 ? (
                <div className="mx-auto mt-6 max-w-5xl">
                  <PathwayLessonCommonTrapsStrip items={lesson.studyCommonTraps} />
                </div>
              ) : null}
            </main>
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

          <PathwayLessonActions
            pathwayId={pathway.id}
            lessonSlug={lesson.slug}
            topicCode={lesson.topicSlug}
            topicLabel={lesson.topic}
            userId={userId}
            canMarkComplete={fullAccess}
            initialProgress={lessonProgress}
          />
        </PathwayLessonAssessmentExperience>

        <Suspense fallback={<PathwayLessonDetailDeferredSkeleton />}>
          <PathwayLessonDetailDeferred
            pathway={pathway}
            lesson={toPathwayLessonDeferredServerSnapshot(lesson)}
            lessonsBasePath={base}
            contentLocale={lessonContentLocale}
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
