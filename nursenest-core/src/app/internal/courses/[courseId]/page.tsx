import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InternalCourseModuleRenderer } from "@/components/internal-courses/internal-course-module-renderer";
import {
  InternalCourseModuleProgressShell,
  InternalCourseProgressBanner,
} from "@/components/internal-courses/internal-course-progress-client";
import { requireInternalCoursesSurfaceAccess } from "@/lib/auth/guards";
import { getInternalCourseByIdForSurface } from "@/lib/internal-courses/load-internal-courses";
import { resolvePathwayLessonAppDetailHref } from "@/lib/internal-courses/resolve-pathway-lesson-app-href";
import { internalCourseRowVisibleOnInternalSurface } from "@/lib/internal-courses/surface-visibility";
import { getCatalogPathwayLessonDisplayTitleForSlug } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { InternalCourseStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internal course",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type Props = { params: Promise<{ courseId: string }> };

function statusBadgeClass(status: InternalCourseStatus): string {
  switch (status) {
    case "draft":
      return "nn-badge-semantic-warning";
    case "internal":
      return "nn-badge-semantic-info";
    case "published":
      return "nn-badge-semantic-success";
    default:
      return "nn-badge-semantic-info";
  }
}

export default async function InternalCourseDetailPage({ params }: Props) {
  const { courseId } = await params;
  const { staff } = await requireInternalCoursesSurfaceAccess(`/internal/courses/${courseId}`);
  const course = await getInternalCourseByIdForSurface(courseId);
  if (!course) notFound();
  if (!internalCourseRowVisibleOnInternalSurface(staff, course.status)) notFound();

  const lessonHrefs = await Promise.all(
    course.modules.map((m) => resolvePathwayLessonAppDetailHref(m.pathwayId, m.lessonSlug)),
  );

  const linkedLessonKeys = new Map<string, { pathwayId: string; slug: string; title: string; href: string | null }>();
  for (let i = 0; i < course.modules.length; i++) {
    const m = course.modules[i];
    const pid = m.pathwayId?.trim() ?? "";
    const slug = m.lessonSlug?.trim() ?? "";
    if (!pid || !slug) continue;
    const key = `${pid}:${slug}`;
    if (linkedLessonKeys.has(key)) continue;
    const title = getCatalogPathwayLessonDisplayTitleForSlug(pid, slug)?.trim() ?? slug;
    linkedLessonKeys.set(key, { pathwayId: pid, slug, title, href: lessonHrefs[i] ?? null });
  }
  const courseLinkedLessons = [...linkedLessonKeys.values()];
  const moduleIdsInOrder = course.modules.map((m) => m.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <Link href="/internal/courses" className="font-medium text-primary underline-offset-4 hover:underline">
          All internal courses
        </Link>
        <Link href="/app" className="font-medium text-primary underline-offset-4 hover:underline">
          Learner app
        </Link>
      </div>

      <p className="mb-6 rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_8%,transparent)] px-4 py-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Internal lab.</span> Canonical lesson content remains in pathway
        lessons.
      </p>

      <InternalCourseProgressBanner courseId={course.id} moduleIdsInOrder={moduleIdsInOrder} />

      <header className="mb-8 space-y-3 border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Internal course</p>
            <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(course.status)}`}
          >
            {course.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{course.description}</p>
        <p className="font-mono text-[11px] text-muted-foreground">code: {course.code}</p>
        <p className="font-mono text-[11px] text-muted-foreground">
          pathway ids: {course.pathwayIds.join(", ") || "—"}
        </p>
      </header>

      {courseLinkedLessons.length > 0 ? (
        <section className="mb-10 rounded-lg border border-border bg-muted/20 p-4">
          <h2 className="text-sm font-semibold tracking-tight">Linked pathway lessons</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Deduped from module <code className="font-mono text-[11px]">pathwayId</code> +{" "}
            <code className="font-mono text-[11px]">lessonSlug</code> — titles from the catalog; opens the same learner
            lesson detail routes as modules below.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {courseLinkedLessons.map((row) => (
              <li key={`${row.pathwayId}:${row.slug}`}>
                {row.href ? (
                  <Link href={row.href} className="font-medium text-primary underline-offset-4 hover:underline">
                    {row.title}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">{row.title}</span>
                )}
                <span className="ml-1 font-mono text-[11px] text-muted-foreground">
                  ({row.pathwayId} · {row.slug})
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ol className="space-y-8">
        {course.modules.map((mod, i) => (
          <li key={mod.id} className="list-none">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Module {i + 1} · {mod.type.replaceAll("_", " ")}
            </p>
            <InternalCourseModuleProgressShell courseId={course.id} moduleId={mod.id}>
              <InternalCourseModuleRenderer mod={mod} lessonAppHref={lessonHrefs[i] ?? null} />
            </InternalCourseModuleProgressShell>
          </li>
        ))}
      </ol>
    </main>
  );
}
