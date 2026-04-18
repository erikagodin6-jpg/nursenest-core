import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PathwayLessonBody } from "@/components/lessons/pathway-lesson-body";
import { LessonSectionCard } from "@/components/lessons/lesson-section-card";
import { PathwayLessonLockedSectionsPreview } from "@/components/lessons/pathway-lesson-locked-sections-preview";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { PathwayLessonPreviewBanner } from "@/components/lessons/pathway-lesson-preview-banner";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { alliedLessonMatchesProfessionFilter } from "@/lib/allied/allied-lesson-access";
import {
  getAlliedProfessionByHeroSegment,
  getAlliedProfessionByProfessionKey,
  getPathwayOrThrow,
  isAlliedHeroExamPrepSlug,
} from "@/lib/allied/allied-professions-registry";
import {
  canViewFullPathwayLesson,
  getPathwayLessonPreviewKind,
  visibleSectionsForLesson,
} from "@/lib/lessons/pathway-lesson-access";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import {
  getPathwayLesson,
  getPathwayLessonSeoMeta,
  getRelatedPathwayLessons,
  RELATED_PATHWAY_LESSONS_LIMIT,
} from "@/lib/lessons/pathway-lesson-loader";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { EeatContentAttribution } from "@/components/seo/eeat-content-attribution";
import { PathwayLessonMedicalEducationJsonLd } from "@/components/seo/seo-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { alliedLessonDetailBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
import { getPathwayLessonContentDates } from "@/lib/seo/pathway-lesson-content-dates";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { LessonQualityNotice } from "@/components/lessons/lesson-quality-notice";
import { PathwayLessonQuickReview } from "@/components/lessons/pathway-lesson-quick-review";
import { classifyPathwayLesson } from "@/lib/content-quality/classify-lesson";
import { buildQuickReviewBullets } from "@/lib/lessons/pathway-lesson-quick-review";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import {
  alliedHealthLessonDetailPath,
  alliedHealthLessonsIndexPath,
  alliedHealthSegmentPath,
} from "@/lib/lessons/lesson-routes";
import {
  mergeRelatedLessonDisplayList,
  pathwayLessonHasRenderableHubSlug,
} from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonProgressBadgeLive } from "@/components/lessons/pathway-lesson-progress-badge-live";
import { PathwayLessonProgressTracker } from "@/components/lessons/pathway-lesson-progress-tracker";
import {
  loadPathwayLessonProgressForSlug,
  type PathwayLessonProgressStatus,
} from "@/lib/lessons/pathway-lesson-progress";
import { PathwayLessonAssessmentExperience } from "@/components/lessons/pathway-lesson-assessment-experience";
import { loadRelatedExamQuestionStemsForPathwayLesson } from "@/lib/lessons/lesson-question-cross-links";
import { PathwayLessonRelatedQuestions } from "@/components/lessons/pathway-lesson-related-questions";
import { PathwayLessonStudyLoopCta } from "@/components/lessons/pathway-lesson-study-loop-cta";
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { resolveLessonImage } from "@/lib/content/resolve-lesson-image";
import { LessonClinicalImageCard } from "@/components/lessons/lesson-clinical-image-card";
import { LessonAudioCard } from "@/components/lessons/lesson-audio-card";
import { LessonSectionAudioButton } from "@/components/lessons/lesson-section-audio-button";
import { LessonCheckpointCard } from "@/components/lessons/lesson-checkpoint-card";
import { LessonRecallProvider } from "@/components/lessons/lesson-recall-context";
import { LessonRecallToggle } from "@/components/lessons/lesson-recall-toggle";
import { LessonRecallBlock } from "@/components/lessons/lesson-recall-block";
import { LessonKeyRecallChip } from "@/components/lessons/lesson-key-recall-chip";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { DEFAULT_STUDY_SETTINGS } from "@/lib/learner/study-settings";
import { cleanLessonTitleForDisplay, compactPathwayLabel } from "@/lib/lessons/lesson-title-presentation";
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

export const dynamic = "force-dynamic";
export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string; lessonSlug: string }> };

