import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PathwayLessonBody } from "@/components/lessons/pathway-lesson-body";
import { PathwayLessonQuizzes } from "@/components/lessons/pathway-lesson-quizzes";
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
import { getPathwayLesson, getRelatedPathwayLessons } from "@/lib/lessons/pathway-lesson-loader";
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
  const resolved = resolveProfession(slug);
  const prof = resolved?.prof;
  const pathway = prof ? getPathwayOrThrow(prof.pathwayId) : undefined;
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const lesson = pathway ? await getPathwayLesson(pathway.id, lessonSlug, lessonContentLocale) : undefined;
  if (!prof || !pathway || !lesson) return {};
  if (!alliedLessonMatchesProfessionFilter(lesson, prof.topicSlugsIn)) return {};
  const path = `/allied-health/${prof.professionKey}/lessons/${lesson.slug}`;
  const canonical = absoluteUrl(path);
  return {
    title: lesson.seoTitle,
    description: lesson.seoDescription,
    alternates: { canonical },
    openGraph: { title: lesson.seoTitle, description: lesson.seoDescription, url: canonical, type: "article" },
  };
}

export default async function AlliedHealthSlugLessonDetailPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const resolved = resolveProfession(slug);
  if (!resolved) notFound();
  const { prof, mode } = resolved;

  if (mode === "hero") {
    redirect(`/allied-health/${prof.professionKey}/lessons/${encodeURIComponent(lessonSlug)}`);
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
  const visible = visibleSectionsForLesson(lesson, fullAccess);
  const lockedSections =
    !fullAccess && lesson.sections.length > visible.length ? lesson.sections.slice(visible.length) : [];

  const professionHeroPath = `/allied-health/${prof.segment}`;
  const base = `/allied-health/${prof.professionKey}/lessons`;
  const lessonPath = `${base}/${lesson.slug}`;

  let related: Awaited<ReturnType<typeof getRelatedPathwayLessons>> = [];
  try {
    const raw = await getRelatedPathwayLessons(pathway.id, lesson.topicSlug, lesson.slug, 8, lessonContentLocale);
    related = raw.filter((r) => alliedLessonMatchesProfessionFilter(r, prof.topicSlugsIn));
  } catch {
    related = [];
  }

  const { crumbs, schemaItems } = alliedLessonDetailBreadcrumbs(
    prof.h1,
    professionHeroPath,
    base,
    lesson.title,
    lessonPath,
  );
  const lessonQuality = classifyPathwayLesson(lesson);
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
      <Link href={base} className="text-sm font-medium text-primary hover:underline">
        ← Lessons ({prof.h1})
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase text-primary">{pathway.displayName}</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[var(--theme-heading-text)]">{lesson.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {pathway.countryCode === "CA" ? "Canada" : "United States"} · {lesson.topic} · {lesson.bodySystem}
      </p>
      <div className="mt-4 space-y-3">
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
              <p className="mt-1 text-muted">Refresh shortly — previews below remain available.</p>
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

      <article className="mt-8 space-y-8">
        {visible.map((section) => (
          <section key={section.id} className="border-b border-[var(--theme-separator)] pb-8 last:border-0">
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">
              {section.heading?.trim() || "Section"}
            </h2>
            <div className="mt-3">
              <PathwayLessonBody text={typeof section.body === "string" ? section.body : ""} />
            </div>
          </section>
        ))}
      </article>

      <PathwayLessonQuizzes preTest={lesson.preTest} postTest={lesson.postTest} fullAccess={fullAccess} />

      {lockedSections.length > 0 ? <PathwayLessonLockedSectionsPreview sections={lockedSections} /> : null}

      <PathwayLessonActions pathwayId={pathway.id} lessonSlug={lesson.slug} userId={userId} canMarkComplete={fullAccess} />

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

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Related lessons · {lesson.topic}</h2>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`${base}/${r.slug}`} className="text-primary hover:underline">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
