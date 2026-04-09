import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { PathwayLessonSectionContent } from "@/components/lessons/pathway-lesson-body";
import { PathwayLessonRelatedLearningBlock } from "@/components/lessons/pathway-lesson-related-learning";
import { PathwayLessonRelatedQuestions } from "@/components/lessons/pathway-lesson-related-questions";
import { PremiumLessonPublishNotice } from "@/components/lessons/premium-lesson-publish-notice";
import { PathwayLessonQuizzes } from "@/components/lessons/pathway-lesson-quizzes";
import { PathwayLessonLockedSectionsPreview } from "@/components/lessons/pathway-lesson-locked-sections-preview";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { PathwayLessonProgressBadgeLive } from "@/components/lessons/pathway-lesson-progress-badge-live";
import { PathwayLessonProgressTracker } from "@/components/lessons/pathway-lesson-progress-tracker";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath, resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import { PathwayLessonPreviewBanner } from "@/components/lessons/pathway-lesson-preview-banner";
import {
  canViewFullPathwayLesson,
  getPathwayLessonPreviewKind,
  visibleSectionsForLesson,
} from "@/lib/lessons/pathway-lesson-access";
import {
  defaultPathwayLessonContentLocaleForExamHubRoute,
  normalizePathwayLessonLocale,
} from "@/lib/lessons/pathway-lesson-locale";
import { getRelatedPathwayLessons, RELATED_PATHWAY_LESSONS_LIMIT } from "@/lib/lessons/pathway-lesson-loader";
import { loadPathwayLessonWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { pathwayLessonDetailBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { LessonQualityNotice } from "@/components/lessons/lesson-quality-notice";
import { PathwayLessonQuickReview } from "@/components/lessons/pathway-lesson-quick-review";
import { classifyPathwayLesson } from "@/lib/content-quality/classify-lesson";
import { buildQuickReviewBullets } from "@/lib/lessons/pathway-lesson-quick-review";
import { matchConceptImage } from "@/lib/education-images/match-concept-image";
import { PathwayLessonFigures } from "@/components/lessons/pathway-lesson-figures";
import { mergeRelatedLessonDisplayList, pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import {
  loadPathwayLessonProgressForSlug,
  type PathwayLessonProgressStatus,
} from "@/lib/lessons/pathway-lesson-progress";
import { loadRelatedExamQuestionStemsForPathwayLesson } from "@/lib/lessons/lesson-question-cross-links";
import { LessonStructuralQualityNotice } from "@/components/lessons/lesson-structural-quality-notice";

/** Avoid enumerating every lesson at build (large `.next` output + ENOSPC on small disks). */
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = {
  /** `locale` is pathway countrySlug (`us` / `canada`), not BCP-47 lesson content. */
  params: Promise<{ locale: string; slug: string; examCode: string; lessonSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug } = await params;
  const pathway = resolveExamPathwayFromMarketingHubSegment(countrySlug, roleTrack, examCode);
  const contentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const lesson = pathway ? await loadPathwayLessonWithLegacySlugRedirect(pathway, lessonSlug, contentLocale) : undefined;
  if (!pathway || !lesson) return {};
  const path = buildExamPathwayPath(pathway, `lessons/${lesson.slug}`);
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
      description: lesson.seoDescription.length > 160 ? `${lesson.seoDescription.slice(0, 157)}…` : lesson.seoDescription,
    },
    robots,
  };
}

export default async function PathwayLessonDetailPage({ params }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug } = await params;
  const pathway = resolveExamPathwayFromMarketingHubSegment(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();

  const [lesson, session] = await Promise.all([
    loadPathwayLessonWithLegacySlugRedirect(pathway, lessonSlug, lessonContentLocale),
    auth(),
  ]);
  if (!lesson) notFound();

  const userId = (session?.user as { id?: string })?.id ?? "";

  const [entitlement, learnerPath] = await Promise.all([
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

  const scope =
    entitlement === "error"
      ? { hasAccess: false, reason: "no_access" as const, tier: null, country: null }
      : entitlement;

  const fullAccess = canViewFullPathwayLesson(scope, pathway, learnerPath);
  const visible = visibleSectionsForLesson(lesson, fullAccess);

  const hubBase = `/${countrySlug}/${roleTrack}/${examCode}`;
  const base = `${hubBase}/lessons`;

  const [lessonProgress, relatedRaw, relatedQuestionStems] = await Promise.all([
    userId && fullAccess
      ? loadPathwayLessonProgressForSlug(userId, pathway.id, lesson.slug)
      : Promise.resolve<PathwayLessonProgressStatus>("not_started"),
    getRelatedPathwayLessons(pathway.id, lesson.topicSlug, lesson.slug, undefined, lessonContentLocale),
    loadRelatedExamQuestionStemsForPathwayLesson({
      pathway,
      lessonTitle: lesson.title,
      lessonTopic: lesson.topic,
      lessonTopicSlug: lesson.topicSlug,
      bodySystem: lesson.bodySystem,
    }),
  ]);

  const lockedSections =
    !fullAccess && lesson.sections.length > visible.length ? lesson.sections.slice(visible.length) : [];
  const relatedTopicRows = relatedRaw.filter(pathwayLessonHasRenderableHubSlug);
  const relatedDisplay = mergeRelatedLessonDisplayList(lesson.relatedLessonRefs, relatedTopicRows, RELATED_PATHWAY_LESSONS_LIMIT);
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(pathway, lesson.slug, lesson.title);
  const lessonQuality = classifyPathwayLesson(lesson);
  const matchedLessonImage = matchConceptImage({
    title: lesson.title,
    slug: lesson.slug,
    topic: lesson.topic,
    bodySystem: lesson.bodySystem,
  });
  const requestedNorm = normalizePathwayLessonLocale(lessonContentLocale);
  const showLocaleFallbackNotice = Boolean(
    lesson.localeMeta &&
      (lesson.localeMeta.usedLocaleFallback ||
        (lesson.localeMeta.isCatalogEnglishSource && requestedNorm !== "en")),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
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
        ← Lessons ({pathway.shortName})
      </Link>
      <header className="nn-study-card nn-study-card--wash mt-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <span>{lesson.topic}</span>
          <span aria-hidden className="text-[var(--theme-muted-text)]">
            ·
          </span>
          <span>{pathway.displayName}</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <h1 className="nn-marketing-h2 text-[var(--theme-heading-text)]">{lesson.title}</h1>
          {userId && fullAccess ? (
            <PathwayLessonProgressBadgeLive
              pathwayId={pathway.id}
              lessonSlug={lesson.slug}
              initial={lessonProgress}
              className="shrink-0"
            />
          ) : null}
        </div>
        <p className="nn-marketing-body-sm mt-3 text-[var(--theme-muted-text)]">
          {pathway.countrySlug === "canada" ? "Canada" : "United States"} · {pathway.shortName} · {lesson.bodySystem}
        </p>
        <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
          Written for {pathway.shortName} judgment—not a generic overview. When you finish, use the practice strip below to answer
          items in the same clinical scope while prioritization is still in your head.
        </p>
      </header>
      <div className="mt-4 space-y-3">
        <PremiumLessonPublishNotice validation={lesson.premiumValidation} />
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
            kind={getPathwayLessonPreviewKind(scope, pathway, learnerPath, userId)}
            pathwayShortName={pathway.shortName}
            pathwayCountryLabel={pathway.countryCode === "CA" ? "Canada" : "United States"}
          />
        )
      ) : null}

      {matchedLessonImage.url ? (
        <aside className="mt-8 overflow-hidden rounded-2xl border border-border bg-[var(--theme-muted-surface)]/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Concept illustration</p>
          <div className="mt-3">
            <PathwayLessonFigures
              figures={[
                {
                  id: "lesson-matched-media",
                  url: matchedLessonImage.url,
                  alt: matchedLessonImage.alt,
                  caption: "Matched from NurseNest media library using lesson title and topic.",
                  kind: "clinical_reference",
                },
              ]}
            />
          </div>
        </aside>
      ) : null}

      <article className="mt-10 space-y-5">
        {visible.map((section, idx) => (
          <section
            key={section.id}
            className={`nn-lesson-article-section ${idx % 2 === 1 ? "nn-lesson-article-section--alt" : ""}`}
          >
            <h2 className="text-xl font-semibold tracking-tight text-[var(--theme-heading-text)]">
              {section.heading?.trim() || "Section"}
            </h2>
            <div className="mt-4">
              <PathwayLessonSectionContent
                text={typeof section.body === "string" ? section.body : ""}
                figures={section.figures}
                lessonWikiBasePath={base}
              />
            </div>
          </section>
        ))}
      </article>

      <PathwayLessonQuizzes preTest={lesson.preTest} postTest={lesson.postTest} fullAccess={fullAccess} />

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

      <PathwayLessonRelatedLearningBlock
        pathway={pathway}
        topic={lesson.topic}
        topicSlug={lesson.topicSlug}
        lessonsBasePath={base}
        relatedLessons={relatedDisplay}
        currentSlug={lesson.slug}
      />

      <PathwayLessonRelatedQuestions pathway={pathway} lessonTopic={lesson.topic} items={relatedQuestionStems} />

      <p className="mt-8 text-sm text-muted">
        More resources:{" "}
        <Link href="/blog" className="font-medium text-primary hover:underline">
          clinical blog
        </Link>
        {" · "}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          tools
        </Link>
        {" · "}
        <Link href="/lessons" className="font-medium text-primary hover:underline">
          all lesson hubs
        </Link>
        .
      </p>

      <div className="mt-6 text-sm text-muted">
        <Link href={buildExamPathwayPath(pathway)} className="font-medium text-primary hover:underline">
          {pathway.shortName} exam hub
        </Link>
      </div>

      <MarketingStudyCrossLinks className="mt-12" />
    </div>
  );
}
