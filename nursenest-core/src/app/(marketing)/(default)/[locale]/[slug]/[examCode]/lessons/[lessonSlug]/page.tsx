import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { PathwayLessonBody } from "@/components/lessons/pathway-lesson-body";
import { PathwayLessonLockedSectionsPreview } from "@/components/lessons/pathway-lesson-locked-sections-preview";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath, getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";
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
import { getPathwayLesson, getRelatedPathwayLessons } from "@/lib/lessons/pathway-lesson-loader";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { pathwayLessonDetailBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";

export const dynamic = "force-dynamic";

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
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  const contentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const lesson = pathway ? await getPathwayLesson(pathway.id, lessonSlug, contentLocale) : undefined;
  if (!pathway || !lesson) return {};
  const path = buildExamPathwayPath(pathway, `lessons/${lesson.slug}`);
  const canonical = absoluteUrl(path);
  return {
    title: lesson.seoTitle,
    description: lesson.seoDescription,
    alternates: { canonical },
    openGraph: { title: lesson.seoTitle, description: lesson.seoDescription, url: canonical, type: "article" },
  };
}

export default async function PathwayLessonDetailPage({ params }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, lessonSlug } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();
  const lessonContentLocale = defaultPathwayLessonContentLocaleForExamHubRoute();
  const lesson = await getPathwayLesson(pathway.id, lessonSlug, lessonContentLocale);
  if (!lesson) notFound();

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

  const base = buildExamPathwayPath(pathway, "lessons");
  const related = await getRelatedPathwayLessons(pathway.id, lesson.topicSlug, lesson.slug, undefined, lessonContentLocale);
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(pathway, lesson.slug, lesson.title);
  const requestedNorm = normalizePathwayLessonLocale(lessonContentLocale);
  const showLocaleFallbackNotice = Boolean(
    lesson.localeMeta &&
      (lesson.localeMeta.usedLocaleFallback ||
        (lesson.localeMeta.isCatalogEnglishSource && requestedNorm !== "en")),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={base} className="text-sm font-medium text-primary hover:underline">
        ← Lessons ({pathway.shortName})
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase text-primary">{pathway.displayName}</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[var(--theme-heading-text)]">{lesson.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {pathway.countrySlug === "canada" ? "Canada" : "United States"} · {lesson.topic} · {lesson.bodySystem}
      </p>
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
                We couldn’t confirm your plan (temporary server or data issue)—this is not the same as being denied access.
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

      {lockedSections.length > 0 ? <PathwayLessonLockedSectionsPreview sections={lockedSections} /> : null}

      <PathwayLessonActions
        pathwayId={pathway.id}
        lessonSlug={lesson.slug}
        userId={userId}
        canMarkComplete={fullAccess}
      />

      <p className="mt-6 text-sm text-muted">
        Also see:{" "}
        <Link href="/blog" className="font-medium text-primary hover:underline">
          clinical blog
        </Link>
        ,{" "}
        <Link href="/tools" className="font-medium text-primary hover:underline">
          free tools
        </Link>
        , and{" "}
        <Link href="/exam-lessons" className="font-medium text-primary hover:underline">
          other lesson hubs
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
        <Link href={`${base}/topics/${lesson.topicSlug}`} className="font-medium text-primary">
          {lesson.topic} cluster
        </Link>
      </div>

      <MarketingStudyCrossLinks className="mt-12" />
    </div>
  );
}
