import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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
import {
  defaultPathwayLessonContentLocaleForExamHubRoute,
  normalizePathwayLessonLocale,
} from "@/lib/lessons/pathway-lesson-locale";
import {
  getPathwayLesson,
  getRelatedPathwayLessons,
  RELATED_PATHWAY_LESSONS_LIMIT,
} from "@/lib/lessons/pathway-lesson-loader";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { alliedLessonDetailBreadcrumbs } from "@/lib/seo/allied-breadcrumbs";
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
import { LessonStructuralQualityNotice } from "@/components/lessons/lesson-structural-quality-notice";
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
import { PathwayLessonFigures } from "@/components/lessons/pathway-lesson-figures";

export const dynamic = "force-dynamic";
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

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
      const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
      const lesson = pathway ? await getPathwayLesson(pathway.id, lessonSlug, lessonContentLocale) : undefined;
      if (!prof || !pathway || !lesson) return {};
      if (!alliedLessonMatchesProfessionFilter(lesson, prof.topicSlugsIn)) return {};
      const path = alliedHealthLessonDetailPath(prof.professionKey, lesson.slug);
      const canonical = absoluteUrl(path);
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
        alternates: { canonical },
        openGraph: { title: lesson.seoTitle, description: lesson.seoDescription, url: canonical, type: "article" },
        robots,
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

  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const lesson = await getPathwayLesson(pathway.id, lessonSlug, lessonContentLocale);
  if (!lesson) notFound();
  if (!alliedLessonMatchesProfessionFilter(lesson, prof.topicSlugsIn)) notFound();

  const session = await auth();
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
      ? { hasAccess: false, reason: "no_access" as const, tier: null, country: null }
      : entitlement;

  const fullAccess = canViewFullPathwayLesson(scope, pathway, learnerPath);
  const lessonMeasurementSystem = getMeasurementSystemForCountry(pathway.countryCode);
  const visible = visibleSectionsForLesson(lesson, fullAccess);
  const lockedSections =
    !fullAccess && lesson.sections.length > visible.length ? lesson.sections.slice(visible.length) : [];

  const lessonProgress: PathwayLessonProgressStatus =
    userId && fullAccess
      ? await loadPathwayLessonProgressForSlug(userId, pathway.id, lesson.slug)
      : "not_started";

  const professionHeroPath = alliedHealthSegmentPath(prof.segment);
  const base = alliedHealthLessonsIndexPath(prof.professionKey);
  const lessonPath = alliedHealthLessonDetailPath(prof.professionKey, lesson.slug);

  let related: Awaited<ReturnType<typeof getRelatedPathwayLessons>> = [];
  try {
    const raw = await getRelatedPathwayLessons(pathway.id, lesson.topicSlug, lesson.slug, 8, lessonContentLocale);
    related = raw.filter(
      (r) =>
        pathwayLessonHasRenderableHubSlug(r) && alliedLessonMatchesProfessionFilter(r, prof.topicSlugsIn),
    );
  } catch {
    related = [];
  }
  const relatedDisplay = mergeRelatedLessonDisplayList(lesson.relatedLessonRefs, related, RELATED_PATHWAY_LESSONS_LIMIT);

  const relatedQuestionStems = await loadRelatedExamQuestionStemsForPathwayLesson({
    pathway,
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    lessonTopic: lesson.topic,
    lessonTopicSlug: lesson.topicSlug,
    bodySystem: lesson.bodySystem,
  });

  const { crumbs, schemaItems } = alliedLessonDetailBreadcrumbs(
    prof.h1,
    professionHeroPath,
    base,
    lesson.title,
    lessonPath,
  );
  const lessonQuality = classifyPathwayLesson(lesson);
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

  return (
    <div className="nn-marketing-surface mx-auto max-w-3xl px-4 py-12">
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
      <Link href={base} className="text-sm font-medium text-primary hover:underline">
        ← Lessons ({prof.h1})
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase text-primary">{pathway.displayName}</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-[var(--theme-heading-text)]">{lesson.title}</h1>
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
        {pathway.countryCode === "CA" ? "Canada" : "United States"} · {lesson.topic} · {lesson.bodySystem}
      </p>
      <div className="mt-4 space-y-3">
        <LessonQualityNotice tier={lessonQuality.tier} wordCount={lessonQuality.wordCount} />
        <LessonStructuralQualityNotice gate={lesson.structuralQuality} />
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
        <aside className="nn-study-card nn-study-card--wash mx-auto mt-8 overflow-hidden p-4 sm:p-5">
          <p className="nn-marketing-label">
            {matchedLessonImage.source === "topic_slug"
              ? "Topic illustration"
              : "Lesson illustration"}
          </p>
          <div className="mt-3">
            <PathwayLessonFigures
              figures={[
                {
                  id: "lesson-matched-media",
                  url: matchedLessonImage.url,
                  alt: matchedLessonImage.alt,
                  kind: "clinical_reference",
                },
              ]}
            />
          </div>
        </aside>
      ) : null}

      <PathwayLessonAssessmentExperience
        userId={userId}
        pathwayId={pathway.id}
        lessonSlug={lesson.slug}
        initialProgress={lessonProgress}
        preTest={lesson.preTest}
        postTest={lesson.postTest}
        fullAccess={fullAccess}
      >
        <article className="mt-8 space-y-5">
          {visible.map((section) => (
            <LessonSectionCard
              key={section.id}
              id={section.id}
              heading={section.heading}
              kind={section.kind}
            >
              <PathwayLessonBody
                text={typeof section.body === "string" ? section.body : ""}
                lessonWikiBasePath={base}
                measurementSystem={lessonMeasurementSystem}
              />
            </LessonSectionCard>
          ))}
        </article>

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
    </div>
  );
}
