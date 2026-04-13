import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Layers } from "lucide-react";
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
  canViewFullPathwayLesson,
  getPathwayLessonPreviewKind,
  visibleSectionsForLesson,
} from "@/lib/lessons/pathway-lesson-access";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import { loadPathwayLessonWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { pathwayLessonDetailBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
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

/** Avoid enumerating every lesson at build (large `.next` output + ENOSPC on small disks). */
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;
/** Room for lesson body + related queries on cold DB under traffic spikes (Vercel Fluid / Node). */
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
      if (!lesson.structuralQuality?.publicComplete) {
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
      const incomplete = Boolean(gate && !gate.publicComplete);
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
  const lesson =
    lessonResult.status === "fulfilled" ? lessonResult.value : undefined;
  if (!lesson) notFound();
  if (!lesson.structuralQuality?.publicComplete) notFound();
  const examName = pathwayRegionAwareExamName(pathway);

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

  const scope =
    entitlement === "error"
      ? { hasAccess: false, reason: "no_access" as const, tier: null, country: null, alliedCareer: null }
      : entitlement;

  const fullAccess = canViewFullPathwayLesson(scope, pathway, learnerPathResolved);
  const visible = visibleSectionsForLesson(lesson, fullAccess);

  const lessonContentTier = contentTierForPathwayLessonRender(
    pathway,
    entitlement === "error" ? null : (entitlement.tier as TierCode | null),
  );
  const lessonMeasurementSystem = getMeasurementSystemForCountry(pathway.countryCode);

  const base = marketingPathwayLessonsIndexPath(pathway);

  const lessonProgress =
    userId && fullAccess
      ? await loadPathwayLessonProgressForSlug(userId, pathway.id, lesson.slug)
      : ("not_started" satisfies PathwayLessonProgressStatus);

  // Strip body before passing locked sections to any downstream component — only headings are needed for the
  // teaser. This prevents accidental body serialization if the preview component ever becomes a Client Component.
  const lockedSections =
    !fullAccess && lesson.sections.length > visible.length
      ? lesson.sections.slice(visible.length).map(({ id, heading }) => ({ id, heading }))
      : [];
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(pathway, lesson.slug, lesson.title);
  const lessonQuality = classifyPathwayLesson(lesson);
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div
        className={`nn-lesson-page-shell px-4 py-9 sm:px-8 sm:py-11${pathway.examFamily === ExamFamily.NP ? " nn-lesson-page-shell--np" : ""}`}
      >
        <MarketingPathwayLessonDetailViewBeacon
          pathway={pathway}
          lessonSlug={lesson.slug}
          topicSlug={lesson.topicSlug}
          topicLabel={lesson.topic}
          marketingLocale={marketingUiLocale}
        />
        <BreadcrumbJsonLd items={schemaItems} />
        <div className="mb-6">
          <BreadcrumbTrail items={crumbs} />
        </div>
        <PathwayLessonProgressTracker
          pathwayId={pathway.id}
          lessonSlug={lesson.slug}
          enabled={Boolean(userId) && fullAccess}
          initialProgress={lessonProgress}
        />
        <PathwayLessonDetailHeader
          pathway={pathway}
          lessonsBasePath={base}
          lessonTitle={lesson.title}
          lessonTopic={lesson.topic}
          bodySystem={lesson.bodySystem}
          metaChips={<PathwayLessonRecordChips lesson={lesson} omitTopic />}
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
        <div className="mt-6 space-y-3">
          <PremiumLessonPublishNotice validation={lesson.premiumValidation} />
          <LessonQualityNotice tier={lessonQuality.tier} wordCount={lessonQuality.wordCount} />
          <PathwayLessonQuickReview bullets={buildQuickReviewBullets(lesson)} />
        </div>
        {showLocaleFallbackNotice ? (
          <aside
            className="nn-card mt-4 border-border bg-[var(--theme-muted-surface)] p-3 text-sm text-muted"
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
          entitlement === "error" ? (
            <>
              <aside className="nn-card mt-6 border-amber-200 bg-amber-50 p-4 text-sm text-[var(--theme-body-text)] dark:border-amber-900/40 dark:bg-amber-950/30">
                <p className="font-semibold">Access check didn’t complete</p>
                <p className="mt-1 text-muted">
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
            lessonTitle={lesson.title}
          />
        ) : null}

        {lesson.audioUrl ? (
          <LessonAudioCard audioUrl={lesson.audioUrl} lessonTitle={lesson.title} />
        ) : null}

        <PathwayLessonAssessmentExperience
          userId={userId}
          pathwayId={pathway.id}
          lessonSlug={lesson.slug}
          initialProgress={lessonProgress}
          preTest={fullAccess ? lesson.preTest : undefined}
          postTest={fullAccess ? lesson.postTest : undefined}
          fullAccess={fullAccess}
          assessmentsEnabled={studySettings.enablePrePostQuizzes}
        >
          <LessonRecallProvider>
            <main className="mt-8">
              <div className="mx-auto mb-3 flex max-w-[44rem] justify-end">
                <LessonRecallToggle />
              </div>
              <article className="mx-auto max-w-[44rem] space-y-8">
                {visible.map((section) => (
                  <LessonSectionCard
                    key={section.id}
                    id={section.id}
                    heading={section.heading}
                    kind={section.kind}
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
                ))}
              </article>
            </main>
          </LessonRecallProvider>

          {lockedSections.length > 0 ? (
            <div className="mx-auto mt-6 max-w-[44rem]">
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
            lesson={lesson}
            lessonsBasePath={base}
            contentLocale={lessonContentLocale}
          />
        </Suspense>

        {/* Flashcard cross-link — always shown; links to topic-scoped flashcard page when topic exists */}
        {lesson.topicSlug ? (
          <aside
            className="mx-auto mt-10 max-w-[44rem] rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] px-5 py-4"
            aria-label="Flashcard study suggestion"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]" aria-hidden>
                <Layers className="h-4 w-4 text-[var(--semantic-brand)]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
                  Study {lesson.topic ? `${lesson.topic} ` : ""}with flashcards
                </p>
                <p className="mt-0.5 text-sm leading-6 text-[var(--theme-muted-text)]">
                  Reinforce what you just read with active recall. Review key terms, lab values, medications, and nursing interventions for this topic.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Link
                    href={`/flashcards/${lesson.topicSlug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--semantic-brand)] hover:underline focus-visible:outline-none focus-visible:underline"
                  >
                    Open {lesson.topic ? `${lesson.topic} ` : ""}decks →
                  </Link>
                  <Link
                    href="/flashcards"
                    className="text-sm text-[var(--theme-muted-text)] hover:text-[var(--theme-heading-text)] hover:underline focus-visible:outline-none focus-visible:underline"
                  >
                    Browse all flashcards
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        ) : null}

        <p className="mt-10 text-center text-xs text-[var(--theme-muted-text)]">
          <Link href="/blog" className="font-medium text-primary hover:underline">
            Clinical blog
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
      </div>
    </div>
  );
}
