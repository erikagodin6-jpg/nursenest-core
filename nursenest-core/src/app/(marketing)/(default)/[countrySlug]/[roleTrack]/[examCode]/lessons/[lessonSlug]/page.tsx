import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { PathwayLessonBody } from "@/components/lessons/pathway-lesson-body";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { buildExamPathwayPath, getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";
import { canViewFullPathwayLesson, visibleSectionsForLesson } from "@/lib/lessons/pathway-lesson-access";
import { getPathwayLesson, getPathwayLessons } from "@/lib/lessons/pathway-lesson-loader";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { pathwayLessonDetailBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

export const dynamic = "force-dynamic";

/** Avoid enumerating every lesson at build (large `.next` output + ENOSPC on small disks). */
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ countrySlug: string; roleTrack: string; examCode: string; lessonSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug, roleTrack, examCode, lessonSlug } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  const lesson = pathway ? getPathwayLesson(pathway.id, lessonSlug) : undefined;
  if (!pathway || !lesson) return {};
  const path = buildExamPathwayPath(pathway, `lessons/${lesson.slug}`);
  const origin = resolveCanonicalSiteOrigin().replace(/\/$/, "");
  return {
    title: lesson.seoTitle,
    description: lesson.seoDescription,
    alternates: { canonical: `${origin}${path}` },
    openGraph: { title: lesson.seoTitle, description: lesson.seoDescription, url: path },
  };
}

export default async function PathwayLessonDetailPage({ params }: Props) {
  const { countrySlug, roleTrack, examCode, lessonSlug } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();
  const lesson = getPathwayLesson(pathway.id, lessonSlug);
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

  const base = buildExamPathwayPath(pathway, "lessons");
  const related = getPathwayLessons(pathway.id).filter((l) => l.slug !== lesson.slug && l.topicSlug === lesson.topicSlug);
  const { crumbs, schemaItems } = pathwayLessonDetailBreadcrumbs(pathway, lesson.slug, lesson.title);

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

      {!fullAccess ? (
        <aside className="nn-card mt-6 border-primary/20 bg-primary/5 p-4 text-sm text-[var(--theme-body-text)]">
          <p className="font-semibold">Preview mode</p>
          <p className="mt-1 text-muted">
            You are seeing the public preview. Unlock the full lesson with a subscription that matches this exam pathway
            (country + tier). NP tracks: set your learner pathway in your profile to match this hub to avoid specialty
            mismatch.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/signup" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Start studying
            </Link>
            <Link href="/pricing" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
              View plans
            </Link>
          </div>
        </aside>
      ) : null}

      <article className="mt-8 space-y-8">
        {visible.map((section) => (
          <section key={section.id} className="border-b border-[var(--theme-separator)] pb-8 last:border-0">
            <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">{section.heading}</h2>
            <div className="mt-3">
              <PathwayLessonBody text={section.body} />
            </div>
          </section>
        ))}
      </article>

      {!fullAccess && lesson.sections.length > visible.length ? (
        <div className="nn-card mt-8 border-dashed border-primary/40 bg-[var(--theme-muted-surface)] p-6 text-center">
          <p className="font-semibold text-foreground">Unlock full lesson</p>
          <p className="mt-2 text-sm text-muted">
            {lesson.sections.length - visible.length} more section(s) include advanced application and exam-specific tips.
          </p>
          <Link href="/pricing" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            Unlock with a plan
          </Link>
        </div>
      ) : null}

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
        </Link>{" "}
        for related topics.
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
    </div>
  );
}
