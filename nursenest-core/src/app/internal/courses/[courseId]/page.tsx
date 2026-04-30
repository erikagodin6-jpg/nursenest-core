import Link from "next/link";
import { notFound } from "next/navigation";
import { InternalCourseModuleRenderer } from "@/components/internal-courses/internal-course-module-renderer";
import { requireInternalCoursesSurfaceAccess } from "@/lib/auth/guards";
import { getInternalCourseByIdForSurface } from "@/lib/internal-courses/load-internal-courses";
import { resolvePathwayLessonAppDetailHref } from "@/lib/internal-courses/resolve-pathway-lesson-app-href";
import { internalCourseRowVisibleOnInternalSurface } from "@/lib/internal-courses/surface-visibility";
import { getCatalogPathwayLessonDisplayTitleForSlug } from "@/lib/lessons/pathway-lesson-catalog-sync";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ courseId: string }> };

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

      <header className="mb-8 space-y-2 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Internal course</p>
        <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
        <p className="text-sm text-muted-foreground">{course.description}</p>
        <p className="font-mono text-[11px] text-muted-foreground">code: {course.code}</p>
        <p className="font-mono text-[11px] text-muted-foreground">
          status: {course.status} · pathways: {course.pathwayIds.join(", ") || "—"}
        </p>
      </header>

      <ol className="space-y-8">
        {course.modules.map((mod, i) => (
          <li key={mod.id} className="list-none">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Module {i + 1} · {mod.type.replaceAll("_", " ")}
            </p>
            <InternalCourseModuleRenderer mod={mod} lessonAppHref={lessonHrefs[i] ?? null} />
          </li>
        ))}
      </ol>
    </main>
  );
}