function resolveProfession(slug: string) {
  if (isAlliedHeroExamPrepSlug(slug)) {
    const byHero = getAlliedProfessionByHeroSegment(slug);
    return byHero ? { prof: byHero, mode: "hero" as const } : null;
  }
  const byKey = getAlliedProfessionByProfessionKey(slug);
  return byKey ? { prof: byKey, mode: "key" as const } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  return safeGenerateMetadata(
    async () => {
      const resolved = resolveProfession(slug);
      const prof = resolved?.prof;
      const pathway = prof ? getPathwayOrThrow(prof.pathwayId) : undefined;
      const lesson = pathway ? await getPathwayLessonSeoMeta(pathway.id, lessonSlug) : undefined;
      if (!prof || !pathway || !lesson) return {};
      if (!prof.topicSlugsIn.includes(lesson.topicSlug)) return {};
      if (!lesson.publicComplete) {
        return { title: "Lesson", robots: { index: false, follow: false } };
      }
      const path = alliedHealthLessonDetailPath(prof.professionKey, lesson.slug);
      const canonical = absoluteUrl(path);
      return {
        title: lesson.seoTitle,
        description: lesson.seoDescription,
        alternates: { canonical },
        openGraph: { title: lesson.seoTitle, description: lesson.seoDescription, url: canonical, type: "article" },
        robots: { index: true, follow: true },
      };
    },
    { pathname: `/allied-health/${slug}/lessons/${lessonSlug}`, routeGroup: "marketing.default.allied_health.lesson" },
  );
}

export default async function AlliedHealthSlugLessonDetailPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const resolved = resolveProfession(slug);
  if (!resolved) notFound();
  const { prof, mode } = resolved;

  if (mode === "hero") {
    redirect(alliedHealthLessonDetailPath(prof.professionKey, lessonSlug));
  }

  const pathway = getPathwayOrThrow(prof.pathwayId);
  if (!pathway) notFound();

  const lessonContentLocale = DEFAULT_MARKETING_LOCALE;
  const lesson = await getPathwayLesson(pathway.id, lessonSlug, lessonContentLocale);
  if (!lesson) notFound();
  if (!lesson.structuralQuality?.publicComplete) notFound();
  if (!alliedLessonMatchesProfessionFilter(lesson, prof.topicSlugsIn)) notFound();

  const userId = "";
  const [entitlementRes, studySettingsRes, learnerPathRes] = await Promise.allSettled([
    resolveEntitlementForPage(userId),
    loadStudySettings(userId),
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
  const entitlement = entitlementRes.status === "fulfilled" ? entitlementRes.value : "error";
  const studySettings = studySettingsRes.status === "fulfilled" ? studySettingsRes.value : DEFAULT_STUDY_SETTINGS;
  const learnerPath = learnerPathRes.status === "fulfilled" ? learnerPathRes.value : null;

  const scope =
    entitlement === "error"
      ? { hasAccess: false, reason: "no_access" as const, tier: null, country: null, alliedCareer: null }
      : entitlement;

  const fullAccess = canViewFullPathwayLesson(scope, pathway, learnerPath);
  const [bankAssessmentsRes, adjacentSlugsRes, relatedQuestionStemsRes, contentDatesRes] = await Promise.allSettled([
    resolvePathwayLessonBankAssessments(pathway, lesson),
    loadPathwayLessonAdjacent(pathway.id, lesson.slug, lessonContentLocale),
    loadRelatedExamQuestionStemsForPathwayLesson({
      pathway,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      lessonTopic: lesson.topic,
      lessonTopicSlug: lesson.topicSlug,
      bodySystem: lesson.bodySystem,
    }),
    getPathwayLessonContentDates(pathway.id, lesson.slug, lessonContentLocale),
  ]);
  const bankAssessments = bankAssessmentsRes.status === "fulfilled" ? bankAssessmentsRes.value : [];
  const lessonMeasurementSystem = getMeasurementSystemForCountry(pathway.countryCode);
  const visible = visibleSectionsForLesson(lesson, fullAccess);
  const previewLesson = fullAccess ? lesson : { ...lesson, sections: visible, preTest: undefined, postTest: undefined };
  const lockedSections =
    !fullAccess && lesson.sections.length > visible.length
      ? lesson.sections
          .slice(visible.length)
          .filter((s) => shouldRenderPathwayLessonSection(s.kind))
          .map(({ id, heading }) => ({ id, heading }))
      : [];

  const lessonProgress: PathwayLessonProgressStatus =
    userId && fullAccess
      ? await loadPathwayLessonProgressForSlug(userId, pathway.id, lesson.slug)
      : "not_started";

  const professionHeroPath = alliedHealthSegmentPath(prof.segment);
  const base = alliedHealthLessonsIndexPath(prof.professionKey);
  const lessonPath = alliedHealthLessonDetailPath(prof.professionKey, lesson.slug);
  const adjacentSlugs = adjacentSlugsRes.status === "fulfilled" ? adjacentSlugsRes.value : { prev: null, next: null };
  const lessonAdjacentHrefs = mapPathwayLessonAdjacentToHrefs(adjacentSlugs, (slug) =>
    alliedHealthLessonDetailPath(prof.professionKey, slug),
  );
  const hasLessonSequence = Boolean(lessonAdjacentHrefs.prev || lessonAdjacentHrefs.next);

  let related: Awaited<ReturnType<typeof getRelatedPathwayLessons>> = [];
  try {
    const raw = await getRelatedPathwayLessons(
      pathway.id,
      lesson.topicSlug,
      lesson.slug,
      8,
      lessonContentLocale,
      lesson.bodySystem,
    );
    related = raw.filter(
      (r) =>
        pathwayLessonHasRenderableHubSlug(r) && alliedLessonMatchesProfessionFilter(r, prof.topicSlugsIn),
    );
  } catch {
    related = [];
  }
  const relatedDisplay = mergeRelatedLessonDisplayList(lesson.relatedLessonRefs, related, RELATED_PATHWAY_LESSONS_LIMIT);
  const displayLessonTitle = cleanLessonTitleForDisplay(lesson.title);
  const compactExamLabel = compactPathwayLabel(pathway.shortName);

  const relatedQuestionStems = relatedQuestionStemsRes.status === "fulfilled" ? relatedQuestionStemsRes.value : [];

  const { crumbs, schemaItems } = alliedLessonDetailBreadcrumbs(
    prof.h1,
    professionHeroPath,
    base,
    displayLessonTitle,
    lessonPath,
  );
  const lessonQuality = classifyPathwayLesson(lesson);
  const contentDates = contentDatesRes.status === "fulfilled" ? contentDatesRes.value : null;
  const quickReviewBullets = buildQuickReviewBullets(previewLesson);
  const matchedLessonImage = resolveLessonImage({
    slug: lesson.slug,
    title: lesson.title,
    topicSlug: lesson.topicSlug,
  });
  const requestedNorm = normalizePathwayLessonLocale(lessonContentLocale);
  const showLocaleFallbackNotice = Boolean(
    lesson.localeMeta &&
      (lesson.localeMeta.usedLocaleFallback ||
        (lesson.localeMeta.isCatalogEnglishSource && requestedNorm !== "en")),
  );

  const omitHighYieldIds = new Set(lesson.omitHighYieldSectionIds ?? []);
  const displaySections = visible
    .filter((s) => shouldRenderPathwayLessonSection(s.kind))
    .filter((s) => !omitHighYieldIds.has(s.id));

  return (
    <div
      className={`nn-marketing-surface mx-auto max-w-5xl px-4 py-5 sm:py-7${hasLessonSequence ? " pb-20 sm:pb-7" : ""}`}
    >
      <PathwayLessonMedicalEducationJsonLd
        path={lessonPath}
        headline={lesson.seoTitle}
        description={lesson.seoDescription.slice(0, 320)}
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
      <Link href={base} className="text-sm font-medium text-primary hover:underline">
        ← Lessons ({prof.h1})
      </Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="nn-lesson-page-title max-w-[min(100%,52rem)]">{displayLessonTitle}</h1>
        {userId && fullAccess ? (
          <PathwayLessonProgressBadgeLive
            pathwayId={pathway.id}
            lessonSlug={lesson.slug}
            initial={lessonProgress}
            className="shrink-0"
          />
        ) : null}
      </div>
      <p className="mt-2 text-sm text-muted">
        {compactExamLabel} · {pathway.countryCode === "CA" ? "Canada" : "United States"} · {lesson.bodySystem}
      </p>
      {lessonHasExamTakeaways(lesson.studyTakeaways) ? (
        <div className="mt-4">
          <ExamTakeawaysBlock
            pathway={pathway}
            items={lesson.studyTakeaways}
            position="top"
            alliedProfessionLabel={prof.h1}
          />
        </div>
      ) : null}
      <div className="mt-4 space-y-2">
        <LessonQualityNotice tier={lessonQuality.tier} wordCount={lessonQuality.wordCount} />
        <PathwayLessonQuickReview quickReviewLines={quickReviewBullets} />
        <EeatContentAttribution variant="lesson" />
      </div>
      {lesson.memoryAnchor ? (
        <div className="mt-4">
          <PathwayLessonMemoryAnchorStrip text={lesson.memoryAnchor} />
        </div>
      ) : null}
      {showLocaleFallbackNotice ? (
        <aside
          className="nn-card mt-4 border-border bg-[var(--theme-muted-surface)] p-3 text-sm text-muted"
          data-testid="aside-pathway-lesson-locale-en"
        >
          {lesson.localeMeta?.isCatalogEnglishSource ? (
            <>
              This lesson body is <span className="font-medium text-foreground">English</span> (bundled catalog or seed
              data).
            </>
          ) : lesson.localeMeta?.usedLocaleFallback ? (
            <>
              Showing the <span className="font-medium text-foreground">{lesson.localeMeta.contentLocale}</span> version.
            </>
          ) : null}
        </aside>
      ) : null}

      {!fullAccess ? (
        entitlement === "error" ? (
          <>
            <aside className="nn-card mt-6 border-amber-200 bg-amber-50 p-4 text-sm text-[var(--theme-body-text)] dark:border-amber-900/40 dark:bg-amber-950/30">
              <p className="font-semibold">Access check didn’t complete</p>
              <p className="mt-1 text-muted">Refresh shortly. Previews below remain available.</p>
            </aside>
            <PathwayLessonPreviewBanner
              kind="default_preview"
              pathwayShortName={pathway.shortName}
              pathwayCountryLabel={pathway.countryCode === "CA" ? "Canada" : "United States"}
            />
          </>
        ) : (
          <PathwayLessonPreviewBanner
            kind={getPathwayLessonPreviewKind(scope, pathway, learnerPath, userId)}
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

      {lesson.audioUrl ? (
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
          <div className="mb-2 flex justify-end">
            <LessonRecallToggle />
          </div>
          <article className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
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
                <PathwayLessonBody
                  text={typeof section.body === "string" ? section.body : ""}
                  lessonWikiBasePath={base}
                  measurementSystem={lessonMeasurementSystem}
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
          {lesson.studyCommonTraps && lesson.studyCommonTraps.length > 0 ? (
            <div className="mx-auto mt-6 max-w-5xl">
              <PathwayLessonCommonTrapsStrip items={lesson.studyCommonTraps} />
            </div>
          ) : null}
          {lessonHasExamTakeaways(lesson.studyTakeaways) ? (
            <div className="mx-auto mt-6 max-w-5xl">
              <ExamTakeawaysBlock
                pathway={pathway}
                items={lesson.studyTakeaways}
                position="bottom"
                alliedProfessionLabel={prof.h1}
              />
            </div>
          ) : null}
        </LessonRecallProvider>

        {lockedSections.length > 0 ? <PathwayLessonLockedSectionsPreview sections={lockedSections} /> : null}

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

      <p className="mt-6 text-sm text-muted">
        Also see:{" "}
        <Link href="/blog" className="font-medium text-primary hover:underline">
          clinical blog
        </Link>{" "}
        and{" "}
        <Link href="/allied-health" className="font-medium text-primary hover:underline">
          allied hub
        </Link>
        .
      </p>

      <PathwayLessonRelatedQuestions
        pathway={pathway}
        lessonTopic={lesson.topic}
        topicSlug={lesson.topicSlug}
        items={relatedQuestionStems}
      />

      <PathwayLessonStudyLoopCta
        pathway={pathway}
        lessonsBasePath={base}
        topicLabel={lesson.topic}
        topicSlug={lesson.topicSlug}
        relatedLessons={relatedDisplay}
        currentSlug={lesson.slug}
      />

      <div className="mt-10 text-sm text-muted">
        <Link href={buildExamPathwayPath(pathway)} className="font-medium text-primary">
          Exam hub
        </Link>
        {" · "}
        <Link href={professionHeroPath} className="font-medium text-primary">
          Profession overview
        </Link>
      </div>

      <MarketingStudyCrossLinks className="mt-12" />
      {hasLessonSequence ? <PathwayLessonStickySequenceNav adjacent={lessonAdjacentHrefs} /> : null}
    </div>
  );
}
